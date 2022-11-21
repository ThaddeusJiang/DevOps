import { Condition, Cosmos, CosmosDatabase, CosmosDocument } from "node-cosmos";
import { collectionTestId } from "../test/data";
import { Host, MansionExtra, Task, TaskDefinition } from "../types";

const database = "mojito";
const collection =
  process.env.NODE_ENV === "test" ? collectionTestId : "ServiceManagement";

export type Partition = "Mansions" | "Customers" | "TaskDefinitions" | "Tasks";
// TODO: next step is to migrate record in the database
export const Partitions = {
  Mansions: "Mansions" as const,
  Hosts: "Customers" as const,
  TaskDefinitions: "TaskDefinitions" as const,
  Tasks: "Tasks" as const,
};

export class Database {
  // eslint-disable-next-line no-useless-constructor
  constructor(private db: CosmosDatabase) {}

  async find(
    partition: typeof Partitions.Mansions,
    condition: Condition
  ): Promise<MansionExtra[]>;

  async find(
    partition: typeof Partitions.Hosts,
    condition: Condition
  ): Promise<Host[]>;

  async find(
    partition: typeof Partitions.TaskDefinitions,
    condition: Condition
  ): Promise<TaskDefinition[]>;

  async find(
    partition: typeof Partitions.Tasks,
    condition: Condition
  ): Promise<Task[]>;

  async find(partition: Partition, condition: Condition): Promise<unknown[]>;

  async find(
    partition: string,
    condition: Condition
  ): Promise<CosmosDocument[]> {
    const customers = await this.db.find(collection, condition, partition);
    return customers || [];
  }

  async count(partition: Partition, condition: Condition): Promise<number> {
    const total = await this.db.count(collection, condition, partition);
    return total;
  }

  async read(
    partition: typeof Partitions.Mansions,
    id: string
  ): Promise<MansionExtra>;

  async read(partition: typeof Partitions.Hosts, id: string): Promise<Host>;

  async read(
    partition: typeof Partitions.TaskDefinitions,
    id: string
  ): Promise<TaskDefinition>;

  async read(partition: typeof Partitions.Tasks, id: string): Promise<Task>;

  async read(partition: Partition, id: string): Promise<unknown>;

  async read(partition: Partition, id: string): Promise<CosmosDocument> {
    return this.db.read(collection, id, partition);
  }

  async upsert(partition: string, data: CosmosDocument): Promise<string> {
    await this.db.upsert(collection, data, partition);
    return data.id;
  }

  async update(partition: Partition, data: CosmosDocument): Promise<string> {
    await this.db.update(collection, data, partition);
    return data.id;
  }

  async remove(partition: string, id: string): Promise<string> {
    await this.db.delete(collection, id, partition);
    return id;
  }
}

export async function getDatabase(): Promise<Database> {
  const db = await new Cosmos(process.env.DB_CONNECTION_STRING).getDatabase(
    database
  );
  return new Database(db);
}

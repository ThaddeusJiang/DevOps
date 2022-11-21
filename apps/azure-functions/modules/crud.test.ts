import { Database, Partitions, getDatabase } from "../clients/db";
import { baseHost, baseMansion, baseTaskDefinition } from "../test/data";
import { Host, MansionExtra } from "../types";
import { getById, getList } from "./crud";
import { cleanHosts, cleanMansions } from "./host";
import { cleanTaskDefinitions } from "./task";

let db: Database;

describe("CRUD", () => {
  beforeAll(async () => {
    db = await getDatabase();
  });

  afterEach(async () => {
    await Promise.all([
      await cleanMansions(db),
      await cleanHosts(db),
      await cleanTaskDefinitions(db),
    ]);
  });

  test("getList Customers", async () => {
    await Promise.all([
      await cleanHosts(db),
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "CrudCustomer1",
        plan: "Gold",
      }),
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "CrudCustomer2",
        plan: "Gold",
      }),
    ]);
    const { items, total } = await getList(db, Partitions.Hosts, {});

    expect(items).toHaveLength(2);
    expect(total).toBe(2);

    const host = items[0] as Host;
    expect(host.id).toBe("CrudCustomer2");
    expect(host.plan).toBe("Gold");
    expect(host.connectionString).toBeUndefined();
    expect(host.storageConnectionString).toBeUndefined();
    expect(host.xApiToken).toBeUndefined();
  });

  test("getList Mansion, the connectionString should be empty string and the storageConnectionString should be empty string ", async () => {
    await Promise.all([
      await db.upsert(Partitions.Mansions, {
        ...baseMansion,
        id: "CrudMansion1",
      }),
      await db.upsert(Partitions.Mansions, {
        ...baseMansion,
        id: "CrudMansion2",
      }),
    ]);
    const { items, total } = await getList(db, Partitions.Mansions, {});

    expect(items).toHaveLength(2);
    expect(total).toBe(2);

    const mansion0 = items[0] as MansionExtra;

    expect(mansion0.connectionString).toBeUndefined();
    expect(mansion0.storageConnectionString).toBeUndefined();
    expect(mansion0.appServices).toBeUndefined();
    expect(mansion0.cosmosDB).toBeUndefined();
    expect(mansion0.storage).toBeUndefined();

    const mansion1 = items[1] as MansionExtra;
    expect(mansion1.connectionString).toBeUndefined();
    expect(mansion1.storageConnectionString).toBeUndefined();
    expect(mansion1.appServices).toBeUndefined();
    expect(mansion1.cosmosDB).toBeUndefined();
    expect(mansion1.storage).toBeUndefined();
  });

  test("getList Mansion, the hostCount should return hosts count belongs the mansion", async () => {
    const mansionId = "hostCount.mojito.dev";
    await db.upsert(Partitions.Mansions, {
      ...baseMansion,
      id: mansionId,
    });
    const hostNum = 4;
    for (let i = 0; i < hostNum; i += 1) {
      const newHost = { ...baseHost, id: `host${i}.mojito.dev` };
      newHost.mansion.id = mansionId;
      db.upsert(Partitions.Hosts, newHost);
    }
    const { items } = await getList(db, Partitions.Mansions, {});
    const mansionList = items.filter(
      (mansion: MansionExtra) => mansion.id === mansionId
    ) as MansionExtra[];
    expect(mansionList).toHaveLength(1);
    const mansion = mansionList[0];
    expect(mansion.hostCount).toBe(hostNum);
  });

  test("getList TaskDefinition", async () => {
    await Promise.all([
      await db.upsert(Partitions.TaskDefinitions, {
        ...baseTaskDefinition,
        id: "CrudTaskDefinition1",
      }),
      await db.upsert(Partitions.TaskDefinitions, {
        ...baseTaskDefinition,
        id: "CrudTaskDefinition2",
      }),
      await db.upsert(Partitions.TaskDefinitions, {
        ...baseTaskDefinition,
        id: "CrudTaskDefinition3",
      }),
    ]);

    const { items, total } = await getList(db, Partitions.TaskDefinitions, {
      offset: 0,
      limit: 2,
    });

    expect(items).toHaveLength(2);
    expect(total).toBe(3);
  });

  test("get Customer should except the secrets and include 'createdAt' time", async () => {
    await Promise.all([
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "CrudCustomer1",
        plan: "Gold",
      }),
    ]);
    const host: any = await getById(db, Partitions.Hosts, "CrudCustomer1");

    expect(host?.id).toBe("CrudCustomer1");
    expect(host?.plan).toBe("Gold");
    expect(host?.connectionString).toBeUndefined();
    expect(host?.storageConnectionString).toBeUndefined();
    expect(host?.xApiToken).toBeUndefined();
    expect(host.createdAt).toBeDefined();
  });
});

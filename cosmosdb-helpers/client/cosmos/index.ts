import { CosmosClient } from "@azure/cosmos";

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

const client = new CosmosClient(DB_CONNECTION_STRING);

export const deleteCosmosContainers = async (
  databaseId: string,
  containers: string[]
) => {
  const database = await client.database(databaseId);
  try {
    Promise.all(
      containers.map(async (item) => await database.container(item).delete())
    );
    return [null, { databaseId, containers }];
  } catch (error) {
    return [error, null];
  }
};

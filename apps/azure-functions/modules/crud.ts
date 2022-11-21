import { pick } from "lodash";
import { Condition } from "node-cosmos";

import { Database, Partition, Partitions } from "../clients/db";
import { Mansion, MansionExtra } from "../types";

const defaultCondition: { sort: [string, string] } = {
  sort: ["id", "DESC"],
};

const pickMansionFields = (mansion) => ({
  ...pick(mansion, ["id", "databaseId", "domain", "frontDoorName"]),
});

const pickHostFields = (host) => ({
  ...pick(host, [
    "id",
    "products",
    "plan",
    "selectedFeatures",
    "romuFeatures",
    "kintaiFeatures",
    "kyuyoFeatures",
    "databaseName",
    "collectionName",
    "storagePrefix",
    "memo",
    "state",
    "createdAt",
  ]),
  mansion: pickMansionFields(host.mansion),
});

export const mansionMapper = (db: Database) => async (
  mansion: Mansion
): Promise<Partial<MansionExtra>> => {
  // The method used now causes a loop query and
  // may have performance issues, perhaps a GROUP BY
  // statement would be better.
  const hostCount: number = await db.count(Partitions.Hosts, {
    filter: {
      "mansion.id": mansion.id,
    },
  });
  return { ...pickMansionFields(mansion), hostCount };
};

type ListResult = { items: unknown[]; total: number };

export const getList = async (
  db: Database,
  partition: Partition,
  condition: Condition
): Promise<ListResult> => {
  const items = await db.find(partition, {
    ...defaultCondition,
    ...condition,
  });
  const total = await db.count(partition, {
    ...defaultCondition,
    ...condition,
  });

  switch (partition) {
    case Partitions.Mansions:
      return {
        items: await Promise.all(items.map(mansionMapper(db))),
        total,
      };
    case Partitions.Hosts:
      return {
        items: items.map(pickHostFields),
        total,
      };

    default: {
      return {
        items,
        total,
      };
    }
  }
};

export const getById = async (db: Database, partition: Partition, id: string) => {
  const result = await db.read(partition, id);
  switch (partition) {
    case Partitions.Mansions:
      return mansionMapper(db)(result as Mansion);
    case Partitions.Hosts:
      return pickHostFields(result);
    default:
      return result;
  }
};

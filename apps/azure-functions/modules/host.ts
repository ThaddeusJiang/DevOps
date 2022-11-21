import axios from "axios";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { Database, Partitions } from "../clients/db";
import {
  addHostToFrontdoor,
  createCNAMERecord,
  createCosmosDBContainer,
  deleteCNAMERecord,
  removeHostFromFrontdoor,
} from "../clients/rm";
import { Host } from "../types";
import { deleteTasks } from "./task";

const AZURE_DNS_ZONE = process.env?.AZURE_DNS_ZONE;

// only for test clean data
export const cleanMansions = async (db: Database) => {
  const mansions = await db.find(Partitions.Mansions, {});

  await Promise.all(
    mansions.map(async (mansion) => {
      await db.remove(Partitions.Mansions, mansion.id);
    })
  );
};

// only for test clean data
export const cleanHosts = async (db: Database) => {
  const hosts = await db.find(Partitions.Hosts, {});

  await Promise.all(
    hosts.map(async (host) => {
      await db.remove(Partitions.Hosts, host.id);
    })
  );
};

const generateHostRecord = ({
  mansion,
  cname,
  plan,
  memo,
  selectedFeatures,
  products,
  romuFeatures,
  kintaiFeatures,
  kyuyoFeatures,
}): Host => {
  const collectionName = `Data_${cname}`;
  const storagePrefix = `${cname}`;

  const host: Host = {
    id: `${cname}.${AZURE_DNS_ZONE}`,
    products,
    plan,
    selectedFeatures,
    romuFeatures,
    kintaiFeatures,
    kyuyoFeatures,
    connectionString: mansion.connectionString,
    storageConnectionString: mansion.storageConnectionString,
    // FIXME: rename to mansion.databaseName
    databaseName: mansion.databaseId,
    collectionName,
    storagePrefix,
    xApiToken: uuidv4(),
    mansion,
    memo,
    createdAt: dayjs().toISOString(),
  };

  return host;
};

/**
 * steps:
 * 1. create host record in database
 * 2. create cosmosdb container
 * 3. create cname record
 * 4. add host to frontdoor
 */
export const createHost = async (
  db: Database,
  {
    mansionId,
    cname,
    plan,
    memo,
    selectedFeatures,
    products,
    romuFeatures,
    kintaiFeatures,
    kyuyoFeatures,
  }
) => {
  try {
    const mansion = await db.read(Partitions.Mansions, mansionId);
    const { connectionString, databaseId, frontDoorName } = mansion;

    const host = generateHostRecord({
      mansion,
      cname,
      plan,
      memo,
      selectedFeatures,
      products,
      romuFeatures,
      kintaiFeatures,
      kyuyoFeatures,
    });
    await db.upsert(Partitions.Hosts, { ...host, state: "creating" });

    createCosmosDBContainer(connectionString, databaseId, `Data_${cname}`);
    db.update(Partitions.Hosts, { id: host.id, state: "created" });

    createCNAMERecord(frontDoorName, cname);
    addHostToFrontdoor(frontDoorName, cname);
    db.update(Partitions.Hosts, { id: host.id, state: "publishing" });

    return host;
  } catch (error) {
    console.error(error);
  }
};

/**
 * steps:
 * 1. delete host record in database
 * 2. delete tasks with host id
 * 3. delete host from DNS Zone
 * 4. delete host from frontdoor
 *
 * @param db
 * @param hostId
 */
export const deleteHost = async (db: Database, hostId) => {
  try {
    const host = await db.read(Partitions.Hosts, hostId);
    await db.remove(Partitions.Hosts, hostId);
    await deleteTasks(db, hostId);
    const [cname] = hostId.split(".");
    await deleteCNAMERecord(cname);
    await removeHostFromFrontdoor(host.mansion.frontDoorName, cname);
    return hostId;
  } catch (error) {
    console.error(error);
  }
};

export const accessHosts = async (db: Database) => {
  const hosts = await db.find(Partitions.Hosts, {
    filter: {
      state: ["created", "publishing"],
    },
  });

  await Promise.all(
    hosts.map(async (host) => {
      try {
        const url = `https://${host.id}/api/healthcheck/`;
        const res = await axios.get(url);
        const { apiStatus, dbStatus } = res.data;
        if (apiStatus === "ok" && dbStatus === "ok") {
          await db.update(Partitions.Hosts, { id: host.id, state: "published" });
        }
      } catch (error) {
        console.error(error);
      }
    })
  );
};

export const confirmHost = async (db: Database, hostId) => {
  await db.update(Partitions.Hosts, { id: hostId, state: "confirmed" });
};

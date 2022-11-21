/* eslint-disable import/no-unresolved */
import { AzureFunction, Context, HttpRequest, HttpRequestQuery } from "@azure/functions";

import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { Database, Partition, Partitions, getDatabase } from "../clients/db";
import {
  getDatabaseAccountConnectionString,
  getStorageAccountConnectionString,
} from "../clients/rm";
import { getById, getList } from "../modules/crud";
import { createHost, deleteHost } from "../modules/host";
import { updateTaskDefinition } from "../modules/task";
import { safeJSONparse } from "../utils/json";

const queryList = async (
  context: Context,
  db: Database,
  query: HttpRequestQuery,
  partition: Partition
): Promise<void> => {
  const condition = safeJSONparse(query.query, context.log.warn) ?? {};
  const { offset, limit } = condition;
  const { total, items } = await getList(db, partition, condition);

  const last = offset + limit > total ? total : offset + limit;

  context.res = {
    status: 200,
    headers: {
      "Access-Control-Expose-Headers": "Content-Range",
      "Content-Range": `${partition} ${offset}-${last}/${total}`,
    },
    body: items,
  };
};

const httpTrigger: AzureFunction = async function httpTrigger(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function `curd` processed a request.");
  const { method, body, query } = req;
  const { partition, id } = context.bindingData;
  const db = await getDatabase();

  switch (method) {
    case "GET": {
      if (id === undefined) {
        await queryList(context, db, query, partition);
      } else {
        const result = await getById(db, partition, id);
        // const result = await db.read(partition, id);
        context.res = {
          status: 200,
          body: result,
        };
      }
      break;
    }
    case "DELETE": {
      if (id === undefined) {
        context.res = {
          status: 400,
          body: {
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Bad Request",
          },
        };
      } else {
        let result;
        if (partition === Partitions.Hosts) {
          await deleteHost(db, id);

          context.res = {
            status: 200,
            body: {
              host: id,
            },
          };
        } else {
          result = await db.remove(partition, id);
          context.res = {
            status: 200,
            body: result,
          };
        }
      }
      break;
    }

    case "POST": {
      if (partition === Partitions.Hosts) {
        const {
          mansionId,
          cname,
          plan,
          memo,
          selectedFeatures,
          products,
          romuFeatures,
          kintaiFeatures,
          kyuyoFeatures,
        } = body;

        const host = await createHost(db, {
          mansionId,
          cname,
          plan,
          memo,
          selectedFeatures,
          products,
          romuFeatures,
          kintaiFeatures,
          kyuyoFeatures,
        });

        context.res = {
          status: 201,
          body: host.id,
        };
      } else if (partition === Partitions.Mansions) {
        const {
          mansionId,
          domain,
          frontDoorName,
          appServices,
          cosmosDB: cosmosDBData,
          storage: storageData,
        } = body;

        const connectionString = await getDatabaseAccountConnectionString(
          cosmosDBData.databaseAccount
        );
        const cosmosDB = { ...cosmosDBData, connectionString };

        const storageConnectionString = await getStorageAccountConnectionString(
          storageData.storageAccount
        );
        const storage = { ...storageData, storageConnectionString };

        // Data redundancy for compatibility
        await db.upsert(partition, {
          id: mansionId,
          connectionString,
          storageConnectionString,
          databaseId: cosmosDB?.databaseName,
          domain,
          frontDoorName,
          appServices,
          cosmosDB,
          storage,
          createdAt: dayjs().toISOString(),
        });

        context.res = {
          status: 201,
          body: mansionId,
        };
      } else {
        const uuid = uuidv4();
        await db.upsert(partition, { ...body, createdAt: dayjs().toISOString(), id: uuid });
        context.res = {
          status: 201,
          body: uuid,
        };
      }

      break;
    }

    case "PUT": {
      if (partition === Partitions.TaskDefinitions) {
        await updateTaskDefinition(db, id, body);
      } else {
        // common update
        await db.update(partition, body);
        context.res = {
          status: 200,
        };
      }
      break;
    }
    default: {
      context.res = {
        status: 405,
        body: `Method ${method} Not Allowed`,
      };
    }
  }
};

export default httpTrigger;

/* eslint-disable import/no-unresolved */
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";
import { getDatabase, Partitions } from "../clients/db";

const initSampleData = async (hostId, token) => {
  const url = `https://${hostId}/api/admin/sampledata/init?token=nisshin2020&force=true`;

  try {
    const res = await axios.get(url, {
      headers: {
        "x-api-token": token,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function `initSampleData` processed a request.");
  const hostId = context.bindingData?.hostId;

  const db = await getDatabase();
  try {
    const host = await db.read(Partitions.Hosts, hostId);
    const res = await initSampleData(hostId, host.xApiToken);

    context.res = {
      status: res.status,
      body: res.data,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error,
    };
  }
};

export default httpTrigger;

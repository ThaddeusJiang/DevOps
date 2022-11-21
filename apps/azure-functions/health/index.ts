import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  isHealthyOfStorage,
  isHealthyOfDB,
  isHealthyOfDNS,
  isHealthyOfFrontDoor,
} from "../clients/rm";

const DB_CONNECTION_STRING = process.env?.DB_CONNECTION_STRING ?? "";
const STORAGE_CONNECTION_STRING = process.env?.AzureWebJobsStorage ?? "";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function `health` processed a request.");

  // checkDB
  const healthyOfDB = isHealthyOfDB(DB_CONNECTION_STRING);
  //   checkStorage
  const healthyOfStorage = isHealthyOfStorage(STORAGE_CONNECTION_STRING);
  // checkDNS
  const healthyOfDNS = isHealthyOfDNS();
  // checkFrontdoor
  const healthyOfFrontdoor = isHealthyOfFrontDoor();

  context.res = {
    status: healthyOfDB && healthyOfStorage && healthyOfDNS && healthyOfFrontdoor ? 200 : 500,
    body: {
      db: healthyOfDB,
      storage: healthyOfStorage,
      dns: healthyOfDNS,
      frontdoor: healthyOfFrontdoor,
    },
  };
};

export default httpTrigger;

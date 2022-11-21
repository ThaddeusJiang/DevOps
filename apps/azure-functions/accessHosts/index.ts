import { AzureFunction, Context } from "@azure/functions";
import { getDatabase } from "../clients/db";
import { accessHosts } from "../modules/host";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  context.log("Time trigger function `accessHosts` processed a request.");
  const db = await getDatabase();
  await accessHosts(db);
};

export default timerTrigger;

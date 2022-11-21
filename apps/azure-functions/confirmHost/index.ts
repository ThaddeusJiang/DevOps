import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getDatabase } from "../clients/db";
import { confirmHost } from "../modules/host";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function `confirmHost` processed a request.");
  const { hostId } = context.bindingData;
  const db = await getDatabase();
  try {
    await confirmHost(db, hostId);
    context.res = {
      body: "confirmed",
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error,
    };
  }
};

export default httpTrigger;

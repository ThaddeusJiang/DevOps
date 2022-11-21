import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { scheduleTasks } from "../modules/task";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function `manualScheduleTasks` processed a request.");
  const tasks = await scheduleTasks(new Date().toISOString(), true);

  context.res = {
    body: tasks,
  };
};

export default httpTrigger;

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import dayjs from "dayjs";

import { runTasksInDateRange } from "../runTasks/utils";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger `runTaskManual` function processed a request.");

  const start = req.query.start ?? dayjs().subtract(1, "day").toISOString();
  const end = req.query.end ?? dayjs().add(1, "day").toISOString();
  const tasks = await runTasksInDateRange(start, end);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      message: "OK",
      tasks,
    },
  };
};

export default httpTrigger;

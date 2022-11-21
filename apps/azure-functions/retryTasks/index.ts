import { AzureFunction, Context } from "@azure/functions";

import { runRetryableTasks } from "../runTasks/utils";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  const tasks = await runRetryableTasks();

  context.log(
    "--- The retryTasks function has ran tasks. ---",
    tasks.map((item) => item.id)
  );
};

export default timerTrigger;

/* eslint-disable import/no-unresolved */
import { AzureFunction, Context } from "@azure/functions";
import { scheduleTasks } from "../modules/task";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  context.log("Time trigger function `scheduleTasks` processed a request.");
  const timeStamp = new Date();

  const tasks = await scheduleTasks(timeStamp.toISOString());

  context.log(
    `--- The scheduleTasks function has generated ${tasks.length} tasks. ---`,
    tasks.map((item) => item.id)
  );
};

export default timerTrigger;

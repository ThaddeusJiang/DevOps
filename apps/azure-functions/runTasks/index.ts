import { AzureFunction, Context } from "@azure/functions";
import dayjs from "dayjs";
import { runTasksInDateRange } from "./utils";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  const time = dayjs();
  const start = time.subtract(5, "minute").toISOString();
  const end = time.toISOString();

  const tasks = await runTasksInDateRange(start, end);

  context.log(
    "--- The runTasks function has ran tasks. ---",
    tasks.map((item) => item.id)
  );
};

export default timerTrigger;

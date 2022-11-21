/* eslint-disable import/no-unresolved */
import { AzureFunction, Context } from "@azure/functions";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { sendNotification } from "../modules/notification";
import { findUnusualTasks, unusualTasksMessage } from "../modules/task";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  context.log("Time trigger function `checkTasks` processed a request.");
  const time = dayjs();
  const start = time.tz("Asia/Tokyo").startOf("day").toISOString();
  const end = time.toISOString();

  const tasks = await findUnusualTasks(start, end);

  if (tasks.length > 0) {
    context.log(
      "--- Find Unusual tasks ---",
      tasks.map((item) => item.id)
    );
    context.log("--- Have sent notification! ---");
    const message = unusualTasksMessage(tasks, time.tz("Asia/Tokyo").format("LLLL"));
    await sendNotification(message);
  }
};

export default timerTrigger;

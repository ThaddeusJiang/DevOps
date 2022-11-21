import axios from "axios";
import dayjs from "dayjs";

import { getDatabase } from "../clients/db";
import { Task } from "../types";
import { safeJSONparse } from "../utils/json";

const JOB_SECRET = process.env?.JOB_SECRET ?? "mojito";

export const sha256hash = async (secret: string, id: string) => {
  const { createHash } = await import("crypto");
  const hash = createHash("sha256");
  hash.update(`${secret}${id}`);
  return hash.digest("hex");
};

export const runTask = async (task: Task) => {
  const hash = await sha256hash(JOB_SECRET, task.id);
  const config = {
    headers: {
      sha256hash: hash,
    },
  };

  const taskType = task.type || "http";
  const urlField = taskType === "http" ? "url" : "clazz";
  const body = {
    [urlField]: task.httpRequest.body.api,
    method: task.httpRequest.body.method,
    params: safeJSONparse(task.httpRequest.body.params) ?? {},
  };

  try {
    const data = {
      id: task.id,
      name: task.name,
      host: task.host,
      type: taskType,
      // state: task.state, // TODO: API should support scheduled and queued and failed and etc.
      // 2022-06-08 update: Backend developer say this state should keep "scheduled" so it can be execute
      state: "scheduled",
      callbackUrl: task.callbackUrl,
      httpRequest: JSON.stringify(body),
    };
    const executeURL = `https://${task.host}/api/tasks/execute`;
    const res = await axios.put(executeURL, data, config);
    return {
      id: task.id,
      state: res.data.state,
    };
  } catch (error) {
    return {
      id: task.id,
      state: "failed",
      failedReason: error.message,
    };
  }
};

export const queryTasks = async (
  start: string,
  end: string,
  state = "scheduled"
) => {
  const db = await getDatabase();
  const condition = {
    filter: {
      "scheduledStartedAt >": start,
      "scheduledStartedAt <=": end,
      state,
    },
    offset: 0,
    limit: 100,
  };
  // FIXME: should use Partitions.Tasks, but the jest test is not working. I don't know why. https://github.com/ThaddeusJiang/mojito-admin/runs/4391582560?check_suite_focus=true#step:5:816
  // const tasks = await db.find(Partitions.Tasks, condition);
  return db.find("Tasks", condition);
};

export const runTasks = async (tasks: Task[]) => {
  const db = await getDatabase();

  await Promise.all(
    tasks.map(async (task) => {
      setTimeout(async () => {
        const partialTask = await runTask(task as Task);
        // FIXME: should use Partitions.Tasks, but the jest test is not working. I don't know why. https://github.com/ThaddeusJiang/mojito-admin/runs/4391582560?check_suite_focus=true#step:5:816
        await db.update("Tasks", partialTask);
      }, 10);
    })
  );

  return tasks;
};

export const runTasksInDateRange = async (start: string, end: string) => {
  const tasks = await queryTasks(start, end);
  return runTasks(tasks);
};

export const filterGatewayErrorTasks = (tasks: Task[]) =>
  tasks.filter((task) =>
    task.failedReason
      ? ["503", "504"].some((statusCode) =>
          task.failedReason.includes(statusCode)
        )
      : false
  );

/*
  1. start at today 0:00, end at now
  2. failed tasks and only 503/504 gateway error should be retry
*/
export const runRetryableTasks = async () => {
  const end = dayjs().tz("Asia/Tokyo");
  const start = end.startOf("day");
  const tasks = await queryTasks(
    start.toISOString(),
    end.toISOString(),
    "failed"
  );
  const gatewayErrorTasks = filterGatewayErrorTasks(tasks);
  return runTasks(gatewayErrorTasks);
};

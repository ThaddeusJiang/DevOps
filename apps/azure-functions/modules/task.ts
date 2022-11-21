import dayjs from "dayjs";
import cronParser, { CronDate } from "cron-parser";
import { v4 as uuidv4 } from "uuid";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { getDatabase, Database, Partitions } from "../clients/db";
import { Host, Task, TaskDefinition } from "../types";
import { GARDEN_NAME } from "../utils/env";

export const computeHostOffset = (host: string): number => {
  const [cname] = host.split(".");
  const offset =
    cname.split("").reduce((acc, curr) => acc + curr.charCodeAt(0), 0) % 60;
  return offset;
};

export const generateBaseTask = (
  taskDefinition: TaskDefinition,
  domain: string
) => {
  const apiType = taskDefinition?.type || "http";
  const baseTask = {
    name: `${taskDefinition.description} / ${domain}`,
    definitionId: taskDefinition.id,
    host: domain,
    elapsed: 0,
    retryTimes: 0,
    state: "scheduled",
    type: apiType,
    httpRequest: {
      // TODO: remove this nested object
      body: {
        api:
          apiType === "http"
            ? `https://${domain}${taskDefinition.httpRequest.body.api}`
            : taskDefinition.httpRequest.body.api,
        method: taskDefinition.httpRequest.body.method,
        params: taskDefinition.httpRequest.body.params ?? "{}",
      },
    },
  };
  return baseTask;
};

export const generateOneDayTasks = (
  taskDefinition: TaskDefinition,
  host: Host,
  date: string
) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { id: domain, timezone: tz = "Asia/Tokyo" } = host;

  const startOfToday = dayjs(date).tz(tz).startOf("day");
  const options = {
    currentDate: startOfToday.toDate(),
    endDate: startOfToday.add(1, "day").toDate(),
    iterator: true,
    tz,
  };

  const baseTask = generateBaseTask(taskDefinition, domain);

  let tasks = [];
  try {
    const interval = cronParser.parseExpression(
      taskDefinition.cronExpression,
      options
    );

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const obj = interval.next() as IteratorResult<CronDate>;

        tasks.push({
          ...baseTask,
          scheduledStartedAt: obj.value.toISOString(),
        });
      } catch (e) {
        break;
      }
    }
  } catch (error) {
    tasks = [];
  }
  return tasks;
};

const BASE_CALLBACK_URL = process.env?.BASE_CALLBACK_URL ?? "";

export const fixDate = (date: string, baseDate: string) => {
  const diff = dayjs(baseDate).diff(dayjs(date), "hour");
  return dayjs(date)
    .add(diff + 2, "hour")
    .toISOString();
};

export const scheduleTasks = async (date: string, isFix?: boolean) => {
  const results = [];

  const db = await getDatabase();

  const taskDefinitions = await db.find(Partitions.TaskDefinitions, {
    filter: {
      activated: true,
    },
    offset: 0,
    limit: 1000,
  });

  const hosts = await db.find(Partitions.Hosts, {
    filter: {
      "id !=": "localhost",
    },
    offset: 0,
    limit: 1000,
  });

  const filteredHosts = hosts.filter(
    (host) =>
      !host.id.includes(".azurewebsites.net") &&
      !host.id.includes(".azurefd.net")
  );

  taskDefinitions.forEach((taskDefinition) => {
    filteredHosts.forEach((host) => {
      const hostOffset = computeHostOffset(host.id);
      const tasks = generateOneDayTasks(
        taskDefinition as TaskDefinition,
        host as Host,
        date
      );
      const uuid = uuidv4();
      tasks.forEach(async (task) => {
        const scheduledStartedAt = isFix
          ? fixDate(task.scheduledStartedAt, date)
          : task.scheduledStartedAt;

        results.push({
          ...task,
          id: uuid,
          callbackUrl: `${BASE_CALLBACK_URL}/api/callback/tasks/${uuid}`,
          scheduledStartedAt: dayjs(scheduledStartedAt)
            .add(hostOffset, "minute")
            .toISOString(),
        });
      });
    });
  });

  await Promise.all(
    results.map(async (task) => {
      await db.upsert(Partitions.Tasks, task);
    })
  );

  return results;
};

export const findUnusualTasks = async (
  start: string,
  end: string
): Promise<Task[]> => {
  const db = await getDatabase();
  const condition = {
    filter: {
      state: ["scheduled", "queued", "failed"],
      "scheduledStartedAt >": start,
      "scheduledStartedAt <=": end,
    },
    offset: 0,
    limit: 1000,
  };
  const tasks = await db.find(Partitions.Tasks, condition);

  return tasks;
};

const WebHost = process.env.WEB_HOST;

const taskToTextBlock = (task: Task) => ({
  type: "TextBlock",
  text: `[${task.name}](${WebHost}/tasks/${task.id})`,
  wrap: true,
});

export const unusualTasksMessage = (tasks: Task[], date) => ({
  type: "message",
  attachments: [
    {
      contentType: "application/vnd.microsoft.card.adaptive",
      contentUrl: null,
      content: {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.2",
        // TODO: no work
        // msteams: {
        //   entities: [
        //     {
        //       type: "mention",
        //       text: "<at>Jiang Jifa</at>",
        //       mentioned: {
        //         id: "jiang.jifa@mojito.jp",
        //         name: "Jiang Jifa",
        //       },
        //     },
        //   ],
        // },
        body: [
          {
            type: "TextBlock",
            size: "Medium",
            weight: "Bolder",
            text: `Alert - ${
              GARDEN_NAME ?? "Unknown Garden"
            } - found some unusual tasks!`,
            wrap: true,
            style: "heading",
          },
          {
            type: "TextBlock",
            spacing: "None",
            text: `Checked at ${date}`,
            isSubtle: true,
            wrap: true,
          },
          {
            type: "Container",
            items: [
              {
                type: "ColumnSet",
                columns: [
                  {
                    type: "Column",
                    items: tasks.map((item, index) => ({
                      type: "TextBlock",
                      text: `${index}.`,
                    })),
                    width: "auto",
                  },
                  {
                    type: "Column",
                    items: tasks.map(taskToTextBlock),
                    width: "auto",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
});

// only for test clean data
export const cleanTasks = async (db: Database) => {
  const tasks = await db.find(Partitions.Tasks, {});
  await Promise.all(
    tasks.map(async (task) => {
      await db.remove(Partitions.Tasks, task.id);
    })
  );
};

// only for test clean data
export const cleanTaskDefinitions = async (db: Database) => {
  const tasks = await db.find(Partitions.TaskDefinitions, {});
  await Promise.all(
    tasks.map(async (task) => {
      await db.remove(Partitions.TaskDefinitions, task.id);
    })
  );
};

export const deleteTasks = async (db: Database, host) => {
  const tasks = await db.find(Partitions.Tasks, {
    filter: { host },
  });
  await Promise.all(
    tasks.map(async (task) => {
      await db.remove(Partitions.Tasks, task.id);
    })
  );

  return tasks;
};

export const updateTaskDefinition = async (
  db: Database,
  id,
  taskDefinition
) => {
  await db.update(Partitions.TaskDefinitions, {
    id,
    ...taskDefinition,
  });
};

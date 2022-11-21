import dayjs from "dayjs";

import { Host } from "../types";
import {
  cleanTasks,
  computeHostOffset,
  deleteTasks,
  findUnusualTasks,
  fixDate,
  generateBaseTask,
  generateOneDayTasks,
  scheduleTasks,
  unusualTasksMessage,
} from "./task";

import { getDatabase, Database, Partitions } from "../clients/db";
import {
  baseHost,
  baseMethodInvokeTaskDefinition,
  baseTask,
  baseTaskDefinition,
} from "../test/data";
import { cleanHosts } from "./host";

let db: Database;

describe(Partitions.Tasks, () => {
  beforeAll(async () => {
    db = await getDatabase();
  });

  beforeEach(async () => {
    // cleanup
    await cleanHosts(db);
    await cleanTasks(db);
  });

  afterAll(async () => {
    db = null;
  });

  it("findUnusualTasks", async () => {
    const scheduledStartedAt = dayjs().set("hour", 16);
    try {
      // prepare data
      await Promise.all([
        await db.upsert(Partitions.Tasks, {
          ...baseTask,
          // memo: Jest is parallel, so we have to set the different id for each test
          id: "findUnusualTasks test1",
          state: "scheduled",
          scheduledStartedAt: scheduledStartedAt.toISOString(),
        }),
        await db.upsert(Partitions.Tasks, {
          ...baseTask,
          id: "findUnusualTasks test2",
          state: "queued",
          scheduledStartedAt: scheduledStartedAt.toISOString(),
        }),
        await db.upsert(Partitions.Tasks, {
          ...baseTask,
          id: "findUnusualTasks test3",
          state: "failed",
          scheduledStartedAt: scheduledStartedAt.toISOString(),
        }),
        await db.upsert(Partitions.Tasks, {
          ...baseTask,
          id: "findUnusualTasks test4",
          state: "success",
          scheduledStartedAt: scheduledStartedAt.toISOString(),
        }),
        await db.upsert(Partitions.Tasks, {
          ...baseTask,
          id: "findUnusualTasks test4",
          state: "success",
          scheduledStartedAt: scheduledStartedAt.toISOString(),
        }),
      ]);

      const tasks = await findUnusualTasks(
        scheduledStartedAt.set("hour", 15).toISOString(),
        scheduledStartedAt.set("hour", 17).toISOString()
      );

      expect(tasks.length).toEqual(3);

      const noTasks = await findUnusualTasks(
        scheduledStartedAt.add(1, "minute").toISOString(),
        scheduledStartedAt.add(2, "minute").toISOString()
      );
      expect(noTasks.length).toEqual(0);
    } finally {
      // cleanup
    }
  });

  it("scheduleTasks, except localhost and ?.azurewebsites.net", async () => {
    try {
      // prepare data
      await db.upsert(Partitions.TaskDefinitions, {
        ...baseTaskDefinition,
        id: "taskDefinition1",
      });
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "host1",
      });
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "host2",
      });

      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "localhost",
      });
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "xxx.azurewebsites.net",
      });

      const tasks = await scheduleTasks("2021-10-23T15:00:00.000Z");

      expect(tasks.length).toEqual(2);

      // definition: 01:25 + host offset: 15 minutes = 01:40 (Tokyo) = 16:40 (ISO)
      expect(tasks[0].scheduledStartedAt).toEqual("2021-10-23T16:40:00.000Z");
      // definition: 01:25 + host offset: 16 minutes = 01:41 (Tokyo) = 16:41 (ISO)
      expect(tasks[1].scheduledStartedAt).toEqual("2021-10-23T16:41:00.000Z");
    } finally {
      // cleanup
      await db.remove(Partitions.TaskDefinitions, "taskDefinition1");
      await db.remove(Partitions.Hosts, "host1");
      await db.remove(Partitions.Hosts, "host2");
      await db.remove(Partitions.Hosts, "localhost");
      await db.remove(Partitions.Hosts, "xxx.azurewebsites.net");
    }
  });

  it("manualScheduleTasks, except localhost and ?.azurewebsites.net and ?.azurefd.net", async () => {
    try {
      // prepare data
      await db.upsert(Partitions.TaskDefinitions, {
        ...baseTaskDefinition,
        id: "taskDefinition1",
      });
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "host1",
      });
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "host2",
      });
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "localhost",
      });

      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "xxx.azurewebsites.net",
      });

      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "xxx.azurefd.net",
      });

      const tasks = await scheduleTasks("2021-10-23T01:31:00.000Z", true);

      expect(tasks.length).toEqual(2);

      // definition: 01:25 + host offset: 15 minutes + from 01:31 = 01:40 (Tokyo) = 16:40 (ISO)
      expect(tasks[0].scheduledStartedAt).toEqual("2021-10-23T03:40:00.000Z");
      // definition: 01:25 + host offset: 16 minutes + from 01:31 = 01:41 (Tokyo) = 16:41 (ISO)
      expect(tasks[1].scheduledStartedAt).toEqual("2021-10-23T03:41:00.000Z");
    } finally {
      // cleanup
      await db.remove(Partitions.TaskDefinitions, "taskDefinition1");
      await db.remove(Partitions.Hosts, "host1");
      await db.remove(Partitions.Hosts, "host2");
      await db.remove(Partitions.Hosts, "localhost");
      await db.remove(Partitions.Hosts, "xxx.azurewebsites.net");
      await db.remove(Partitions.Hosts, "xxx.azurefd.net");
    }
  });

  it("deleteTasks, find 3 tasks then delete 3 tasks", async () => {
    try {
      // prepare data
      await db.upsert(Partitions.Tasks, {
        ...baseTask,
        host: "deleteTasks test host",
        id: "task1",
      });
      await db.upsert(Partitions.Tasks, {
        ...baseTask,
        host: "deleteTasks test host",
        id: "task2",
      });
      await db.upsert(Partitions.Tasks, {
        ...baseTask,
        host: "deleteTasks test host",
        id: "task3",
      });

      await deleteTasks(db, "deleteTasks test host");

      const tasks = await db.find(Partitions.Tasks, {
        filter: { host: "deleteTasks test host" },
      });
      expect(tasks).toHaveLength(0);
    } finally {
      // cleanup in beforeEach
    }
  });

  test("generate HTTP baseTask", () => {
    const taskDefinition = {
      ...baseTaskDefinition,
      id: "taskDefinition1",
    };

    const task = generateBaseTask(taskDefinition, "test.com");

    expect(task.httpRequest.body).toEqual({
      api: "https://test.com/api/sheetcontents-v2/automaticcalculation/batch",
      method: "PUT",
      params: "{}",
    });
  });

  test("generate methodInvoke baseTask", () => {
    const taskDefinition = {
      ...baseMethodInvokeTaskDefinition,
      id: "taskDefinition1",
    };

    const task = generateBaseTask(taskDefinition, "test.com");

    expect(task.httpRequest.body).toEqual({
      api: "jp.co.nisshinsci.saas.framework.service.tags.Member4SearchService",
      method: "runTask",
      params: "{}",
    });
  });

  test("should generate 1 task", () => {
    const taskDefinition = {
      id: "b68b6442-d96a-4dea-b5c1-934c26767149",
      description: "目標の進捗集計バッチ",
      httpRequest: {
        body: {
          api: "/api/progress/aggregates",
          method: "PUT",
        },
      },
      activated: true,
      cronExpression: "0 05 1 * * *",
      _partition: Partitions.TaskDefinitions,
      _rid: "5iYEAK4t+gGqNAAAAAAAAA==",
      _self: "dbs/5iYEAA==/colls/5iYEAK4t+gE=/docs/5iYEAK4t+gGqNAAAAAAAAA==/",
      _etag: '"0000923f-0000-2300-0000-6152ea1a0000"',
      _attachments: "attachments/",
      lastScheduledAt: "2021-10-31T23:59:59Z",
      lastExecutedAt: "2021-09-21T00:00:00Z",
      nextExecutedAt: "2021-10-20T00:00:00Z",
      _ts: 1632823834,
    };

    const host = {
      id: "dev.mojito.dev",
    };

    const task = {
      name: "目標の進捗集計バッチ / dev.mojito.dev",
      definitionId: "b68b6442-d96a-4dea-b5c1-934c26767149",
      host: "dev.mojito.dev",
      elapsed: 0,
      retryTimes: 0,
      state: "scheduled",
      type: "http",
      httpRequest: {
        body: {
          api: "https://dev.mojito.dev/api/progress/aggregates",
          method: "PUT",
          params: "{}",
        },
      },
      scheduledStartedAt: "2021-10-21T16:05:00.000Z",
    };

    const tasks = generateOneDayTasks(
      taskDefinition,
      host as Host,
      "2021-10-22"
    );

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(task);
  });

  test("should generate 0 task", () => {
    const taskDefinition = {
      id: "b68b6442-d96a-4dea-b5c1-934c26767149",
      description: "目標の進捗集計バッチ",
      httpRequest: {
        body: {
          api: "/api/progress/aggregates",
          method: "PUT",
        },
      },
      activated: true,
      cronExpression: "wrong",
    };

    const host = {
      id: "dev.mojito.dev",
    } as Host;

    const tasks = generateOneDayTasks(taskDefinition, host, "2021-10-21");

    expect(tasks).toHaveLength(0);
  });

  it("fixDate", () => {
    expect(
      fixDate("2021-10-23T16:05:00.000Z", "2021-10-24T05:01:00.000Z")
    ).toEqual("2021-10-24T06:05:00.000Z");

    expect(
      fixDate("2021-10-23T17:05:00.000Z", "2021-10-24T01:59:00.000Z")
    ).toEqual("2021-10-24T03:05:00.000Z");
  });

  it("unUsualTasksMessage", () => {
    const tasks = [
      {
        ...baseTask,
        id: "1",
        host: "dev3.mojito.dev",
        name: "test task",
      },
    ];
    const message = unusualTasksMessage(tasks, "2021-10-28");
    const { body } = message.attachments[0].content;

    expect(body.length).toEqual(3);
    expect(body[1].text).toContain("2021-10-28");
    expect(body[2].items[0].columns[1].items[0].text).toContain("test task");
    expect(body[0].text).toContain("test-garden");
  });

  it("computeHostOffset", () => {
    expect(computeHostOffset("dev.mojito.work")).toBe(19);
    expect(computeHostOffset("demo.mojito.work")).toBe(1);
    expect(computeHostOffset("ana.mojito.work")).toBe(4);
  });
});

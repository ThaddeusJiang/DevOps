import isBetween from "dayjs/plugin/isBetween";

import axios from "axios";
// FIXME: should devDependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from "axios-mock-adapter";
import dayjs from "dayjs";

import { baseTask } from "../test/data";
import { Task } from "../types";
import {
  filterGatewayErrorTasks,
  queryTasks,
  runTask,
  runTasks,
  sha256hash,
} from "./utils";

dayjs.extend(isBetween);

jest.mock("crypto", () => ({
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnValue("updated"),
    digest: jest.fn().mockReturnValue("fakeSha256Hash"),
  })),
}));

const mockTask = {
  ...baseTask,
  id: "5iYEAK4t+gHcTQAAAAAAAA==",
};

jest.mock("../clients/db", () => ({
  getDatabase: jest.fn().mockImplementation(() => ({
    find: jest.fn().mockReturnValueOnce([mockTask]),
    update: jest.fn(),
  })),
}));

it("sha256hash", async () => {
  const hash = await sha256hash("mojito", "item_id");
  expect(hash).toBe("fakeSha256Hash");
});

it("runTask - run http task", async () => {
  const resp = {
    id: "id",
    state: "queued",
  };
  const task = {
    ...baseTask,
    id: "5iYEAK4t+gHcTQAAAAAAAA==",
  };

  const mockAxios = new MockAdapter(axios);
  mockAxios.onPut().reply(200, resp);

  const success = await runTask(task as Task);

  const [mockPut] = mockAxios.history.put;
  expect(mockPut.url).toBe("https://test.jiang.com/api/tasks/execute");
  expect(mockPut.headers).toEqual({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    sha256hash: "fakeSha256Hash",
  });

  const putData = JSON.parse(mockPut.data);

  expect(putData.state).toBe("scheduled");
  expect(putData.httpRequest).toEqual(
    JSON.stringify({
      url: "https://cs.mojito.dev/api/sheetcontents-v2/automaticcalculation/batch",
      method: "PUT",
      params: {},
    })
  );

  expect(success.state).toBe("queued");

  mockAxios.onPut().reply(500);

  const failed = await runTask(task as Task);
  expect(failed.state).toBe("failed");
});

it("runTask - run methodInvoke task", async () => {
  const resp = {
    id: "id",
    state: "queued",
  };

  const task = {
    ...baseTask,
    type: "methodInvoke",
    httpRequest: {
      body: {
        api: "java.lang.String",
        method: "PUT",
      },
    },
    id: "5iYEAK4t+gHcTQAAAAAAAA==",
  };

  const mockAxios = new MockAdapter(axios);

  mockAxios.onPut().replyOnce(200);

  await runTask(task as Task);

  expect(mockAxios.history.put.length).toBe(1);

  const [mockPut] = mockAxios.history.put;
  expect(mockPut.url).toBe("https://test.jiang.com/api/tasks/execute");
  expect(mockPut.headers).toEqual({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    sha256hash: "fakeSha256Hash",
  });
  expect(JSON.parse(mockPut.data).httpRequest).toEqual(
    JSON.stringify({
      clazz: "java.lang.String",
      method: "PUT",
      params: {},
    })
  );

  mockAxios.resetHistory();
});

it("runTasks ", async () => {
  const queryResult = await queryTasks(
    "2021-10-22T16:05:00.000Z",
    "2021-10-22T16:10:00.000Z"
  );
  const tasks = await runTasks(queryResult);
  expect(tasks.length).toEqual(1);
});

it("test filterGatewayErrorTasks", () => {
  const filteredResult = filterGatewayErrorTasks([
    { ...baseTask, id: "1", state: "failed", failedReason: "500" },
    { ...baseTask, id: "1", state: "failed", failedReason: "503" },
    { ...baseTask, id: "1", state: "failed", failedReason: "504" },
  ]);
  expect(filteredResult).toHaveLength(2);
});

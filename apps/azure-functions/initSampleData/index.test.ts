/* eslint-disable import/no-unresolved */
import { Context } from "@azure/functions";
import axios from "axios";
// FIXME: should devDependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from "axios-mock-adapter";
import httpTrigger from ".";
import { getDatabase, Partitions } from "../clients/db";
import { cleanHosts } from "../modules/host";
import { baseHost } from "../test/data";

let db;

describe("initSampleData", () => {
  beforeAll(async () => {
    db = await getDatabase();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await cleanHosts(db);
  });

  // TODO: This test have to be the first at this moment, because it's the real http request. I will resolve mockAxios
  test("should return 401 if the xApiToken is wrong", async () => {
    await Promise.all([
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "dev.mojito.work",
        xApiToken: "wrong-token",
      }),
    ]);

    const context = {
      bindingData: {
        hostId: "dev.mojito.work",
      },
      log: jest.fn(),
    } as unknown as Context;
    context.log.warn = jest.fn();

    const request = {};

    await httpTrigger(context, request);

    expect(context.res).toEqual({
      status: 401,
      body: {
        code: "UNAUTHENTICATED",
        message: "UNAUTHENTICATED",
        errorValue: null,
        displayMessage: "ログイン状態が解除されておりアクセスできません",
      },
    });
  });

  test("should return 200 if the SaaS framework return 200", async () => {
    await Promise.all([
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "test-initSampleData-host-01.mojito.dev",
        xApiToken: "fake-token",
      }),
    ]);

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet(/sampledata/).reply(200, "done");

    const context = {
      bindingData: {
        hostId: "test-initSampleData-host-01.mojito.dev",
      },
      log: jest.fn(),
    } as unknown as Context;
    context.log.warn = jest.fn();

    const request = {};

    await httpTrigger(context, request);

    expect(context.res).toEqual({
      status: 200,
      body: "done",
    });
  });

  test("should return 500 if the SaaS framework return 500", async () => {
    await Promise.all([
      await db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "test-initSampleData-host-02.mojito.dev",
        xApiToken: "fake-token",
      }),
    ]);

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet(/sampledata/).reply(500, "Server Error");

    const context = {
      bindingData: {
        hostId: "test-initSampleData-host-02.mojito.dev",
      },
      log: jest.fn(),
    } as unknown as Context;
    context.log.warn = jest.fn();

    const request = {};

    await httpTrigger(context, request);

    expect(context.res).toEqual({
      status: 500,
      body: "Server Error",
    });
  });
});

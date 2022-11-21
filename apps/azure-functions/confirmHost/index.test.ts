import { Context } from "@azure/functions";
import httpTrigger from ".";
import { getDatabase, Partitions } from "../clients/db";
import { cleanHosts } from "../modules/host";
import { baseHost } from "../test/data";

let db;

describe("confirmHost", () => {
  beforeAll(async () => {
    db = await getDatabase();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await cleanHosts(db);
    await cleanHosts(db);
  });

  test("should return confirmed", async () => {
    await Promise.all([
      db.upsert(Partitions.Hosts, {
        ...baseHost,
        id: "publishing-host-01.mojito.work",
        state: "published",
      }),
    ]);

    const context = {
      bindingData: {
        hostId: "publishing-host-01.mojito.work",
      },
      log: jest.fn(),
    } as unknown as Context;
    context.log.warn = jest.fn();
    const req = {};

    await httpTrigger(context, req);
    expect(context.res.body).toBe("confirmed");
  });

  test("should return 500", async () => {
    const context = {
      bindingData: {
        hostId: "publishing-host-01.mojito.work",
      },
      log: jest.fn(),
    } as unknown as Context;
    context.log.warn = jest.fn();
    const req = {};

    await httpTrigger(context, req);
    expect(context.res.status).toBe(500);
  });
});

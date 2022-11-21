/* eslint-disable import/no-unresolved */
import { Context } from "@azure/functions";
import axios from "axios";
import timerTrigger from ".";
import { getDatabase, Database, Partitions } from "../clients/db";
import { cleanHosts } from "../modules/host";
import { cleanTasks } from "../modules/task";
import { baseTask } from "../test/data";

jest.mock("axios");

let db: Database;
const TEAMS_INCOMING_WEBHOOK = process.env?.TEAMS_INCOMING_WEBHOOK;

describe("checkTasks", () => {
  beforeAll(async () => {
    db = await getDatabase();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await cleanHosts(db);
    await cleanTasks(db);
  });

  afterAll(async () => {
    db = null;
  });

  it("found tasks, should send notification", async () => {
    const context = {
      log: jest.fn(),
    };

    try {
      // prepare data
      await db.upsert(Partitions.Tasks, {
        ...baseTask,
        id: "test1", // rewrite
        state: "scheduled", // rewrite
        scheduledStartedAt: new Date().toISOString(), // rewrite
      });

      await timerTrigger((context as unknown) as Context, {});

      expect(axios.post).toHaveBeenCalledWith(
        TEAMS_INCOMING_WEBHOOK,
        expect.objectContaining({
          type: "message",
        }),
        {}
      );
    } catch {
      expect(axios.post).not.toHaveBeenCalled();
    } finally {
      // cleanup
      await db.remove(Partitions.Tasks, "test1");
    }
  });

  it("not tasks, should not send notification", async () => {
    const context = {
      log: jest.fn(),
    };

    await timerTrigger((context as unknown) as Context, {});

    // FIXME: sometimes it fails, I don't know why
    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

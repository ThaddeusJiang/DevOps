import { baseTask } from "../test/data";
import { getDatabase, Database, Partitions } from "./db";

let db: Database;
describe("db client", () => {
  beforeAll(async () => {
    db = await getDatabase();
  });

  test("CRUD and count", async () => {
    await db.upsert(Partitions.Tasks, {
      ...baseTask,
      id: "db.test.test1", // rewrite
      state: "scheduled", // rewrite
      scheduledStartedAt: new Date().toISOString(), // rewrite
    });

    const tasks = await db.find(Partitions.Tasks, {});
    expect(tasks.length).toBe(1);

    const taskId = await db.update(Partitions.Tasks, {
      id: "db.test.test1",
      state: "running",
    });

    const task = await db.read(Partitions.Tasks, taskId);
    expect(task.state).toBe("running");

    await db.remove(Partitions.Tasks, taskId);

    const total = await db.count(Partitions.Tasks, {});
    expect(total).toBe(0);
  });
});

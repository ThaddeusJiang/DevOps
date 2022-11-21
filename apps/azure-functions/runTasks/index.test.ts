/* eslint-disable import/no-unresolved */
import { Context } from "@azure/functions";

import timerTrigger from ".";

jest.mock("./utils", () => ({
  runTasksInDateRange: jest.fn().mockReturnValue([{ id: 1 }]),
}));

it("runTasks timerTrigger", async () => {
  const context = {
    log: jest.fn(),
  };

  await timerTrigger((context as unknown) as Context, {});

  expect(context.log).toHaveBeenCalledTimes(1);
});

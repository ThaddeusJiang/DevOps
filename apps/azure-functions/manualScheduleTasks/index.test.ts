/* eslint-disable import/no-unresolved */
import { Context } from "@azure/functions";
import httpTrigger from ".";

jest.mock("../modules/task", () => ({
  scheduleTasks: jest.fn().mockReturnValue([{ id: 1 }]),
}));

it("manualScheduleTasks timerTrigger", async () => {
  const context = {
    res: null,
    log: jest.fn(),
  };

  await httpTrigger((context as unknown) as Context, {});

  expect(context.res).toEqual({
    body: [{ id: 1 }],
  });
});

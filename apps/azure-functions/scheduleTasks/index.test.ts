/* eslint-disable import/no-unresolved */
import { Context } from "@azure/functions";
import timerTrigger from ".";

jest.mock("../modules/task", () => ({
  scheduleTasks: jest.fn().mockReturnValue([{ id: 1 }]),
}));

it("scheduleTasks timerTrigger", async () => {
  const context = ({
    log: jest.fn(),
  } as unknown) as Context;

  await timerTrigger(context);

  expect(context.log).toHaveBeenNthCalledWith(
    1,
    "Time trigger function `scheduleTasks` processed a request."
  );
});

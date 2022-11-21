import { Context } from "@azure/functions";
import httpTrigger from ".";

import {
  isHealthyOfStorage,
  isHealthyOfDB,
  isHealthyOfDNS,
  isHealthyOfFrontDoor,
} from "../clients/rm";

jest.mock("../clients/rm");

describe("health", () => {
  beforeEach(() => {
    (isHealthyOfStorage as jest.Mock).mockReturnValue(true);
    (isHealthyOfDB as jest.Mock).mockReturnValue(true);
    (isHealthyOfDNS as jest.Mock).mockReturnValue(true);
    (isHealthyOfFrontDoor as jest.Mock).mockReturnValue(true);
  });

  test("should be 200", async () => {
    const context = ({
      log: jest.fn(),
    } as unknown) as Context;
    context.log.warn = jest.fn();

    await httpTrigger(context, {});

    expect(context.res.status).toBe(200);
  });

  test("should be 500", async () => {
    const context = ({
      log: jest.fn(),
    } as unknown) as Context;
    context.log.warn = jest.fn();

    (isHealthyOfFrontDoor as jest.Mock).mockReturnValue(false);
    await httpTrigger(context, {});

    expect(context.res.status).toBe(500);
  });
});

import { QueryClient, QueryClientProvider } from "react-query";

import { useRouter } from "next/dist/client/router";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import MockAdapter from "axios-mock-adapter";

import Tasks, { TAB_NAMES, formatParams, generateTabInfos } from "../pages/tasks/index";

const queryClient = new QueryClient();

jest.mock("next/link", () => ({ children }) => <div>{children}</div>);
jest.mock("next/dist/client/router");

describe("Tasks page", () => {
  // test ui
  it("should get all search UI input", async () => {
    const mockRouter = {
      query: { filter: {} },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(
      <QueryClientProvider client={queryClient}>
        <Tasks />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByLabelText("Host:")).toBeTruthy();
      expect(screen.getAllByLabelText("Scheduled ended at:")).toBeTruthy();
      expect(screen.getAllByLabelText("Scheduled started at:")).toBeTruthy();
      expect(screen.getAllByText("Search")).toBeTruthy();
      expect(screen.getAllByText("Reset filters")).toBeTruthy();
    });
  });

  // test input event
  it("should match input value", async () => {
    const mockRouter = {
      query: { filter: {} },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(
      <QueryClientProvider client={queryClient}>
        <Tasks />
      </QueryClientProvider>
    );

    const inputStartAt = screen.getByLabelText("Scheduled started at:") as HTMLInputElement;
    const inputEndAt = screen.getByLabelText("Scheduled ended at:") as HTMLInputElement;

    fireEvent.change(inputStartAt, {
      target: { value: "2022-01-20" },
    });
    fireEvent.change(inputEndAt, {
      target: { value: "2022-01-21" },
    });

    expect(inputStartAt.value).toBe("2022-01-20");
    expect(inputEndAt.value).toBe("2022-01-21");
  });

  // test input event
  it("should trigger submit event", async () => {
    const mockRouter = {
      query: { filter: {} },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(
      <QueryClientProvider client={queryClient}>
        <Tasks />
      </QueryClientProvider>
    );

    const inputHost = screen.getByLabelText("Host:") as HTMLInputElement;

    fireEvent.change(inputHost, {
      target: { value: "dev" },
    });

    waitFor(() => {
      expect(formatParams).toHaveBeenCalled();
    });
  });

  // test formatParams function with all input
  it("should match the mockData", async () => {
    const mockFromData = {
      startAt: "2020-01-20",
      endAt: "2020-01-21",
      host: "dev1.smartcompany.com",
    };
    const result = formatParams(mockFromData, {});
    expect(result.filter).toBeTruthy();
  });

  // test formatParams function only with endAt
  it("should only return scheduledStartedAt <=", async () => {
    const mockFromData = {
      startAt: "",
      endAt: "2020-01-21",
      host: "",
    };
    const result = formatParams(mockFromData, {});

    expect(result.filter).toBeTruthy();
  });

  // test formatParams function only with startAt
  it("should only return 'scheduledStartedAt >'", async () => {
    const mockFromData = {
      startAt: "",
      endAt: "",
      host: "dev1.smartcompany.com",
    };
    const result = formatParams(mockFromData, {});

    expect(result.filter).toBeTruthy();
  });

  // test formatParams function only with empty
  it("should only return scheduledStartedAt <=", async () => {
    const mockFromData = {
      startAt: "",
      endAt: "",
      host: "",
    };
    const result = formatParams(mockFromData, {});
    expect(result.filter).toBeTruthy();
  });

  it("form検索条件が全て指定ありの場合、タグhrefに検索条件が保持できる", async () => {
    const startAt = "2022-01-25T15:00:00.000Z";
    const endAt = "2022-01-26T14:59:59.999Z";
    const hostLike = "company25";
    const currentState = "all";
    const currentFilterInfoObj = {
      "scheduledStartedAt >": startAt,
      "scheduledStartedAt <=": endAt,
      "host LIKE": hostLike,
      "state": currentState,
    };
    const tabInfos = generateTabInfos(TAB_NAMES, currentFilterInfoObj);
    expect(tabInfos.length).toEqual(TAB_NAMES.length);
    // allタグの検索条件にはstateが含まれていない判定
    expect(tabInfos.find((item) => item.name === "all").href).not.toMatch("state");
    TAB_NAMES.forEach((tabName) => {
      // 検索formの検索条件が全て保持できている判定
      const tabHref = tabInfos.find((item) => item.name === tabName).href;
      expect(tabHref).toMatch(`"scheduledStartedAt >":"${startAt}"`);
      expect(tabHref).toMatch(`"scheduledStartedAt <=":"${endAt}"`);
      expect(tabHref).toMatch(`"host LIKE":"${hostLike}"`);
      if (tabName !== "all") {
        // all以外のタグ検索条件にはstateが含まれている判定
        expect(tabHref).toMatch(`"state":"${tabName}"`);
      }
    });
  });

  it("form検索条件が指定なしの場合、タグhrefにstateのみ保持できる", async () => {
    const currentState = "scheduled";
    const currentFilterInfoObj = {
      "state": currentState,
    };
    const tabInfos = generateTabInfos(TAB_NAMES, currentFilterInfoObj);
    expect(tabInfos.length).toEqual(TAB_NAMES.length);
    // 検索条件が指定なしのため、allタグには「?filter=」を含まないべき
    expect(tabInfos.find((item) => item.name === "all").href).not.toMatch(/\?filter=/i);
    TAB_NAMES.forEach((tabName) => {
      const tabHref = tabInfos.find((item) => item.name === tabName).href;
      const pattern = new RegExp(`filter={"state":"${tabName}"}`);
      if (tabName !== "all") {
        // all以外のタグ検索条件にはstateのみ含まれている判定
        expect(tabHref).toMatch(pattern);
      }
    });
  });

  it("form検索条件が一部指定ありの場合、タグhrefに検索条件が保持できる", async () => {
    const startAt = "2022-01-25T15:00:00.000Z";
    const currentState = "failed";
    const currentFilterInfoObj = {
      "scheduledStartedAt >": startAt,
      "state": currentState,
    };
    const tabInfos = generateTabInfos(TAB_NAMES, currentFilterInfoObj);
    expect(tabInfos.length).toEqual(TAB_NAMES.length);
    // allタグの検索条件にはstateが含まれていない判定
    expect(tabInfos.find((item) => item.name === "all").href).not.toMatch("state");
    TAB_NAMES.forEach((tabName) => {
      const tabHref = tabInfos.find((item) => item.name === tabName).href;
      // 検索formの「scheduledStartedAt >」条件のみ保持できている判定
      expect(tabHref).toMatch(`"scheduledStartedAt >":"${startAt}"`);
      expect(tabHref).not.toMatch("scheduledStartedAt <=");
      expect(tabHref).not.toMatch("host LIKE");
      if (tabName !== "all") {
        // all以外のタグの検索条件にはstateが含まれている判定
        expect(tabHref).toMatch(`"state":"${tabName}"`);
      }
    });
  });

  it("URLにある検索条件が検索フォームで表示できる", async () => {
    const startAt = "2022-01-25";
    const endAt = "2022-01-26";
    const hostKeyword = "company25";
    const mockRouter = {
      query: {
        filter: `{"scheduledStartedAt >":"${startAt}T15:00:00.000Z","scheduledStartedAt <=":"${endAt}T14:59:59.999Z","host LIKE":"%${hostKeyword}%","state":"queued"}`,
      },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <Tasks />
        </QueryClientProvider>
      );
    });

    const hostInput = screen.getByLabelText("Host:") as HTMLInputElement;
    const startAtInput = screen.getByLabelText("Scheduled started at:") as HTMLInputElement;
    const endAtInput = screen.getByLabelText("Scheduled ended at:") as HTMLInputElement;

    expect(hostInput.value).toBe(hostKeyword);
    expect(startAtInput.value).toBe(startAt);
    expect(endAtInput.value).toBe(endAt);
  });

  it("should default query with sort", async () => {
    const mockAPI = new MockAdapter(axios);
    mockAPI.onGet(new RegExp("/api/curd/.+")).reply(200);
    const mockRouter = {
      query: { filter: {} },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <QueryClientProvider client={queryClient}>
        <Tasks />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByLabelText("Host:"));
      expect(mockAPI.history.get[0].url).toContain(
        "sort%22%3A%5B%22createdAt%22%2C%22DESC%22%2C%22scheduledStartedAt"
      );
    });
  });
});

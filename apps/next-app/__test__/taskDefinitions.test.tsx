import { QueryClient, QueryClientProvider } from "react-query";

import { useRouter } from "next/dist/client/router";

import { render, screen, waitFor } from "@testing-library/react";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import TaskDefinitions from "../pages/taskDefinitions/index";

const queryClient = new QueryClient();

jest.mock("next/link", () => ({ children }) => <div>{children}</div>);
jest.mock("next/dist/client/router");

describe("Task Definitions", () => {
  it("should default query with sort", async () => {
    const mockAPI = new MockAdapter(axios);
    mockAPI.onGet(new RegExp("/api/curd/.+")).reply(200);
    const mockRouter = {
      query: { filter: {} },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskDefinitions />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Task Definitions"));
      expect(mockAPI.history.get[0].url).toContain("sort%22%3A%5B%22createdAt");
    });
  });
});

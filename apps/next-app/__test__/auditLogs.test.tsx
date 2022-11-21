import { QueryClient, QueryClientProvider } from "react-query";

import { useRouter } from "next/dist/client/router";

import { render, screen, waitFor } from "@testing-library/react";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import AuditLogs from "../pages/auditLogs/index";

const queryClient = new QueryClient();

jest.mock("next/link", () => ({ children }) => <div>{children}</div>);
jest.mock("next/dist/client/router");

describe("AuditLogs", () => {
  it("should default query with sort", async () => {
    const mockAPI = new MockAdapter(axios);
    mockAPI.onGet(new RegExp("/api/curd/.+")).reply(200);
    const mockRouter = {
      query: { filter: {} },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <QueryClientProvider client={queryClient}>
        <AuditLogs />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Audit Logs"));
      expect(mockAPI.history.get[0].url).toContain("sort%22%3A%5B%22createdAt");
    });
  });
});

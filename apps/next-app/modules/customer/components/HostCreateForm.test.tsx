import { baseHost, baseMansion } from "test/data";

import { QueryClient, QueryClientProvider } from "react-query";

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { goldFeatures, platinumFeatures, silverFeatures, trialFeatures } from "data/mocks";

import HostCreateForm from "./HostCreateForm";

const queryClient = new QueryClient();

describe("HostCreateForm", () => {
  it("create host: hosts in the mansion are exceed the limit", () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01", hostCount: 30 },
        { ...baseMansion, id: "test-host-create-form-02", hostCount: 0 },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    const hosts = [];
    for (let i = 0; i < 30; i += 1) {
      const host = {
        ...baseHost,
        mansion: { id: "test-host-create-form-01", ...baseHost.mansion, hostCount: 30 },
      };
      hosts.push(host);
    }
    mockAxios.onGet(getHostsUrl).reply(200, hosts, {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-30/30`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
      hostCount: 30,
    };
    const mansionSelect = screen.getByLabelText("mansion") as HTMLSelectElement;
    for (let i = 0; i < mansionSelect.options.length; i += 1) {
      const option = mansionSelect.options[i];
      if (option.value !== "") {
        const optionMansion = JSON.parse(option.value);
        if (optionMansion.id === "test-host-create-form-01") {
          expect(option).toBeDisabled();
        }
      }
    }
  });

  it("create host: should get mansions, and post host", () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByLabelText("cname"), {
      target: { value: "test-jiang-01" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    const createHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPost(
      createHostUrl,
      expect.objectContaining({
        mansionId: mansion.id,
        cname: "test-jiang-01",
        plan: "TRIAL",
        memo: "",
      })
    );
  });

  it("create host: domain error（Illegal domain）： Start from numbers", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "090test-jiang-01aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Illegal domain）Start from hyphen", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "-test-jiang-01aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Required）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.queryByText("Required")).toBeInTheDocument();
    });
  });

  it("create host: domain error（Please specify 80 characters or less）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: {
        value: "a11111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.queryByText("Please specify 80 characters or less")).toBeInTheDocument();
    });
  });

  it("create host: correct domain（=80 characters）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: {
        value: "a111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      const formatError = screen.queryAllByText("Please specify 80 characters or less");
      expect(formatError.length).toBe(0);
    });
  });

  it("create host: domain error（Including double-byte characters）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "abc１２３" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Including Uppercase）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "ABC-123" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Including other symbols）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "ab@123" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: correct domain", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "abc-12223" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      const formatError = screen.queryAllByText(
        "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
      );
      expect(formatError.length).toBe(0);
    });
  });

  it("create host: the plan is CUSTOM", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...baseMansion, id: "test-host-create-form-01" },
        { ...baseMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...baseMansion,
      id: "test-host-create-form-01",
      domain: "mojito.dev",
    };

    const host = {
      mansion,
      plan: "CUSTOM",
      selectedFeatures: ["CROSS_ANALYSIS"],
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByLabelText("cname"), {
      target: { value: "jiang-test" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "CUSTOM" },
    });

    expect(screen.queryByLabelText("Selected Features")).toBeInTheDocument();
    fireEvent.click(screen.getByText("クロス分析"));

    fireEvent.click(screen.getByText("Save"));

    const postHostURL = new RegExp("/api/curd/Customers/");
    mockAxios.onPost(postHostURL, expect.objectContaining(host));
  });

  it("create host: the domain should be unique", () => {
    const mockAxios = new MockAdapter(axios);
    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(
      200,
      [
        {
          id: "dev-0001",
          databaseId: "mojito-dev-yo-0001",
          domain: "mojito.dev",
        },
        {
          id: "dev-0002",
          databaseId: "mojito-dev-yo-0001",
          domain: "mojito.dev",
        },
      ],
      {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `Mansions undefined-NaN/6`,
      }
    );

    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    waitFor(async () => {
      await userEvent.type(screen.getByLabelText("cname"), "dev-0001");
      expect(screen.findByText("The cname should be unique")).toBeInTheDocument();
    });
  });

  it("create host: the features should be displayed correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const planLabel = screen.getByLabelText("plan");

    await userEvent.selectOptions(planLabel, "TRIAL");
    trialFeatures.map((feature) => expect(screen.queryByLabelText(feature)).toBeChecked());

    await userEvent.selectOptions(planLabel, "SILVER");
    silverFeatures.map((feature) => expect(screen.queryByLabelText(feature)).toBeChecked());

    await userEvent.selectOptions(planLabel, "GOLD");
    goldFeatures.map((feature) => expect(screen.queryByLabelText(feature)).toBeChecked());

    await userEvent.selectOptions(planLabel, "PLATINUM");
    platinumFeatures.map((feature) => expect(screen.queryByLabelText(feature)).toBeChecked());
  });

  it("create host: the products' checkbox can be display correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );
    expect(screen.queryByLabelText("労務")).not.toBeChecked();
    expect(screen.queryByLabelText("勤怠")).not.toBeChecked();
    expect(screen.queryByLabelText("給与")).toBeDisabled();
  });

  it("create host: the products features can be checked correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    waitFor(async () => {
      await userEvent.click(screen.queryByLabelText("労務"));
      expect(screen.queryByLabelText("給与明細")).toBeInTheDocument();
      await userEvent.click(screen.queryByLabelText("勤怠"));
      expect(screen.queryByLabelText("シフト管理")).not.toBeInTheDocument();
    });
  });
});

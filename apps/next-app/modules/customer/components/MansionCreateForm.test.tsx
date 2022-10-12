import { baseMansionList } from "test/data";

import { QueryClient, QueryClientProvider } from "react-query";

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import MansionCreateForm from "./MansionCreateForm";

const queryClient = new QueryClient();

describe("Test Mansion Add Form", () => {
  it("01 should verify uniqueness of Mansion Name", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansions*");
    mockAxios.onGet(getMansionsUrl).reply(200, baseMansionList, {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-2/2`,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MansionCreateForm />
      </QueryClientProvider>
    );

    await userEvent.type(screen.getByLabelText("Mansion Name"), "dev-0006");

    waitFor(() => {
      expect(screen.findByText("The Mansion Name should be unique")).toBeInTheDocument();
    });
  });

  it("02 Add New Mansion configuration: Mansion Name should contain only numbers or lowercase letters or hyphen", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MansionCreateForm />
      </QueryClientProvider>
    );

    waitFor(async () => {
      await userEvent.type(screen.getByLabelText("Mansion Name"), "DEV");
      await userEvent.click(screen.getByText("Save"));

      expect(
        screen.queryByText(
          "The mansion name should contain only numbers, lowercase letters and hyphen"
        )
      ).toBeInTheDocument();
    });
  });

  it("03, when then Mansion Name is inputted, app services's Name and Host are displayed correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MansionCreateForm />
      </QueryClientProvider>
    );

    waitFor(async () => {
      await userEvent.type(screen.getByLabelText("Mansion Name"), "dev-test");
      expect(screen.queryByLabelText("Name (east)")).toEqual("As-mojito-dev-test");
      expect(screen.queryByLabelText("Host (east)")).toEqual(
        "https://as-mojito-dev-test.azurewebsites.net"
      );
      expect(screen.queryByLabelText("Name (west)")).toEqual("As-mojito-dev-test-west");
      expect(screen.queryByLabelText("Host (west)")).toEqual(
        "https://as-mojito-dev-test-west.azurewebsites.net"
      );
    });
  });

  it("04 'Mansion Name' 'App Services' 'DNS Zones' 'FrontDoor' 'DataBase Name' Required Field", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MansionCreateForm />
      </QueryClientProvider>
    );

    waitFor(async () => {
      await userEvent.click(screen.getByText("Save"));
      expect(screen.queryByText("Mansion Name is required")).toBeInTheDocument();
      expect(screen.queryByText("DNS is required")).toBeInTheDocument();
      expect(screen.queryByText("FrontDoor is required")).toBeInTheDocument();
      expect(screen.queryByText("App Service's Name is required")).toBeInTheDocument();
      expect(screen.queryByText("App Service's Host is required")).toBeInTheDocument();
      expect(screen.queryByText("Database Name is required")).toBeInTheDocument();
    });
  });
});

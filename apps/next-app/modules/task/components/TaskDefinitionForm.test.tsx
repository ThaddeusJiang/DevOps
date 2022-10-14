import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TaskDefinitionForm from "./TaskDefinitionForm";

// const mockSave = jest.fn((value) => Promise.resolve({ value }));
const mockSave = jest.fn();
const mockDelete = jest.fn((id) => Promise.resolve({ id }));

describe("TaskDefinitionForm", () => {
  beforeEach(() => {
    render(<TaskDefinitionForm value={null} onSave={mockSave} onDelete={mockDelete} />);
  });

  test("should display required error when value is invalid", async () => {
    fireEvent.click(screen.getByText("Save"));
    expect(await screen.findAllByRole("alert")).toHaveLength(3);
    expect(mockSave).not.toBeCalled();
  });

  test("should not display error when value is valid", async () => {
    fireEvent.input(screen.getByLabelText("Description"), { target: { value: "test" } });
    fireEvent.change(screen.getByLabelText("cron expression"), { target: { value: "* * * * *" } });
    fireEvent.change(screen.getByLabelText("api"), {
      target: { value: "http://localhost:8080/api" },
    });
    fireEvent.change(screen.getByLabelText("method"), { target: { value: "PUT" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(mockSave).toBeCalledWith({
      description: "test",
      activated: false,
      cronExpression: "* * * * *",
      type: "http",
      httpRequest: {
        body: {
          api: "http://localhost:8080/api",
          method: "PUT",
          params: "",
        },
      },
    });

    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "type" }), "methodInvoke");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(mockSave).toBeCalledWith({
      description: "test",
      activated: false,
      cronExpression: "* * * * *",
      type: "methodInvoke",
      httpRequest: {
        body: {
          api: "http://localhost:8080/api",
          method: "runTask",
          params: "",
        },
      },
    });
  });
});

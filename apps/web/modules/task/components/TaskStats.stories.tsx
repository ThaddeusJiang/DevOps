import { Meta, Story } from "@storybook/react";
import TaskStats from "./TaskStats";
import { Task } from "types";

const mockData = [
  {
    "id": "b64e761b-dbee-4972-923b-a9c4472b3694",
    "state": "scheduled",
  },
  {
    "id": "b64e761b-dbee-4972-923b-a9c4472b3694",
    "state": "scheduled",
  },
  {
    "id": "b64e761b-dbee-4972-923b-a9c4472b3694",
    "state": "scheduled",
  },
  {
    "id": "b64e761b-dbee-4972-923b-a9c4472b3694",
    "state": "succeeded",
  },
  {
    "id": "b64e761b-dbee-4972-923b-a9c4472b3694",
    "state": "failed",
  },
];

interface TaskStatsProps {
  "items": Task[];
}
export default {
  component: TaskStats,
  title: "Components/TaskStats",
} as Meta;

const Template: Story<TaskStatsProps> = (args) => <TaskStats {...args} />;

export const TaskStatsPage = Template.bind({});

TaskStatsPage.args = { items: mockData };

export type Partition = "Mansions" | "Customers" | "TaskDefinitions" | "Tasks";

export const Partitions = {
  Mansions: "Mansions" as Partition,
  Hosts: "Customers" as Partition,
  TaskDefinitions: "TaskDefinitions" as Partition,
  Tasks: "Tasks" as Partition,
};
export const MAX_MANSION_HOSTS = 20;

import { getList } from "client/api";

import axios from "axios";
import { TaskDefinition } from "types";

import { Partitions } from "utils/constants";

const partition = Partitions.TaskDefinitions;
export const findTaskDefinitions = getList(partition);

export const readTaskDefinition = async (id: string): Promise<TaskDefinition> => {
  const { data } = await axios.get(`/api/curd/${partition}/${id}`);
  return data;
};

export const createTaskDefinition = async (value): Promise<void> => {
  await axios.post(`/api/curd/${partition}`, value);
};

export const updateTaskDefinition = async (value): Promise<TaskDefinition> => {
  const { data } = await axios.put(`/api/curd/${partition}`, value);

  return data;
};

export const deleteTaskDefinition = async (id: string): Promise<string> => {
  await axios.delete(`/api/curd/${partition}/${id}`);
  return id;
};

export const toggleTaskDefinition = async ({
  id,
  activated,
}: {
  id: string;
  activated: boolean;
}): Promise<TaskDefinition> => {
  const data = await updateTaskDefinition({ id, activated });

  return data;
};

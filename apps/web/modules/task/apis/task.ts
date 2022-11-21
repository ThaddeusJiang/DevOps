import { getList } from "client/api";

import axios from "axios";
import { Task } from "types";

import { Partitions } from "utils/constants";

const partition = Partitions.Tasks;
export const findTasks = getList(partition);

export const readTask = async (id: string): Promise<Task> => {
  const { data } = await axios.get(`/api/curd/${partition}/${id}`);
  return data;
};

export const upsertTask = async (value): Promise<Task> => {
  const { data } = await axios.post(`/api/curd/${partition}`, value);
  return data;
};

export const updateTask = async (value): Promise<Task> => {
  const { data } = await axios.put(`/api/curd/${partition}`, value);
  return data;
};

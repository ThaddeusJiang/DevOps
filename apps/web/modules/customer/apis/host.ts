import { getList } from "client/api";

import axios from "axios";
import { Host } from "types";

import { Partitions } from "utils/constants";

const partition = Partitions.Hosts;
export const findHosts = getList(partition);

export const readHost = async (id: string): Promise<Host> => {
  const { data } = await axios.get(`/api/curd/${partition}/${id}`);
  return data;
};

export const createHost = async (value): Promise<Host> => {
  const { data } = await axios.post(`/api/curd/${partition}`, value);
  return data;
};

export const updateHost = async (value): Promise<Host> => {
  const { data } = await axios.put(`/api/curd/${partition}`, value);
  return data;
};

export const confirmHost = async (hostId): Promise<Host> => {
  const { data } = await axios.put(`/api/${partition}/${hostId}/confirm`);
  return data;
};

export const deleteHost = async (id: string): Promise<string> => {
  await axios.delete(`/api/curd/${partition}/${id}`);
  return id;
};

export const initSampleData = async (host): Promise<void> => {
  const { data } = await axios.post(`/api/hosts/${host.id}/init-sample-data`);
  return data;
};

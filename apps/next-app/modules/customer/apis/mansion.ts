import { getList } from "client/api";

import axios from "axios";
import { Mansion } from "types";

import { Partitions } from "utils/constants";

const partition = Partitions.Mansions;
export const findMansions = getList(partition);

export const readMansion = async (id: string): Promise<Mansion> => {
  const { data } = await axios.get(`/api/curd/${partition}/${id}`);
  return data;
};

export const upsertMansion = async (value): Promise<Mansion> => {
  const { data } = await axios.post(`/api/curd/${partition}`, value);
  return data;
};

export const updateMansion = async (value): Promise<Mansion> => {
  const { data } = await axios.put(`/api/curd/${partition}`, value);
  return data;
};

export const deleteMansion = async (id: string): Promise<string> => {
  await axios.delete(`/api/curd/${partition}/${id}`);
  return id;
};

import { getList } from "client/api";

import axios from "axios";
import { Customer } from "types";

const partition = "CustomerInfo";
export const findCustomers = getList(partition);

export const readCustomer = async (id: string): Promise<Customer> => {
  const { data } = await axios.get(`/api/curd/${partition}/${id}`);
  return data;
};

export const upsertCustomer = async (value): Promise<Customer> => {
  const { data } = await axios.post(`/api/curd/${partition}`, value);
  return data;
};

export const updateCustomer = async (value): Promise<Customer> => {
  const { data } = await axios.put(`/api/curd/${partition}`, value);
  return data;
};

import axios from "axios";
import { isNil, omitBy } from "lodash";

export const read = (partition: string) => async (id: string) => {
  const { data } = await axios.get(`/api/curd/${partition}/${id}`);
  return data;
};

export const getTotalFromContentRange = (contentRange) => {
  const total = contentRange.split("/").pop();
  return parseInt(total, 10);
};

export const getList = (partition: string) => async (condition?: any) => {
  const query = condition ? `${JSON.stringify(omitBy(condition, isNil))}` : "";
  const res = await axios.get(`/api/curd/${partition}`);
  const { headers, data } = res;
  const total = getTotalFromContentRange(headers["content-range"]);
  return {
    total,
    items: data,
  };
};

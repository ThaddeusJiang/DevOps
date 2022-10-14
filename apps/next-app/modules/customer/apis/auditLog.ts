import { getList } from "client/api";

import axios from "axios";

const partition = "AuditLogs";
export const findAuditLogRequests = getList(partition);

export async function createAuditLogRequest(value) {
  const { data } = await axios.post(`/api/curd/${partition}`, value);
  return data;
}

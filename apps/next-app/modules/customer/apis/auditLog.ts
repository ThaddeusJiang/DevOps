import axios from "axios";

import { getList } from "client/api";

const partition = "AuditLog";
export const findAuditLogRequests = getList(partition);

export async function createAuditLogRequest (value) {
  const { data } = await axios.post(`/api/curd/${partition}`, value);
  return data
}

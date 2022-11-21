import { safeJSONparse } from "./json";

export const nextQuery = (
  query: Record<string, string | string[] | undefined>,
  field: string,
  value: string | null
) => {
  const filter = safeJSONparse(query.filter) || {};
  if (value) {
    filter[`${field} LIKE`] = `%${value}%`;
  } else {
    delete filter[`${field} LIKE`];
  }

  return {
    ...query,
    filter: JSON.stringify(filter),
  };
};

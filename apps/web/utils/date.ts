import dayjs from "dayjs";

export const CommonFormat = "YYYY-MM-DD HH:mm:ss Z";
export const onlyDateFormat = "YYYY-MM-DD Z";

export const dateFormat = (value: string, onlyDate = false): string =>
  value
    ? dayjs(value).format(onlyDate ? onlyDateFormat : CommonFormat)
    : "";

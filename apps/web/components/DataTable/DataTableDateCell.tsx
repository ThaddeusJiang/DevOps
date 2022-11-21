import { FC } from "react";

import { dateFormat } from "utils/date";

type Props = {
  value: string;
  onlyDate?: boolean
};

export const DataTableDateCell: FC<Props> = (props) => {
  const { value, onlyDate = false } = props;

  return <span>{dateFormat(value, onlyDate)}</span>;
};

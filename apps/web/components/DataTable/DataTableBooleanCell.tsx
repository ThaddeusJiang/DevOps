import { FC } from "react";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";

type Props = {
  value: string;
};

const DataTableBooleanCell: FC<Props> = (props) => {
  const { value } = props;

  return (
    <div className="w-6 h-6">
      {value ? <CheckCircleIcon className=" text-green-600 " /> : <MinusCircleIcon />}
    </div>
  );
};

export default DataTableBooleanCell;

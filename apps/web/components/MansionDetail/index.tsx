import MansionForm from "modules/customer/components/MansionForm";
import { MansionHosts } from "modules/customer/components/MansionHosts";

import { FC } from "react";

import { Mansion } from "types";

type Props = {
  value: Mansion;
};

const MansionDetail: FC<Props> = (props) => {
  const { value: mansion } = props;
  const onSave = (data) => data;
  const onDelete = (data) => data;
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 relative">
      <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <div id="Information">
          <MansionForm value={mansion} onSave={onSave} onDelete={onDelete} />
        </div>
        <MansionHosts mansion={mansion} />
      </div>
    </div>
  );
};

export default MansionDetail;

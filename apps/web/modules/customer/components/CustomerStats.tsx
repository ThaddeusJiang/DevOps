import { FC } from "react";
import Stats from "components/Stats";
import { Customer } from "types";

type Props = {
  items: Customer[];
};

const CustomerStats: FC<Props> = (props) => {
  const { items = [] } = props;

  const trialCount = items.filter((item) => item.type === "trial").length;
  // const totalCount = items.length;
  const subscribedCount = items.filter((item) => item.type === "paid").length;
  const leaveCount = items.filter((item) => item.type === "leave").length;

  return (
    <Stats
      title="Customer Stats"
      items={[
        { name: "trial count", value: trialCount },
        // { name: "total count", value: totalCount },
        { name: "subscribed count", value: subscribedCount },
        { name: "leave count", value: leaveCount },
      ]}
    />
  );
};

export default CustomerStats;

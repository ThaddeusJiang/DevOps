import { FC } from "react";
import Stats from "components/Stats";
import { Task } from "types";

type Props = {
  items: Task[];
};

const TaskStats: FC<Props> = (props) => {
  const { items = [] } = props;

  const taskCount = items.length;
  const succeededTaskCount = items.filter((item) => item.state === "succeeded").length;
  const failedTaskCount = items.filter((item) => item.state === "failed").length;

  return (
    <Stats
      title="Tasks Stats"
      items={[
        { name: "All Tasks", value: taskCount },
        { name: "Succeeded Tasks", value: succeededTaskCount },
        { name: "Failed Tasks", value: failedTaskCount },
      ]}
    />
  );
};

export default TaskStats;

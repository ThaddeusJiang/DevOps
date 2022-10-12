import dayjs from "dayjs";
import { groupBy } from "lodash";
import { FC, useMemo } from "react";

import { AxisOptions, Chart } from "react-charts";
import { Task } from "types";

type DailyCount = {
  date: Date;
  count: number;
};

type Series = {
  label: string;
  data: DailyCount[];
};

type Props = {
  items: Task[];
};

// TODO: 使用 fp 重构
const generateSeriesData = (items: Task[]) => {
  const data = Object.entries(
    groupBy(
      (items || []).map((item) => ({
        ...item,
        date: dayjs(item.scheduledStartedAt).startOf("day").toDate(),
      })),
      "date"
    )
  ).map(([date, tasks]) => ({
    date: dayjs(date).startOf("day").toDate(),
    count: tasks.length,
  }));

  return data;
};

const TaskLine: FC<Props> = (props) => {
  const { items } = props;
  if ((items || []).length === 0) {
    return <div>no data</div>;
  }

  const { failed, succeeded } = groupBy(items, "state");

  const data: Series[] = [
    {
      label: "All Tasks",
      data: generateSeriesData(items),
    },
    {
      label: "Succeeded Tasks",
      data: generateSeriesData(succeeded),
    },
    {
      label: "Failed Tasks",
      data: generateSeriesData(failed),
    },
  ];

  const primaryAxis = useMemo(
    (): AxisOptions<DailyCount> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyCount>[] => [
      {
        getValue: (datum) => datum.count,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
};

export default TaskLine;

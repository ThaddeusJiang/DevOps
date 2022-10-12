import dayjs from "dayjs";
import { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";

type DailyStars = {
  date: Date;
  stars: number;
};

type Series = {
  label: string;
  data: DailyStars[];
};

const Line = () => {
  const data: Series[] = [
    {
      label: "React Charts",
      data: [
        {
          date: dayjs().add(2, "day").toDate(),
          stars: 10,
        },
        {
          date: dayjs().add(4, "day").toDate(),
          stars: 30,
        },
        // ...
      ],
    },
    {
      label: "React Query",
      data: [
        {
          date: dayjs().add(1, "day").toDate(),
          stars: 100,
        },
        {
          date: dayjs().add(100, "day").toDate(),
          stars: 10,
        },
        // ...
      ],
    },
  ];

  const primaryAxis = useMemo(
    (): AxisOptions<DailyStars> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyStars>[] => [
      {
        getValue: (datum) => datum.stars,
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

export default Line;

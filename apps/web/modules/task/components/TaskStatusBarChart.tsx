import React from "react";

import dayjs from "dayjs";
import { groupBy } from "lodash";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Task } from "types";

const generateData = (items) => {
  return Object.entries(groupBy(items, "host")).map(([host, tasks]) => ({
    host,
    scheduled: tasks.filter((task) => task.state === "scheduled").length,
    queued: tasks.filter((task) => task.state === "queued").length,
    succeeded: tasks.filter((task) => task.state === "succeeded").length,
    failed: tasks.filter((task) => task.state === "failed").length,
  }));
};

const TaskStatusBarChart = ({ items }) => {
  const data = generateData(items);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="host" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="scheduled" fill="#f8bd24" background={{ fill: "#eee" }} />
        <Bar dataKey="queued" fill="#b5b2b2" background={{ fill: "#eee" }} />
        <Bar dataKey="succeeded" fill="#4ed399" background={{ fill: "#eee" }} />
        <Bar dataKey="failed" fill="#f47272" background={{ fill: "#eee" }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TaskStatusBarChart;

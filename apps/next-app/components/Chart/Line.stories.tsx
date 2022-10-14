import { Meta } from "@storybook/react";

import Line from "./Line";

export default {
  component: Line,
  title: "Components/Chart",
} as Meta;

export const LineChart: React.VFC = () => <Line />;

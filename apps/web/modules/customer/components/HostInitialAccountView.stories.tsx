import { Meta } from "@storybook/react";
import { baseHost } from "test/data";
import HostInitialAccountView from "./HostInitialAccountView";

export default {
  component: HostInitialAccountView,
  title: "Components",
} as Meta;

export const HostInitialAccount: React.VFC = () => (
  <HostInitialAccountView
    host={{
      ...baseHost,
      id: "jiang.test.com",
      createdAt: "2021-12-14T05:34:35.382Z",
    }}
  />
);

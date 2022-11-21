import { Meta } from "@storybook/react";
import HostStateSteps from "./HostStateSteps";

export default {
  component: HostStateSteps,
  title: "Components",
} as Meta;

export const HostStates: React.VFC = () => (
  <div>
    <HostStateSteps
      host={{
        state: "creating",
      }}
    />

    <HostStateSteps
      host={{
        state: "created",
      }}
    />

    <HostStateSteps
      host={{
        state: "publishing",
      }}
    />

    <HostStateSteps
      host={{
        state: "published",
      }}
    />

    <HostStateSteps
      host={{
        state: "confirmed",
      }}
    />
  </div>
);

import { Meta } from "@storybook/react";
import SectionLoading from "./SectionLoading";

export default {
  component: SectionLoading,
  title: "Components/Loading",
} as Meta;

export const SectionLoadingWithoutMessage: React.VFC = () => (
  <div className="relative w-80 h-80">
    <SectionLoading />
  </div>
);
export const SectionLoadingWithMessage: React.VFC = () => (
  <div className="relative w-80 h-80">
    <SectionLoading message="It takes long time!" />
  </div>
);

import { Meta } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { baseMansion } from "test/data";
import { MansionHosts } from "./MansionHosts";

export default {
  component: MansionHosts,
  title: "MansionHosts",
} as Meta;

const queryClient = new QueryClient();

export const HostInitialAccount: React.VFC = () => (
  <QueryClientProvider client={queryClient}>
    <MansionHosts mansion={{ ...baseMansion, id: "dev" }} />
  </QueryClientProvider>
);

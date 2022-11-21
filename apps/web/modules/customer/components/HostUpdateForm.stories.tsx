import { QueryClient, QueryClientProvider } from "react-query";

import { MockHost } from "data/mocks";

import HostUpdateForm from "./HostUpdateForm";

export default {
  component: HostUpdateForm,
  title: "Components/HostUpdateForm",
};

const queryClient = new QueryClient();

export const DefaultHostUpdateForm: React.VFC = () => (
  <QueryClientProvider client={queryClient}>
    <HostUpdateForm host={MockHost} />
  </QueryClientProvider>
);

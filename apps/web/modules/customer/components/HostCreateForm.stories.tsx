import { QueryClient, QueryClientProvider } from "react-query";

import HostCreateForm from "./HostCreateForm";

export default {
  component: HostCreateForm,
  title: "Components/HostCreateForm",
};

const queryClient = new QueryClient();

export const DefaultHostCreateForm: React.VFC = () => (
  <QueryClientProvider client={queryClient}>
    <HostCreateForm />
  </QueryClientProvider>
);

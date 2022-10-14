import { Meta, Story } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Mansion } from "types";
import MansionDetail from "./index";

const mockData = {
  "id": "36b8f84d-df4e-4d49-b662-bcde71a8764f",
  "databaseId": "36b8f84d-df4e-4d49-b662-bcde71a8764f",
  "domain": "http:// google.com",
  "frontDoorName": "http:// google.com",
};

const queryClient = new QueryClient();

interface MansionDetail {
  "value": Mansion;
}
export default {
  component: MansionDetail,
  title: "Components/MansionDetail",
} as Meta;

const Template: Story<MansionDetail> = (args) => (
  <QueryClientProvider client={queryClient}>
    <MansionDetail {...args} />
  </QueryClientProvider>
);
export const MansionDetailPage = Template.bind({});

MansionDetailPage.args = { value: mockData };

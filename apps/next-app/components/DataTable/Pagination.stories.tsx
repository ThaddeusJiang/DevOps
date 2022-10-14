import { Meta } from "@storybook/react";

import Pagination from "./Pagination";

export default {
  component: Pagination,
  title: "Components/DataTable/Pagination",
  argTypes: {
    onClick: { action: "clicked" },
  },
} as Meta;

export const PaginationDefault: React.VFC = () => (
  <Pagination
    previousPage={() => ""}
    canPreviousPage={false}
    nextPage={() => ""}
    canNextPage
    pageIndex={0}
    pageSize={100}
    setPageSize={() => ""}
    total={107}
  />
);

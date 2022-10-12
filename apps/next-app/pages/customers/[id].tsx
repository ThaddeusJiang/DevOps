import { useQuery } from "react-query";
import { useRouter } from "next/dist/client/router";

import { Customer } from "types";
import CustomerDetail from "components/CustomerDetail";

import { readCustomer } from "modules/customer/apis/customer";

const Index = () => {
  const router = useRouter();

  const { id } = router.query;

  const isNew = id === "new";

  const query = useQuery<Customer, Error>(["customers", id], async () => {
    if (!isNew) {
      const data = await readCustomer(id as string);
      return data;
    }
    return null;
  });

  if (query.isLoading) return "Loading...";

  if (query.error) return `An error has occurred: ${query.error.message}`;

  return <CustomerDetail isNew={isNew} {...query.data} />;
};

export default Index;

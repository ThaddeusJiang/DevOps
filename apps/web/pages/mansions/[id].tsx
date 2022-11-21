import { readMansion } from "modules/customer/apis/mansion";
import MansionCreateForm from "modules/customer/components/MansionCreateForm";

import { useQuery } from "react-query";

import { useRouter } from "next/dist/client/router";

import { Mansion } from "types";

import MansionDetail from "components/MansionDetail";

const MansionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const isNew = id === "new";
  const query = useQuery<Mansion, Error>(["mansions", id], async () => {
    if (!isNew) {
      const data = await readMansion(id as string);
      return data;
    }
    return null;
  });

  if (query.isLoading) return "Loading...";

  if (query.error) return `An error has occurred: ${query.error.message}`;

  return isNew ? <MansionCreateForm /> : <MansionDetail value={query.data} />;
};

export default MansionDetailPage;

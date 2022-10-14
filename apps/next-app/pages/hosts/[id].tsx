import { FC } from "react";
import { Host } from "types";
import HostCreateForm from "modules/customer/components/HostCreateForm";
import HostUpdateForm from "modules/customer/components/HostUpdateForm";
import Loading from "components/Loading";
import { readHost } from "modules/customer/apis/host";
import { useQuery } from "react-query";
import { useRouter } from "next/dist/client/router";

const Index: FC = () => {
  const router = useRouter();

  const { id } = router.query;
  const isNew = id === "new";
  const queryHost = useQuery<Host, Error>(["hosts", id], async () => {
    if (!isNew) {
      const data = await readHost(id as string);
      return data;
    }
    return null;
  });

  if (queryHost.isLoading) return <Loading />;

  if (queryHost.error) return <p>An error has occurred: {queryHost.error.message}</p>;

  return isNew ? <HostCreateForm /> : <HostUpdateForm host={queryHost.data} />;
};

export default Index;

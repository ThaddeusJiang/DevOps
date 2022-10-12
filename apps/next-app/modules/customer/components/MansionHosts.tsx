import { FC } from "react";
import { Host, Mansion } from "types";
import { useQuery } from "react-query";
import { findHosts } from "modules/customer/apis/host";
import Link from "next/link";
import Loading from "components/Loading";
import { MAX_MANSION_HOSTS } from "utils/constants";

interface Props {
  mansion: Mansion;
}

const MansionHostsContainer: FC = ({ children }) => (
  <div className="shadow sm:rounded-md bg-white py-6 px-4 sm:p-6">{children}</div>
);

export const MansionHosts: FC<Props> = ({ mansion }) => {
  const query = useQuery<Host[], Error>(["hosts_of_mansion", mansion.id], async () => {
    const filter = {
      "mansion.id": mansion.id,
    };
    const hosts = await findHosts({
      filter,
    });
    return hosts.items;
  });

  if (query.isLoading)
    return (
      <MansionHostsContainer>
        <Loading />
      </MansionHostsContainer>
    );

  if (query.error) return <MansionHostsContainer>Failed to load hosts list</MansionHostsContainer>;

  const hosts = query.data;

  const showCreateHostButton = hosts.length < MAX_MANSION_HOSTS;

  return (
    <MansionHostsContainer>
      {showCreateHostButton && (
        <Link href="/hosts/new">
          <a className="btn float-right btn-primary w-full sm:w-auto">New</a>
        </Link>
      )}
      <h3 className="text-lg leading-6 font-medium text-gray-900">Hosts</h3>
      <ul className="mt-2">
        {hosts.map((host) => (
          <li key={host.id} className="py-4 border-b border-gray-200">
            <Link href={`/hosts/${host.id}`}>
              <a className="text-indigo-600">{host.id}</a>
            </Link>
          </li>
        ))}
        {hosts.length === 0 && <div className="text-gray-600 mt-2">There are no hosts.</div>}
      </ul>
    </MansionHostsContainer>
  );
};

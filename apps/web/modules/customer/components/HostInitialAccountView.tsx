import dayjs from "dayjs";
import { Host } from "types";

interface Props {
  host: Host;
}

const HostInitialAccountView = ({ host }: Props) => {
  const hostUrl = `https://${host.id}`;

  const password = host.createdAt ? `admin${dayjs(host.createdAt).format("YYYYMMDD")}` : "unknown";
  return (
    <div className="bg-white ">
      <div className="">
        <dl className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          <dt>domain:</dt>
          <dd><a href={hostUrl} className="text-indigo-600" target="_blank" rel="noreferrer">{hostUrl}</a></dd>
        </dl>
        <dl className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          <dt>email:</dt>
          <dd>admin@example.com</dd>
        </dl>
        <dl className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          <dt>password:</dt>
          <dd>{password}</dd>
        </dl>
      </div>
    </div>
  );
};

export default HostInitialAccountView;

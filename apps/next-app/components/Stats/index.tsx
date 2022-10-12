import { FC } from "react";

type Props = {
  title: string;
  items: { name: string; value: string | number }[];
};

const Stats: FC<Props> = (props) => {
  const { title, items } = props;
  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.name}
            className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Stats;

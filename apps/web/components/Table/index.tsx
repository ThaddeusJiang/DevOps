import Link from "next/link";
import { FC } from "react";

type Props = {
  model: string;
  cols: { key: string; label: string }[];
  items: Record<string, unknown>[];
  actions: string[];
};

const Table: FC<Props> = ({ cols, items, model, actions }) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full ">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {cols.map((item) => (
                  <th
                    key={item.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {item.label}
                  </th>
                ))}

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">{actions.includes("edit") ? "Edit" : "View"}</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item) => (
                <tr key={item?.id as string}>
                  {cols.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item[col.key]}
                    </td>
                  ))}

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/${model}/${item.id}`}>
                      <a className="text-indigo-600 hover:text-indigo-900">
                        {actions.includes("edit") ? "Edit" : "View"}
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Table;

import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { FC } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  items: {
    name: string;
    href: string;
  }[];
  value: string;
};

const DataTableTabs: FC<Props> = (props) => {
  const { items, value } = props;
  const currentIndex = items.findIndex(({ name }) => name === value);
  const router = useRouter();
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue={items[currentIndex]?.name}
          onChange={(e) => {
            router.push(e.target.value);
          }}
        >
          {items.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block sm:rounded sm:px-4 bg-white">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {items.map((tab, i) => (
              <Link key={tab.name} href={tab.href}>
                <a
                  className={classNames(
                    currentIndex === i
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  )}
                  aria-current={currentIndex === i ? "page" : undefined}
                >
                  {tab.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DataTableTabs;

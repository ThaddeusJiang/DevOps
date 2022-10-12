/* eslint-disable @typescript-eslint/no-unused-vars */
import { findCustomers } from "modules/customer/apis/customer";
import { findTasks } from "modules/task/apis/task";
import TaskLineChart from "modules/task/components/TaskLineChart";
import TaskStats from "modules/task/components/TaskStats";

import { FC } from "react";
import { useQuery } from "react-query";

import dayjs from "dayjs";

import Loading from "../Loading";

// import CustomerStats from "modules/customer/components/CustomerStats";

const links = [
  {
    title: "Azure Portal",
    href: "https://portal.azure.com/",
    preview: "Cloud Computing Platform",
  },
  {
    title: "Datadog",
    href: "https://app.datadoghq.com/",
    preview: "Cloud Monitoring as a Service",
  },
  {
    title: "Documents",
    href: "https://git.nisshin-dev.work/mojito/documents",
    preview: "",
  },
  {
    title: "Git Repositories",
    href: "https://git.nisshin-dev.work/mojito/",
    preview: "",
  },
];

const Dashboard: FC = () => {
  // query stats from Customer API
  const queryCustomers = useQuery("customers", findCustomers);
  const queryTasks = useQuery("tasks", async () => {
    const tasks = await findTasks({
      filter: {
        "scheduledStartedAt >=": dayjs().startOf("day").subtract(30, "day").toISOString(),
        "scheduledStartedAt <": dayjs().endOf("day").toISOString(),
      },
      offset: 0,
      limit: 500,
    });
    return tasks;
  });

  return (
    <div>
      <h1 className="sr-only">Profile</h1>
      {/* Main 3 column grid */}
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {/* Welcome panel */}
          <section aria-labelledby="profile-overview-title">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <div className="p-6">
                {queryTasks.isLoading ? <Loading /> : <TaskStats items={queryTasks.data?.items} />}
              </div>
            </div>
          </section>

          <section aria-labelledby="profile-overview-title">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <div className=" p-6 ">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Task Line</h3>
                <div className="h-80">
                  {/* {queryTasks.isLoading ? (
                    <Loading />
                  ) : (
                    <TaskLineChart items={queryTasks.data?.items} />
                  )} */}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          {/* links */}
          <section aria-labelledby="links-title">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <div className="p-6">
                <h2 className="text-base font-medium text-gray-900 capitalize" id="links-title">
                  links
                </h2>
                <div className="flow-root mt-6">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {links.map((link) => (
                      <li key={link.title} className="py-5">
                        <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                          <h3 className="text-sm font-semibold text-gray-800">
                            <a href={link.href} className="hover:underline focus:outline-none">
                              {/* Extend touch target to entire panel */}
                              <span className="absolute inset-0" aria-hidden="true" />
                              {link.title}
                            </a>
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{link.preview}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useQuery } from "react-query";
import Link from "next/link";
import { FC, useMemo } from "react";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";

import { findCustomers } from "modules/customer/apis/customer";
import { DataTableLinkCell } from "components/DataTable/DataTableLinkCell";
import DataTable from "components/DataTable/DataTable";
import { safeJSONparse } from "utils/json";
import { nextQuery } from "utils/url";
import Loading from "components/Loading";
import DataNotFound from "components/DataNotFound/DataNotFound";

const Customers: FC = () => {
  const router = useRouter();
  const filterString = router.query.filter as string;
  const sortString = router.query.sort as string;
  const page = parseInt(router.query.page as string, 10);
  const pageSize = parseInt(router.query.pageSize as string, 10);

  const { register, handleSubmit } = useForm();

  const query = useQuery(["customers", { filterString, sortString, page, pageSize }], async () =>
    findCustomers({
      filter: safeJSONparse(filterString),
      sort: safeJSONparse(sortString),
      offset: (page - 1) * pageSize || 0,
      limit: pageSize || 100,
    })
  );

  const parseCustomerInfo = (res) => ({
    ...res,
    host: res.domain,
    status: "TODO:",
  });

  const columns = useMemo(
    () => [
      {
        Header: "companyName",
        accessor: "companyName",
        width: 300,
        Cell: (data) => (
          <DataTableLinkCell
            // eslint-disable-next-line react/destructuring-assignment
            link={`/customers/${data.row.original.id}`}
            // eslint-disable-next-line react/destructuring-assignment
            text={data.cell.value}
          />
        ),
      },
      {
        Header: "type",
        accessor: "type",
      },
      {
        Header: "plan",
        accessor: "plan",
      },
      {
        Header: "host",
        accessor: "host",
      },
      {
        Header: "status",
        accessor: "status",
      },
    ],
    []
  );

  return (
    <>
      <div className="px-4 py-4 sm:px-0 flex justify-between">
        <h1 className="text-3xl font-extrabold text-white">Customers</h1>

        <Link href="/customers/new">
          <a className="btn btn-primary w-full sm:w-auto">New</a>
        </Link>
      </div>

      <div className="sm:flex sm:justify-between sm:bg-white">
        <div className="py-2 sm:px-4">
          <form
            onSubmit={handleSubmit((data) => {
              const { host } = data;
              router.push({
                query: nextQuery(router.query, "id", host),
              });
            })}
          >
            <input
              type="text"
              className="input input-bordered"
              placeholder="Search host"
              {...register("host")}
            />
            <input type="submit" className="hidden" />
          </form>
        </div>
        <div />
      </div>

      <div className="w-full sm:bg-white">
        {query.isLoading ? (
          <div className="text-center h-screen-sm ">
            <Loading />
          </div>
        ) : (
          <>
            {query.data?.items?.length ? (
              <DataTable
                columns={columns}
                data={(query.data?.items || []).map(parseCustomerInfo)}
                pageCount={Math.ceil(query.data?.total / pageSize)}
                total={query.data?.total}
              />
            ) : (
              <DataNotFound>
                <div className="py-2 sm:px-4">
                  <Link href="/taskDefinitions/new">
                    <a className="btn btn-primary w-full sm:w-auto">New</a>
                  </Link>
                </div>
              </DataNotFound>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Customers;

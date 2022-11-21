import { FC } from 'react'
import Link from "next/link";
import { useQuery } from "react-query";
import { useRouter } from "next/dist/client/router";

import { safeJSONparse } from "utils/json";
import { DataTableDateCell } from "components/DataTable/DataTableDateCell"
import DataTable from "components/DataTable/DataTable";
import { findAuditLogRequests } from 'modules/customer/apis/auditLog'
import Loading from "components/Loading";
import DataNotFound from "components/DataNotFound/DataNotFound";

const columns = [
  {
    Header: "Id",
    accessor: "id",
    Cell: ({ cell: { value } }) => <span>{value}</span>,
  },
  {
    Header: "Domain",
    accessor: "domain",
  },
  {
    Header: "Start Date",
    accessor: "startDate",
    Cell: ({ cell: { value } }) => <DataTableDateCell value={value} onlyDate />,
  },
  {
    Header: "End Date",
    accessor: "endDate",
    Cell: ({ cell: { value } }) => <DataTableDateCell value={value} onlyDate />,
  },
  {
    Header: "Created At",
    accessor: "createdAt",
    Cell: ({ cell: { value } }) => <DataTableDateCell value={value} />,
  },
  {
    Header: "State",
    accessor: "state",
  },
  {
    Header: "Remark",
    accessor: "remark",
  },
]

const AuditLogs: FC = () => {
  const router = useRouter()
  const page = parseInt(router.query.page as string, 10);
  const pageSize = parseInt(router.query.pageSize as string, 10);
  const sortString = router.query.sort as string;

  const query = useQuery(
    ['auditLogs', { page, pageSize, sortString }],
    async () => findAuditLogRequests({
      offset: (page - 1) * pageSize || 0,
      limit: pageSize || 100,
      sort: sortString ? safeJSONparse(sortString) : ['createdAt', 'DESC'],
    })
  )

  return (
    <>
      <div className="px-4 py-4 sm:px-0 flex justify-between">
        <h1 className="text-3xl font-extrabold text-white">Audit Logs</h1>
      </div>

      <div className="sm:flex sm:justify-between sm:bg-white">
        <div/>
        <div className="py-2 sm:px-4">
          <Link href="/auditLogs/new">
            <a className="btn btn-primary w-full sm:w-auto">New</a>
          </Link>
        </div>
      </div>

      <div className="w-full sm:bg-white">
        {query.isLoading
          ? (
            <div className="text-center h-screen-sm ">
              <Loading/>
            </div>
          )
          : (
            <>
            {query.data?.items?.length
              ? (
                <DataTable
                  columns={columns}
                  data={query.data.items}
                  pageCount={Math.ceil(query.data?.total / pageSize)}
                  total={query.data?.total}
                />
              )
              : (
                <DataNotFound description="Not found any audit log requests" />
              )}
            </>
          )
        }
      </div>
    </>
  )
}

export default AuditLogs

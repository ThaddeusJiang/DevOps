import { findTaskDefinitions, toggleTaskDefinition } from "modules/task/apis/taskDefinition";
import { safeJSONparse } from "utils/json";
import { nextQuery } from "utils/url";

import { useRouter } from "next/dist/client/router";
import Link from "next/link";

import { FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";

import DataNotFound from "components/DataNotFound/DataNotFound";
import DataTable from "components/DataTable/DataTable";
import { DataTableLinkCell } from "components/DataTable/DataTableLinkCell";
import Loading from "components/Loading";

const EditableTaskDefinitionActiveCell = (props) => {
  const {
    row: { original: taskDefinition },
    cell: { value: activated },
  } = props;

  const queryClient = useQueryClient();

  const onSuccess = async () => {
    toast.success("Success");
  };

  const toggleMutation = useMutation(toggleTaskDefinition, {
    onSuccess,
    onSettled: (data, error, { id }) => {
      queryClient.refetchQueries("taskDefinitions");
      queryClient.refetchQueries(["taskDefinitions", id]);
    },
  });

  return (
    <input
      type="checkbox"
      className="toggle toggle-primary"
      checked={activated}
      onChange={(e) =>
        toggleMutation.mutate({ id: taskDefinition.id, activated: e.target.checked })
      }
    />
  );
};

const Index: FC<unknown> = () => {
  const router = useRouter();
  const filterString = router.query.filter as string;
  const sortString = router.query.sort as string;
  const page = parseInt(router.query.page as string, 10);
  const pageSize = parseInt(router.query.pageSize as string, 10);

  const { register, handleSubmit } = useForm();

  const query = useQuery(
    ["taskDefinitions", { filterString, sortString, page, pageSize }],
    async () =>
      findTaskDefinitions({
        filter: safeJSONparse(filterString),
        sort: sortString ? safeJSONparse(sortString) : ['createdAt', 'DESC'],
        offset: (page - 1) * pageSize || 0,
        limit: pageSize || 100,
      })
  );

  const parseTaskDefinition = (res) => ({
    ...res,
  });

  const columns = useMemo(
    () => [
      {
        Header: "description",
        accessor: "description",
        Cell: (data) => (
          <DataTableLinkCell
            // eslint-disable-next-line react/destructuring-assignment
            link={`/taskDefinitions/${data.row.original.id}`}
            // eslint-disable-next-line react/destructuring-assignment
            text={data.cell.value}
          />
        ),
      },
      {
        Header: "cronExpression",
        accessor: "cronExpression",
      },
      {
        Header: "activated",
        accessor: "activated",
        // Cell: ({ cell: { value } }) => <DataTableBooleanCell value={value} />,
        Cell: EditableTaskDefinitionActiveCell,
      },
    ],
    []
  );

  return (
    <>
      <div className="px-4 py-4 sm:px-0 flex justify-between">
        <h1 className="text-3xl font-extrabold text-white">Task Definitions</h1>
      </div>

      <div className=" sm:flex sm:justify-between sm:bg-white">
        <div className="py-2 sm:px-4">
          <form
            onSubmit={handleSubmit((data) => {
              const { host } = data;
              router.push({
                query: nextQuery(router.query, "host", host),
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
        <div className="py-2 sm:px-4">
          <Link href="/taskDefinitions/new">
            <a className="btn btn-primary w-full sm:w-auto">New</a>
          </Link>
        </div>
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
                data={(query.data?.items || []).map(parseTaskDefinition)}
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

export default Index;

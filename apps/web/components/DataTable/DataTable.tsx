/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo } from "react";
import { useBlockLayout, usePagination, useResizeColumns, useTable } from "react-table";

import { useRouter } from "next/dist/client/router";

import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";

import classNames from "classnames";

import { safeJSONparse } from "utils/json";

import Pagination from "./Pagination";

const DefaultCell = ({ value }) => <div title={value}>{value || "-"}</div>;

const DataTable = ({ columns, data, pageCount: controlledPageCount, total }) => {
  const router = useRouter();

  const defaultColumn = useMemo(
    () => ({
      width: 240,
      Cell: DefaultCell,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 100 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    useBlockLayout,
    usePagination,
    useResizeColumns
  );

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    router.push({
      query: {
        ...router.query,
        page: pageIndex + 1,
        pageSize,
      },
    });
  }, [pageIndex, pageSize]);
  const [field, sort] = safeJSONparse(router.query.sort) || [];

  const handleSort = (column) => {
    router.push({
      query: {
        ...router.query,
        sort: JSON.stringify([column.id, sort === "asc" ? "desc" : "asc"]),
      },
    });
  };

  // Render the UI for your table
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        {/* Table */}
        <div className="py-2 align-middle inline-block min-w-full ">
          <div className="pt-px overflow-hidden border-b border-gray-200 ">
            <div {...getTableProps()} className="min-w-full divide-y divide-gray-200">
              <div>
                {headerGroups.map((headerGroup) => (
                  <div {...headerGroup.getHeaderGroupProps()} className="">
                    {headerGroup.headers.map((column) => (
                      <div {...column.getHeaderProps()}>
                        <button
                          type="button"
                          onClick={() => handleSort(column)}
                          className="flex w-full px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                        >
                          <span>{column.render("Header")}</span>
                          {field === column.id && (
                            <span className="ml-2 w-5">
                              {sort === "asc" ? <SortAscendingIcon /> : <SortDescendingIcon />}
                            </span>
                          )}
                        </button>
                        {/* Use column.getResizerProps to hook up the events correctly */}
                        <div
                          {...column.getResizerProps()}
                          className={classNames({
                            " inline-block bg-transparent hover:bg-gray-500 w-px h-full absolute right-0 top-0 z-10": true,
                            "  shadow ": column.isResizing,
                          })}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <div {...row.getRowProps()} className="hover:bg-gray-100">
                      {row.cells.map((cell) => (
                        <div
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate "
                        >
                          {cell.render("Cell")}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className=" py-2 align-middle inline-block min-w-full ">
        <Pagination
          previousPage={previousPage}
          canPreviousPage={canPreviousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
        />
      </div>
    </div>
  );
};

export default DataTable;

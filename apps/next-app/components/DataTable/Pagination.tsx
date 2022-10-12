import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const Pagination = ({
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
  pageIndex,
  //   pageOptions,
  //   gotoPage,
  pageSize,
  setPageSize,
  total,
}) => {
  const first = pageIndex * pageSize + 1;
  const last = (pageIndex + 1) * pageSize > total ? total : (pageIndex + 1) * pageSize;
  return (
    <nav
      className="bg-white rounded px-4 py-3 flex items-center justify-end border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <select
        className=" select"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[100, 200, 500].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>

      <div className="ml-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{first}</span> to{" "}
          <span className="font-medium">{last}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </p>
      </div>

      <div className="ml-4 btn-group">
        <button
          type="button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="btn btn-sm btn-link"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="btn btn-sm btn-link"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;

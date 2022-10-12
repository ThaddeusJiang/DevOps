import classNames from "classnames";

const StatusTag = ({ value }) => (
  <span
    className={classNames({
      "px-3 py-1 rounded": true,
      "success ": value === "succeeded",
      "failure ": value === "failed",
      "bg-yellow-500 text-white": value === "scheduled",
    })}
  >
    {value}
  </span>
);

export default StatusTag;

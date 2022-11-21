import { FC } from "react";

type Props = {
  title?: string;
  description?: string;
};

const DataNotFound: FC<Props> = (props) => {
  const { title, description, children } = props;
  return (
    <div className="hero min-h-screen-sm bg-base-200">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h2 className="mb-5 text-2xl font-medium"> {title || "Data Not Found"} </h2>
          <p className="mb-5">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DataNotFound;

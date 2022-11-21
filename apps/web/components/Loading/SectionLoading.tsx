import { FC } from "react";
import Loading from "./index";

type Props = {
  message?: string;
};

/**
 * the parent component should be `relative` positioned
 * @param props
 * @returns
 */
const SectionLoading: FC<Props> = (props) => {
  const { message } = props;

  return (
    <div className=" bg-white bg-opacity-90 text-indigo-600  w-full h-full flex justify-center items-center">
      <div>
        <p className="text-center">{message}</p>

        <span className="flex justify-center">
          <Loading />
        </span>
      </div>
    </div>
  );
};

export default SectionLoading;

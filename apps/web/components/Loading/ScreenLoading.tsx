import { FC } from "react";
import Loading from "./index";

const ScreenLoading: FC = () => (
  <div className=" w-screen h-screen  flex justify-center items-center">
    <Loading />
  </div>
);

export default ScreenLoading;

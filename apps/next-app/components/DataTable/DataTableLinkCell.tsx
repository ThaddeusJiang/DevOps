import { FC } from "react";
import Link from "next/link";

type Props = {
  link: string;
  text: string;
};

export const DataTableLinkCell: FC<Props> = (props) => {
  const { link, text } = props;

  return (
    <Link href={link}>
      <a className="text-indigo-600">{text}</a>
    </Link>
  );
};

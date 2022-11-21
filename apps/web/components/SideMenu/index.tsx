import { FC } from "react";

interface Menu {
  name: string;
  icon: JSX.Element; // https://heroicons.com/
  linkId: string;
}

export type SideMenuProps = {
  menuName?: string;
  menuList: Menu[];
};

const SideMenu: FC<SideMenuProps> = (props) => {
  const { menuList, menuName = "Menu" } = props;

  return (
      <ul className="menu shadow sticky top-0 p-3 sm:h-2/5 bg-base-100 border sm:rounded-md">
        <li className="menu-title">
          <span className="truncate" title={menuName}>{menuName}</span>
        </li>
        {menuList.map((menu) => (
          <li key={menu.linkId}>
            <a href={`#${menu.linkId}`} className="items-start">
              <div className="mr-2 w-5 shrink-0">
                <>{menu.icon}</>
              </div>
              <span className="truncate" title={menu.name}>{menu.name}</span>
            </a>
          </li>
        ))}
      </ul>
  );
};

export default SideMenu;

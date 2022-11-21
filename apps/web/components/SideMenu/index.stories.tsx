import { Meta, Story } from "@storybook/react";
import { DocumentTextIcon, ClipboardCheckIcon, BeakerIcon, CakeIcon } from "@heroicons/react/outline";
import SideMenu, { SideMenuProps } from "./index";

const menuList = [
  {
    name: "StatusStatusStatusStatusStatus",
    icon: <BeakerIcon />,
    linkId: "status",
  },
  {
    name: "Information",
    icon: <DocumentTextIcon />,
    linkId: "DocumentTextIcon",
  },
  {
    name: "Information",
    icon: <ClipboardCheckIcon />,
    linkId: "ClipboardCheckIcon",
  },
  {
    name: "Information",
    icon: <CakeIcon />,
    linkId: "CakeIcon",
  },
];

export default {
  component: SideMenu,
  title: "Components/SideMenu",
} as Meta;

const Template: Story<SideMenuProps> = (args) => <SideMenu {...args} />;

export const SideMenuPage = Template.bind({});

SideMenuPage.args = { menuList };

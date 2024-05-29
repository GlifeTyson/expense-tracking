import React from "react";
import { TransactionOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "Transaction",
    label: "Transaction Management",
    icon: <TransactionOutlined />,
  },
  {
    key: "User",
    label: "User Management",
    icon: <UserOutlined />,
  },
];

const MenuBar: React.FC = () => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: "fit" }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};

export default MenuBar;

import React, { useState } from "react";
import { Button, Flex, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import ModalUser from "./ModalUser";
import { EyeOutlined } from "@ant-design/icons";

interface UserType {
  key: React.Key;
  id: string;
  username: string;
  role_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface TableUserProps {
  users: UserType[];
}
const TableUser: React.FC<TableUserProps> = ({ users }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("Edit");
  const [selectedUser, setSelectedUser] = useState<UserType>({} as UserType);
  const userColumns: TableColumnsType<UserType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["lg"],
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role_name", key: "role_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Operation",
      dataIndex: "Operation",
      render: (_: any, record: UserType) => {
        return (
          <div className="flex flex-col lg:flex-row lg:justify-evenly lg:items-center">
            {openModal && (
              <ModalUser
                mode={mode}
                user={selectedUser}
                setOpen={setOpenModal}
                open={openModal}
              />
            )}
            <div className="flex justify-center gap-x-4 py-2">
              <Typography.Link
                onClick={() => {
                  setOpenModal(true);
                  setMode("Edit");
                  setSelectedUser(record);
                }}
              >
                Edit
              </Typography.Link>
              <Typography.Link
                onClick={() => {
                  setOpenModal(true);
                  setMode("Delete");
                  setSelectedUser(record);
                }}
              >
                Delete
              </Typography.Link>
            </div>

            <div>
              <Button
                className="w-fit lg:w-full"
                type="primary"
                icon={<EyeOutlined />}
              >
                View Profile
              </Button>
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <Table
      className="overflow-x-auto container"
      size="large"
      title={() => "All User"}
      footer={() => "Total: " + users?.length / 2 + " of " + users?.length}
      bordered={true}
      columns={userColumns}
      dataSource={users}
      pagination={{
        className: "w-full",
        defaultCurrent: 1,
        pageSize:
          users?.length % 2 === 0 ? users?.length / 2 : users?.length / 2 + 1,
        showSizeChanger: true,
      }}
      tableLayout="auto"
    />
  );
};

export default TableUser;

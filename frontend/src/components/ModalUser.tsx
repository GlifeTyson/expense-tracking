import React, { useState } from "react";
import { Input, Modal, Form, Select } from "antd";
import _ from "lodash";
import toast from "react-hot-toast";

interface UserType {
  key: React.Key;
  id: string;
  username: string;
  role_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface updateUserType {
  username: string;
  email: string;
  role_name: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType;
  mode: string;
}

const ModalUser: React.FC<Props> = ({ open, setOpen, user, mode }) => {
  const updateValues = { ...user };

  const handleCancel = () => {
    setOpen(false);
  };
  const handleInputChange = (key: string, value: string) => {
    updateValues[key] = value;
    if (key === "role_name") {
      updateValues["role"]["name"] = value;
    }
  };
  const handleEdit = ({ id, value }: { id: string; value: updateUserType }) => {
    try {
      console.log("id", id);
      console.log("value", value);
      console.log("updateValues", updateValues);
    } catch (error) {
      toast.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      console.log("id", id);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <Modal
        open={open}
        title={
          mode === "Edit"
            ? "Edit User"
            : mode === "Create"
            ? "Create User"
            : "Delete User"
        }
        onCancel={() => handleCancel()}
        onOk={
          mode === "Edit" || mode === "Create"
            ? () => setOpen(false)
            : () => handleDelete(user.id)
        }
      >
        {mode === "Edit" || mode === "Create" ? (
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={
              mode === "Edit" ? updateValues : ({} as updateUserType)
            }
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: false, message: "Please input your username!" },
              ]}
            >
              <Input
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={mode === "Edit" ? true : false}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                  type: "email",
                },
              ]}
            >
              <Input
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: mode === "Edit" ? false : true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                onChange={(e) => handleInputChange("password", e.target.value)}
                minLength={6}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: mode === "Edit" ? false : true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                ref={"password"}
              />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role_name"
              rules={[{ required: false, message: "Please input your role!" }]}
            >
              <Select
                onChange={(e) => handleInputChange("role_name", e.target.value)}
                disabled={mode === "Edit" ? true : false}
              >
                <Select.Option value="superadmin">SuperAdmin</Select.Option>
                <Select.Option value="user">User</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        ) : (
          <p>Are you sure you want to delete this user?</p>
        )}
      </Modal>
    </>
  );
};

export default ModalUser;

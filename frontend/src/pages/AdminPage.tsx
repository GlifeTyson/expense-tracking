import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserProvider.tsx";
import { MdLogout } from "react-icons/md";
import Auth from "../utils/auth.ts";
import TableUser from "../components/TableUser.tsx";
import { Button, Menu, MenuProps, Segmented } from "antd";
import useSWR from "swr";
import { fetchAllUser } from "../graphql/queries/user.queries.ts";
import { fetcher } from "../services/fetcher.ts";
import TableTransaction from "../components/TableTransaction.tsx";
import { getAllTransactions } from "../graphql/queries/transaction.queries.ts";
import useSortColumn from "../hooks/useSortColumn";
import ModalUser from "../components/ModalUser.tsx";
import { TransactionOutlined, UserOutlined } from "@ant-design/icons";
import InvestChart from "../components/summary/SumByUser.tsx";
import Category from "../components/summary/SumByUser.tsx";
import SumByUser from "../components/summary/SumByUser.tsx";
import SumByCategory from "../components/summary/SumByCategory.tsx";
import SumByMonth from "../components/summary/SumByMonth.jsx";
import SumByYear from "../components/summary/SumByYear.tsx";

interface UserType {
  key: React.Key;
  id: string;
  username: string;
  role: {
    name: string;
  };
  role_name: string;
  profilePicture: string;
  password: string;
  confirmPassword: string;
  email: string;
}
interface TransactionType {
  key: React.Key;
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentType: string;
  date: string;
  location: string;
  userId: string;
  user: {
    username: string;
  };
}

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
  {
    key: "Summary",
    label: "Summary by ",
    icon: <TransactionOutlined />,
    children: [
      { key: "SumByUser", label: "User" },
      { key: "Category", label: "Category" },
      { key: "Month", label: "Month" },
      { key: "Year", label: "Year" },
    ],
  },
];
const AdminPage = () => {
  const { me } = useContext(UserContext);
  const [show, setShow] = useState<string>("Transaction");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { sortOrderBy, handleSort, sortParams } = useSortColumn();

  const params = {
    filter: {},
    first: 20,
    skip: 0,
    orderBy: "createdAt_DESC",
    include: "role",
  };
  const {
    data: fetchUsers,
    isLoading,
    isValidating,
  } = useSWR([fetchAllUser, params], fetcher);

  const dataUser = fetchUsers?.allUsers.map((user: UserType, index: number) => {
    return {
      key: index + 1,
      id: user.id,
      username: user.username,
      email: user.email,
      role_name: user.role.name,
    };
  });
  const transactionParams = {
    filter: {},
    first: 50,
    skip: 0,
    orderBy: sortParams() ? sortParams() : "createdAt_DESC",
    include: "user",
  };
  const {
    data: fetchTransactions,
    isLoading: isLoadingTransactions,
    isValidating: isValidatingTransactions,
    mutate: mutateTransactions,
  } = useSWR([getAllTransactions, transactionParams], fetcher);

  const dataTransaction = fetchTransactions?.allTransactions.map(
    (transaction: TransactionType, index: number) => {
      return {
        key: index + 1,
        id: transaction.id,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        paymentType: transaction.paymentType,
        date: new Date(transaction.date).toISOString().split("T")[0],
        location: transaction.location,
        username: transaction.user.username,
      };
    }
  );
  const transactions: TransactionType[] = fetchTransactions?.allTransactions;
  const handleLogout: () => void = () => {
    try {
      Auth.logout();
      if (Auth.check()) {
        setTimeout((_: any) => {
          location.href = "/login";
        }, 100);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const renderContent = () => {
    switch (show) {
      case "User":
        return <TableUser users={dataUser} />;
      case "Transaction":
        return (
          <TableTransaction
            transactions={dataTransaction}
            handleSort={handleSort}
            mutateTransactions={mutateTransactions}
          />
        );
      case "SumByUser":
        return <SumByUser transactions={transactions} />;
      case "Category":
        return <SumByCategory transactions={transactions} />;
      case "Month":
        return <SumByMonth />;
      case "Year":
        return <SumByYear />;
      // Add more cases as needed
      default:
        return <div>Select an option from the menu</div>;
    }
  };
  return (
    <div className="flex flex-col gap-6 items-center mx-auto max-w-[97%] z-20 relative justify-center">
      <div className="flex items-center">
        <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
          Welcome, {me?.username}
        </p>
        <img
          src={me?.profilePicture}
          className="w-11 h-11 rounded-full border cursor-pointer"
          alt="Avatar"
        />

        <MdLogout
          color="black"
          className="mx-2 w-5 h-5 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
      <div className="w-full h-full flex">
        <Menu
          className="w-fit"
          items={items}
          onClick={(e) => {
            setShow(e.key);
          }}
          defaultSelectedKeys={["Transaction"]}
          mode="inline"
        />

        <div className="w-full h-full flex items-center justify-center">
          {renderContent()}

          {openModal && (
            <ModalUser
              mode={"Create"}
              user={{} as UserType}
              setOpen={setOpenModal}
              open={openModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

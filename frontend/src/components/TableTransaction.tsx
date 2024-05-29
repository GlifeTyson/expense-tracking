import React, { useEffect, useState } from "react";
import { Flex, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import ModalTransaction from "./ModalTransaction";

interface TransactionType {
  key: React.Key;
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentType: string;
  date: string;
  location: string;
  username: string;
}

interface TableTransactionProps {
  transactions: TransactionType[];
  handleSort: (key: string) => void;
  mutateTransactions: () => void;
}

const TableTransaction = ({
  transactions,
  handleSort,
  mutateTransactions,
}: TableTransactionProps) => {
  const [editing, setEditting] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("Edit");
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(transactions?.length / 2);

  useEffect(() => {
    if (transactions?.length > 0) {
      setPageCount(1);
      setPageSize(transactions.length / 2);
    }
  }, [transactions]);

  const calculatePageRange = () => {
    const start = (pageCount - 1) * pageSize + 1;
    const end = Math.min(pageCount * pageSize, transactions?.length);
    return { start, end };
  };

  const { start, end } = calculatePageRange();

  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionType>({} as TransactionType);
  const transactionColumn: TableColumnsType<TransactionType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
      responsive: ["lg"],
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "9%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      width: "9%",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "10%",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("date"),
      }),
      responsive: ["lg"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Amount($)",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("amount"),
      }),
      width: "8%",
    },

    {
      title: "Operation",
      dataIndex: "Operation",
      render: (_: any, record: TransactionType) => {
        return (
          <div className="flex flex-col gap-y-2 lg:flex-row lg:justify-evenly">
            {editing && (
              <ModalTransaction
                open={editing}
                setOpen={setEditting}
                transaction={selectedTransaction}
                mutateTransactions={mutateTransactions}
                mode={mode}
              />
            )}
            {openModalDelete && (
              <ModalTransaction
                open={openModalDelete}
                setOpen={setOpenModalDelete}
                transaction={selectedTransaction}
                mutateTransactions={mutateTransactions}
                mode={mode}
              />
            )}

            <Typography.Link
              onClick={() => {
                setEditting(true);
                setMode("Edit");
                setSelectedTransaction(record);
              }}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                setOpenModalDelete(true);
                setMode("Delete");
                setSelectedTransaction(record);
              }}
            >
              Delete
            </Typography.Link>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="overflow-x-auto container"
      title={() => "All Transaction"}
      footer={() => `From: ${start} to ${end} of ${transactions?.length}`}
      size="large"
      bordered={true}
      columns={transactionColumn}
      dataSource={transactions}
      pagination={{
        defaultCurrent: 1,
        pageSize:
          transactions?.length % 2 === 0
            ? transactions?.length / 2
            : transactions?.length / 2 + 1,
        showSizeChanger: false,
        size: "default",

        onChange(page, pageSize) {
          if (pageSize >= 1) {
            setPageCount(page);
            setPageSize(pageSize);
          }
        },
        current: pageCount,
        total: transactions?.length,
      }}
      tableLayout="auto"
    />
  );
};
export default TableTransaction;

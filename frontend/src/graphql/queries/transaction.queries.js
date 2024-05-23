import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      amount
      category
      description
      date
      location
      paymentType
      userId
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($transactionId: ID!) {
    transaction(transactionId: $transactionId) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;
export const GET_TRANSACTION_STATISTICS = gql`
  query GetTransactionStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;

export const getTransactions = `
query Query($filter: FilterTransaction, $first: Int, $orderBy: TransactionOrder, $skip: Int) {
  myTransactions(filter: $filter, first: $first, orderBy: $orderBy, skip: $skip) {
    id
    userId
    amount
    description
    category
    paymentType
    date
    location
  }
}
`;

export const getTransactionStatistics = `
  query CategoryStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;
export const getTransactionQuery = `
query Query($transactionId: ID!) {
  transaction(id: $transactionId) {
    id
    userId
    amount
    description
    category
    paymentType
    date
    location
  }
}
`;

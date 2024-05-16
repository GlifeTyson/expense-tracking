import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
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

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
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

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: ID!) {
    deleteTransaction(transactionId: $transactionId) {
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

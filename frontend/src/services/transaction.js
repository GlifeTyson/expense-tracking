import {
  createTransactionQuery,
  deleteTransactionQuery,
  updateTransactionQuery,
} from "../graphql/mutations/transaction.mutations";
import { getTransactionQuery } from "../graphql/queries/transaction.queries";
import { createAxios } from "../lib/axios";
export async function getTransaction({ transactionId }) {
  try {
    const res = await createAxios().post("http://localhost:3001/graphql", {
      query: getTransactionQuery,
      variables: {
        transactionId: transactionId,
      },
    });
    return res;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
export async function createTransaction({ input }) {
  try {
    const res = await createAxios().post("http://localhost:3001/graphql", {
      query: createTransactionQuery,
      variables: {
        input: input,
      },
    });
    return res;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
export function updateTransaction({ id, input }) {
  try {
    const res = createAxios().post("http://localhost:3001/graphql", {
      query: updateTransactionQuery,
      variables: {
        updateTransactionId: id,
        input: input,
      },
    });
    return res;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export function deleteTransaction(transactionId) {
  try {
    const res = createAxios().post("http://localhost:3001/graphql", {
      query: deleteTransactionQuery,
      variables: {
        deleteTransactionId: transactionId,
      },
    });
    return res;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

import { transactions } from "../dummyData/data.js";
import Transaction from "../models/transaction.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        const user = context.getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ user: userId });

        return transactions;
      } catch (error) {
        console.error("error in query all transactions: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("error in query transaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const user = context.getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }
        const userId = await context.getUser()._id;
        const transaction = new Transaction(...input, { user: userId });

        await transaction.save();
        return transaction;
      } catch (error) {
        console.error("error in createTransaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const user = context.getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }
        const findTransaction = await Transaction.findById(input.transactionId);
        if (!findTransaction) {
          throw new Error("Transaction not found");
        }
        const transaction = await Transaction.updateOne(
          { _id: input.transactionId },
          input
        );
        return { message: "Transaction updated" };
      } catch (error) {
        console.error("error in updateTransaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return { message: "Transaction deleted" };
      } catch (error) {
        console.error("error in updateTransaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default transactionResolver;

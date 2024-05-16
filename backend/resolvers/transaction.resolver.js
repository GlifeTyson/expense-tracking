import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Error creating transaction:", err);
        throw new Error("Error creating transaction");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("error in query transaction: ", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};

      // const transactions = [
      // 	{ category: "expense", amount: 50 },
      // 	{ category: "expense", amount: 75 },
      // 	{ category: "investment", amount: 100 },
      // 	{ category: "saving", amount: 30 },
      // 	{ category: "saving", amount: 20 }
      // ];

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      // categoryMap = { expense: 125, investment: 100, saving: 50 }

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
      // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
    },
  },
  Mutation: {
    createTransaction: async (_, { input: args }, context) => {
      try {
        const user = context.getUser();

        if (!user) {
          throw new Error("Unauthorized");
        }

        const newTransaction = new Transaction({
          ...args,
          userId: user._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("error in createTransaction: ", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    updateTransaction: async (_, { input: args }, context) => {
      try {
        console.log("input", args);
        const user = context.getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }
        if (!isValidObjectId(args.transactionId)) {
          throw new Error("Invalid transaction id");
        }
        const findTransaction = await Transaction.findById(args.transactionId);
        if (!findTransaction) {
          throw new Error("Transaction not found");
        }
        const transaction = await Transaction.updateOne(
          { _id: args.transactionId },
          args
        );
        const transactionUpdate = await Transaction.findById(
          args.transactionId
        );
        return transactionUpdate;
      } catch (error) {
        console.error("error in updateTransaction: ", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error getting user:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;

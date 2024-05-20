import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.queries";
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from "../graphql/queries/user.queries";

const Cards = ({ transactions, isLoading, mutate }) => {
  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!isLoading &&
          transactions.map((transaction) => (
            <Card
              key={transaction.id}
              transaction={transaction}
              mutate={mutate}
            />
          ))}
      </div>
      {!isLoading && transactions?.length === 0 && (
        <p className="text-2xl font-bold text-center w-full">
          No transaction history found.
        </p>
      )}
    </div>
  );
};
export default Cards;

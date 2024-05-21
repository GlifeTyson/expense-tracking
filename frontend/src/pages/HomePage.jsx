import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import {
  getTransactions,
  getTransactionStatistics,
} from "../graphql/queries/transaction.queries";
import { useContext, useEffect, useState } from "react";
import Auth from "../utils/auth.js";
import useSWR from "swr";
import { UserContext } from "../contexts/UserProvider.jsx";
import { fetcher } from "../services/fetcher.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { me } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });
  //TODO: fetch transaction base on user logged in
  const {
    data: transactionData,
    error: transactionError,
    isLoading: transactionLoading,
    isValidating: transactionValidating,
    mutate: mutateTransaction,
  } = useSWR([getTransactions, {}], fetcher);

  //TODO: fetch statistics
  const {
    data: statisticsData,
    error: errorStatistics,
    isLoading: loadingStatistics,
    isValidating: statisticsValidating,
    mutate: mutateStatistics,
  } = useSWR([getTransactionStatistics, {}], fetcher);

  //Setting background color and border color base on category
  //then set ChartData to loading data on UI
  useEffect(() => {
    if (transactionData) {
      setTransactions(transactionData.myTransactions);
      if (statisticsData) {
        const categories = statisticsData.categoryStatistics.map(
          (stat) => stat.category
        );
        const totalAmounts = statisticsData.categoryStatistics.map(
          (stat) => stat.totalAmount
        );
        const backgroundColors = [];
        const borderColors = [];
        categories.forEach((category) => {
          if (category === "expense") {
            backgroundColors.push("rgba(255, 99, 132)");
            borderColors.push("rgba(255, 99, 132)");
          } else if (category === "saving") {
            backgroundColors.push("rgba(75, 192, 192)");
            borderColors.push("rgba(75, 192, 192)");
          } else if (category === "invesment") {
            backgroundColors.push("rgba(54, 162, 235)");
            borderColors.push("rgba(54, 162, 235)");
          }
        });
        setChartData({
          labels: categories,
          datasets: [
            {
              label: "$",
              data: totalAmounts,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
              borderRadius: 30,
              spacing: 10,
              cutout: 130,
            },
          ],
        });
      }
    }
  }, [transactionData, statisticsData]);

  const handleLogout = () => {
    try {
      Auth.logout();
      if (Auth.check()) {
        setTimeout((_) => {
          location.href = "/login";
        }, 250);
      }
      toast.success("You have successfully logged out");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <img
            src={me?.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!transactionLoading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {transactionLoading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}

          {/* loading spinner */}
          {/* {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )} */}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {statisticsData?.categoryStatistics.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm
            mutate={mutateTransaction}
            mutateStatistics={mutateStatistics}
          />
        </div>
        <Cards
          transactions={transactions}
          isLoading={transactionLoading}
          mutate={mutateTransaction}
          mutateStatistics={mutateStatistics}
        />
      </div>
    </>
  );
};
export default HomePage;

import { Doughnut, Bar, Pie } from "react-chartjs-2";
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
import { Button } from "antd";
import { BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import Chart from "chart.js/auto";

// ChartJS.register(ArcElement, Tooltip, Legend);
// ChartJS.unregister(ArcElement,Tooltip,Legend);

Chart.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { me } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 10,
        spacing: 10,
        cutout: 130,
      },
    ],
  });
  const params = {
    filter: { userId: me.id },
    first: 50,
    skip: 0,
    orderBy: "createdAt_DESC",
  };
  //TODO: fetch transaction base on user logged in
  const {
    data: transactionData,
    error: transactionError,
    isLoading: transactionLoading,
    isValidating: transactionValidating,
    mutate: mutateTransaction,
  } = useSWR([getTransactions, params], fetcher);

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
        const categories = statisticsData.categoryStatistics.map((stat) =>
          stat.category.toUpperCase()
        );
        const totalAmounts = statisticsData.categoryStatistics.map(
          (stat) => stat.totalAmount
        );
        const backgroundColors = [];
        const borderColors = [];
        categories.forEach((category) => {
          if (category === "EXPENSE") {
            backgroundColors.push("rgba(255, 99, 132)");
            borderColors.push("rgba(255, 99, 132)");
          } else if (category === "SAVING") {
            backgroundColors.push("rgba(63, 195, 128)");
            borderColors.push("rgba(75, 192, 192)");
          } else if (category === "INVESTMENT") {
            backgroundColors.push("rgba(45, 85, 255)");
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
              borderRadius: 0,
              spacing: 0,
              cutout: 0,
              hoverOffset: 15,
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
  const optionsForBarChart = {
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Chart",
        font: {
          size: 20,
        },
        color: "white",
        position: "bottom",
      },
    },
  };
  const optionsForDoughnutChart = {
    // indexAxis: "y",
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pie Chart",
        font: {
          size: 20,
        },
        color: "white",
        position: "bottom",
      },
    },
  };
  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        {/* <Chart type="bar" data={data} options={options} /> */}
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
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {statisticsData?.categoryStatistics.length > 0 && (
            <div className="flex flex-col w-1/2 justify-center items-center gap-y-1">
              <p className="text-center">Select your chart to display</p>
              <div className="w-full flex justify-center gap-3">
                <Button
                  onClick={() => setChartType("doughnut")}
                  icon={<PieChartOutlined />}
                ></Button>
                <Button
                  onClick={() => setChartType("bar")}
                  icon={<BarChartOutlined />}
                ></Button>
              </div>

              <div className="h-[330px] w-[330px] md:h-[360px] md:w-[500px] flex flex-col items-center justify-center">
                {chartType === "doughnut" ? (
                  <>
                    <Pie data={chartData} options={optionsForDoughnutChart} />
                    {/* <p className="text-center">Doughnut chart</p> */}
                  </>
                ) : (
                  <>
                    <Bar data={chartData} options={optionsForBarChart} />
                    {/* <p className="text-center">Bar chart</p> */}
                  </>
                )}
              </div>
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

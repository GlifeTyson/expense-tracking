import Card from "./Card";
import { Button } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

const Cards = ({ transactions, isLoading, mutate, mutateStatistics }) => {
  const [filterByMonth, setFilterByMonth] = useState(false);
  const [filterByYear, setFilterByYear] = useState(false);
  const [data, setData] = useState({
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
  const [yearData, setYearData] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
        borderColor: "",
        fill: false,
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const summarize = (filterBy) => {
      if (transactions) {
        if (filterBy === "month") {
          //TODO: List by current month at the moment

          const currentDate = new Date();
          const categoryTotals = {};

          const month = currentDate.getUTCMonth() + 1;
          const year = currentDate.getUTCFullYear();

          transactions.forEach((transaction) => {
            const transactionDate = new Date(transaction?.date);
            const transactionMonth = transactionDate.getUTCMonth() + 1;
            const transactionYear = transactionDate.getUTCFullYear();
            if (transactionMonth === month && transactionYear === year) {
              const category = transaction.category;
              const amount = transaction.amount;
              if (categoryTotals[category]) {
                categoryTotals[category] += amount;
              } else {
                categoryTotals[category] = amount;
              }
            }
          });
          // console.log(categoryTotals);
          return categoryTotals;
        } else {
          const currentDate = new Date();
          const categoryTotals = {};
          const year = currentDate.getUTCFullYear();
          transactions.forEach((transaction) => {
            const transactionDate = new Date(transaction?.date);
            const month = transactionDate.getUTCMonth() + 1;
            const transactionYear = transactionDate.getUTCFullYear();
            if (transactionYear === year) {
              const category = transaction.category;
              const amount = transaction.amount;
              if (!categoryTotals[category]) {
                categoryTotals[category] = {};
              }

              if (!categoryTotals[category][month]) {
                categoryTotals[category][month] = 0;
              }

              categoryTotals[category][month] += amount;
            }
          });
          // console.log(categoryTotals);
          return categoryTotals;
        }
      }
    };
    const setChartData = (categoryTotals) => {
      const categories = [];
      const totalAmounts = [];
      const backgroundColor = [];
      const borderColor = [];

      Object.keys(categoryTotals).forEach((key) => {
        categories.push(key.toUpperCase());
        totalAmounts.push(categoryTotals[key]);
      });
      categories.forEach((category) => {
        if (category === "EXPENSE") {
          backgroundColor.push("rgba(255, 99, 132)");
          borderColor.push("rgba(255, 99, 132)");
        } else if (category === "SAVING") {
          backgroundColor.push("rgba(63, 195, 128)");
          borderColor.push("rgba(75, 192, 192)");
        } else if (category === "INVESTMENT") {
          backgroundColor.push("rgba(45, 85, 255)");
          borderColor.push("rgba(54, 162, 235)");
        }
      });

      setData({
        labels: categories,
        datasets: [
          {
            label: "$",
            data: totalAmounts,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 10,
            spacing: 10,
            cutout: 130,
          },
        ],
      });
    };
    const setYearChartData = (categoryTotals) => {
      if (transactions) {
        const months = [];

        const borderColorMap = {
          expense: "rgba(255, 99, 132)",
          saving: "rgba(63, 195, 128)",
          investment: "rgba(45, 85, 255)",
        };
        transactions.forEach((transaction) => {
          const month = new Date(transaction?.date).getUTCMonth() + 1;
          months.push(month);
        });

        const uniqueMonths = [...new Set(months)];
        uniqueMonths.sort((a, b) => a - b);

        const uniqueMonthArray = Array.from(uniqueMonths);
        const categories = Object.keys(categoryTotals);

        const datasets = categories.map((category, index) => {
          const data = uniqueMonthArray.map((month) => {
            return categoryTotals[category][month] || 0;
          });
          return {
            label: category,
            data: data,
            borderColor: borderColorMap[category],
            fill: true,
            tension: 0.3,
          };
        });
        const chartData = {
          labels: uniqueMonths,
          datasets: datasets,
        };

        console.log(chartData);
        return chartData;
      }
    };
    if (filterByMonth) {
      setChartData(summarize("month"));
    } else {
      const chartData = setYearChartData(summarize("year"));
      setYearData(chartData);
    }
  }, [filterByMonth, filterByYear, transactions]);

  const optionsForBarChart = {
    // indexAxis: "y",
    // responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Summary by month",
        font: {
          size: 20,
        },
        color: "white",
        position: "bottom",
      },
    },
  };
  const optionsForLineChart = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Summary by year",
        font: {
          size: 20,
        },
        color: "white",
        position: "bottom",
      },
    },
  };
  return (
    <div className="w-full px-10 min-h-[40vh]">
      <div className="flex flex-row items-center justify-between">
        <p className="text-2xl lg:text-5xl font-bold text-center my-10">
          History
        </p>
        {!isLoading && transactions.length > 0 && (
          <div>
            <p className="text-center">Summarize by</p>
            <div className="flex gap-2">
              <Button
                className="sm:w-fit lg:w-full"
                onClick={() => {
                  setFilterByMonth(!filterByMonth);
                  // setChartData(summarize("month"));
                }}
                icon={<BarChartOutlined />}
              >
                <span className="hidden">Month</span>
              </Button>
              <Button
                className="sm:w-fit lg:w-full"
                onClick={() => {
                  setFilterByYear(!filterByYear);
                  // const chartData = setYearChartData(summarize("year"));
                  // setYearData(chartData);
                }}
                icon={<BarChartOutlined />}
              >
                <span className="hidden">Year</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex overflow-x-auto justify-start mb-20 gap-4 whitespace-nowrap">
        {!isLoading &&
          transactions.map((transaction) => (
            <Card
              key={transaction.id}
              transaction={transaction}
              mutate={mutate}
              mutateStatistics={mutateStatistics}
            />
          ))}
      </div>
      {filterByMonth && transactions?.length > 0 && (
        <>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl lg:text-5xl font-bold text-center my-10">
              Summarize this month
            </p>
            <div className="md:h-[400px] md:w-[600px] lg:w-[800px] mb-20">
              <Bar data={data} options={optionsForBarChart} />
            </div>
          </div>
        </>
      )}
      {filterByYear && transactions?.length > 0 && (
        <>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl lg:text-5xl font-bold text-center my-10">
              Summarize this year
            </p>
            <div className="md:h-[400px] md:w-[600px] lg:w-[800px] mb-20">
              <Line data={yearData} options={optionsForLineChart} />
            </div>
          </div>
        </>
      )}
      {!isLoading && transactions?.length === 0 && (
        <p className="text-2xl font-bold text-center w-full">
          No transaction history found.
        </p>
      )}
    </div>
  );
};
export default Cards;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import css from "./Distribution.module.css";

import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip);

const Distribution = (props) => {
  const [chartData, setChartData] = useState();

  const colors = [];
  const labels = [];
  const percentages = [];

  const portfolioDistributionHandler = async () => {
    const recievedData = await props.getPortfolioDistribution();
    return recievedData;
  };

  const setDistributionData = async () => {
    const recievedData = await portfolioDistributionHandler();
    recievedData.forEach((item) => {
      labels.push(item.asset);
      percentages.push(item.percentage.toFixed(0));
    });

    setChartData({
      labels: labels,
      datasets: [
        {
          data: percentages,

          backgroundColor: () => {
            recievedData.forEach((item) => {
              colors.push(
                `#${Math.floor(Math.random() * 16777615).toString(16)}`
              );
            });
            return colors;
          },

          borderColor: colors,
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    setDistributionData();
  }, []);

  return (
    <div className={css.distribution_container}>
      {chartData ? (
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                enabled: true,

                //add percentage sign to tooltip data
                callbacks: { label: (context) => `${context.parsed}%` },
              },
            },
          }}
        />
      ) : null}
    </div>
  );
};
export default Distribution;

// const data = [ {asset: "BTC", percentage: 45} ]

// const [myChartData, setMyChartData] = useState({
//   type: "doughnut",
//   data: {
//     labels: (function () {
//       const labels = [];
//       data.forEach((item) => {
//         labels.push(item.asset);
//       });
//       return labels;
//     })(),
//     datasets: [
//       {
//         label: "Portfolio Distribution",
//         data: function () {
//           const data = [];
//           data.forEach((item) => {
//             data.push(item.percentage);
//           });
//           return data;
//         },
//         backgroundColor: function () {
//           const colors = [];
//           data.forEach((item) => {
//             colors.push(
//               `#${Math.floor(Math.random() * 16777215).toString(16)}`
//             );
//           });
//           return colors;
//         },
//         borderColor: function () {
//           const colors = [];
//           data.forEach((item) => {
//             colors.push(
//               `#${Math.floor(Math.random() * 16777215).toString(16)}`
//             );
//           });
//           return colors;
//         },
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     title: {
//       display: true,
//       text: "Portfolio Distribution",
//     },
//     animation: {
//       animateScale: true,
//       animateRotate: true,
//     },

//     legend: {
//       display: true,
//       position: "bottom",

//       labels: {
//         boxWidth: 10,
//         padding: 12,
//       },
//     },
//   },
// });

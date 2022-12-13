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

  const generateSteppeColors = (num) => {
    const starterColor = Math.floor(Math.random() * 360);
    for (let i = 0; i < num; i++) {
      colors.push(`hsl(${(i + starterColor) * (200 / num)}, 100%, 50%)`);
    }
    return colors;
  };

  const setDistributionData = async () => {
    const recievedData = await portfolioDistributionHandler();
    recievedData.forEach((item) => {
      labels.push(item.asset);
      percentages.push(item.percentage.toFixed(0));
      //sort percentages in descending order
      percentages.sort((a, b) => b - a);
    });
    generateSteppeColors(recievedData.length);

    setChartData({
      labels: labels,
      datasets: [
        {
          data: percentages,

          backgroundColor: colors,

          borderColor: "gray",
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

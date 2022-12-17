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
  const items = [];

  const portfolioDistributionHandler = async () => {
    const recievedData = await props.getPortfolioDistribution();
    return recievedData;
  };

  const generateSteppedColors = (num) => {
    const starterColor = [0, 255, 240];
    for (let i = 0; i < num; i++) {
      const color = `rgb(${starterColor[0]}, ${starterColor[1]}, ${starterColor[2]})`;
      colors.push(color);
      starterColor[0] += 25;
      starterColor[1] -= 50;
      starterColor[2] += 30;
    }
    return colors;
  };

  const setDistributionData = async () => {
    const recievedData = await portfolioDistributionHandler();
    recievedData.forEach((item) => {
      items.push([item.asset, item.percentage.toFixed(0)]);
    });
    //sort percentages in descending order
    items.sort((a, b) => b[1] - a[1]);
    items.forEach((item) => {
      labels.push(item[0]);
      percentages.push(item[1]);
    });
    generateSteppedColors(recievedData.length);

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

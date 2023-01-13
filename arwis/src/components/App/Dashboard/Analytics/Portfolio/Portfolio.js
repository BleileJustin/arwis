/* eslint-disable react-hooks/exhaustive-deps */
import PortfolioChart from "./PortfolioChart/PortfolioChart";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../../store/auth-context";

import css from "./Portfolio.module.css";

const Portfolio = () => {
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState();

  const getPortfolioChartData = async () => {
    const response = await fetch(`${authCtx.url}/api/portfolio-chart/`, {
      method: "POST",
      body: JSON.stringify({
        email: authCtx.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const recievedData = await response.json();
    setData(recievedData);
    return recievedData;
  };

  useEffect(() => {
    getPortfolioChartData();
    setInterval(() => {
      getPortfolioChartData();
    }, 60000); // 1 minute
  }, []);

  return (
    <div className={css.portfolio_container}>
      <PortfolioChart data={data}></PortfolioChart>
    </div>
  );
};

export default Portfolio;

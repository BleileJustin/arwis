import { useState, useEffect } from "react";
import css from "./PortfolioValue.module.css";

const PortfolioValue = (props) => {
  // CHANGE TO PROPS.CHILDREN
  const [portfolioValue, setPortfolioValue] = useState("...");
  const getPortfolioValue = async () => {
    return await props.getPortfolioValue();
  };
  const portfolioValueHandler = async () => {
    const portfolioValue = await getPortfolioValue();
    setPortfolioValue(portfolioValue.toFixed(2));
  };
  useEffect(() => {
    portfolioValueHandler();
    const interval = setInterval(() => {
      portfolioValueHandler();
    }, 10000 * 3); // 1000 = 1 second
    return () => clearInterval(interval);
  });

  console.log("PortfolioValue-12: ", portfolioValue);

  return (
    <h2
      className={css.portfolio_value_heading}
    >{`Portfolio Value: $${portfolioValue}`}</h2>
  );
};

export default PortfolioValue;

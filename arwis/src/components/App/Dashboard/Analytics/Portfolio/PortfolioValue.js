import { useState, useEffect } from "react";

const PortfolioValue = (props) => {
  // CHANGE TO PROPS.CHILDREN
  const [portfolioValue, setPortfolioValue] = useState("  . . .");

  const portfolioValueHandler = async () => {
    const portfolioValue = await props.getPortfolioValue();
    setPortfolioValue(portfolioValue.toFixed(2));
  };

  useEffect(() => {
    //startPortfolioValueDBRecord();
    portfolioValueHandler();
    const interval = setInterval(() => {
      portfolioValueHandler();
    }, 1000 * 60); // 1000 = 1 second
    return () => clearInterval(interval);
  });

  console.log("PortfolioValue-12: ", portfolioValue);

  return (
    <h2
      className={props.portfolioValueHeadingClass}
    >{`Portfolio Value: $${portfolioValue}`}</h2>
  );
};

export default PortfolioValue;

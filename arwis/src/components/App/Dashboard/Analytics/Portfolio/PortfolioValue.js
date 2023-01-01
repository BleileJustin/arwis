import { useState, useEffect } from "react";

const PortfolioValue = (props) => {
  // CHANGE TO PROPS.CHILDREN
  const [portfolioValue, setPortfolioValue] = useState("  . . .");

  const portfolioValueHandler = async () => {
    const portfolioValue = await props.getPortfolioValue();
    //Add commas to portfolio value
    const portfolioValueArray = portfolioValue.toFixed(2).toString().split("");
    const portfolioValueArrayLength = portfolioValueArray.length;
    let portfolioValueArrayIndex = portfolioValueArrayLength - 4;
    let portfolioValueArrayIndexCounter = 0;
    while (portfolioValueArrayIndex > 0) {
      portfolioValueArrayIndexCounter++;
      if (portfolioValueArrayIndexCounter === 3) {
        portfolioValueArray.splice(portfolioValueArrayIndex, 0, ",");
        portfolioValueArrayIndexCounter = 0;
      }
      portfolioValueArrayIndex--;
    }
    const portfolioValueWithCommas = portfolioValueArray.join("");
    setPortfolioValue(portfolioValueWithCommas);
  };

  useEffect(() => {
    //startPortfolioValueDBRecord();
    portfolioValueHandler();
    const interval = setInterval(() => {
      portfolioValueHandler();
    }, 1000 * 60); // 1000 = 1 second
    return () => clearInterval(interval);
  });

  return (
    <h2
      className={props.portfolioValueHeadingClass}
    >{`Portfolio Value: $${portfolioValue}`}</h2>
  );
};

export default PortfolioValue;

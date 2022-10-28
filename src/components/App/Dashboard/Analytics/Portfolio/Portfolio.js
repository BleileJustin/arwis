import PortfolioValue from "./PortfolioValue";
import PortfolioGraph from "./PortfolioGraph/PortfolioGraph";

import css from "./Portfolio.module.css";

const Portfolio = () => {
  return (
    <div className={css.portfolio_container}>
      <PortfolioValue></PortfolioValue>
      <PortfolioGraph></PortfolioGraph>
    </div>
  );
};

export default Portfolio;

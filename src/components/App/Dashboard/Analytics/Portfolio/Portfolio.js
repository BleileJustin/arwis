import PortfolioGraph from "./PortfolioGraph/PortfolioGraph";

import css from "./Portfolio.module.css";

const Portfolio = () => {
  return (
    <div className={css.portfolio_container}>
      <PortfolioGraph></PortfolioGraph>
    </div>
  );
};

export default Portfolio;

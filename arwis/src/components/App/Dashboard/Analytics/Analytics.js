import Portfolio from "./Portfolio/Portfolio";
import PortfolioValue from "./Portfolio/PortfolioValue";
import TradeList from "./TradeList/TradeList";
import Distribution from "./Distribution/Distribution";

import css from "./Analytics.module.css";
import Section from "../../../UI/Section/Section";
import BarContainer from "../../../UI/BarContainer/BarContainer";

import { useContext } from "react";
import AuthContext from "../../../../store/auth-context";

const Analytics = () => {
  const authCtx = useContext(AuthContext);
  const getPortfolioValue = async () => {
    const response = await fetch(`${authCtx.url}/api/portfolio-value/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authCtx.email,
      }),
    });
    const data = await response.json();

    return data.portfolioValue;
  };

  const getPortfolioDistribution = async () => {
    const response = await fetch(`${authCtx.url}/api/portfolio-distribution/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authCtx.email,
      }),
    });
    const data = await response.json();

    return data.portfolioDistribution;
  };

  return (
    <div className={css.analytics}>
      <BarContainer>
        <div className={css.analytics_bar_left_half_container}>
          <PortfolioValue
            getPortfolioValue={getPortfolioValue}
            portfolioValueHeadingClass={css.portfolio_value_heading}
          ></PortfolioValue>
        </div>
        <div className={css.analytics_bar_half_container}>
          <div className={css.analytics_bar_quarter_container_left}>
            <h2 className={css.quarter_widget_heading}>Distribution</h2>
          </div>
          <div className={css.analytics_bar_quarter_container_right}>
            <h2 className={css.quarter_widget_heading}>Trade List</h2>
          </div>
        </div>
      </BarContainer>

      <Section barIsExpanded={true}>
        <div className={css.analytics_left_half_container}>
          <Portfolio></Portfolio>
        </div>
        <div className={css.analytics_right_half_container}>
          <div className={css.analytics_quarter_container}>
            <Distribution
              getPortfolioDistribution={getPortfolioDistribution}
            ></Distribution>
          </div>
          <div
            className={css.analytics_quarter_container}
          >
            <TradeList></TradeList>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Analytics;

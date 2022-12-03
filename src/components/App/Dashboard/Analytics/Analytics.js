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
  console.log("ANALYTICS");
  const getPortfolioValue = async () => {
    console.log("GET PORTFOLIO VALUE");
    const response = await fetch(`${authCtx.url}/api/portfolio-value`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: "justinxbleile@gmail.com",
      }),
    });
    const data = await response.json();
    console.log(data);
    return data.portfolioValue;
  };

  return (
    <>
      <BarContainer>
        <PortfolioValue getPortfolioValue={getPortfolioValue}></PortfolioValue>
      </BarContainer>
      <Section barIsExpanded={true}>
        <Portfolio></Portfolio>
        <div className={css.analytics_right_half_container}>
          <TradeList></TradeList>
          <Distribution></Distribution>
        </div>
      </Section>
    </>
  );
};

export default Analytics;

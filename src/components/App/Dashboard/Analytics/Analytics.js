import Portfolio from "./Portfolio/Portfolio";
import TradeList from "./TradeList/TradeList";
import Distribution from "./Distribution/Distribution";

import css from "./Analytics.module.css";
import Section from "../../../UI/Section/Section";
import BarContainer from "../../../UI/BarContainer/BarContainer";

//import Bar from "../Wallets/Bar/Bar";

const Analytics = () => {
  return (
    <>
      <BarContainer></BarContainer>
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

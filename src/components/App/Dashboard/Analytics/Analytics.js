import Portfolio from "./Portfolio/Portfolio";
import TradeList from "./TradeList/TradeList";
import Distribution from "./Distribution/Distribution";

import css from "./Analytics.module.css";

const Analytics = () => {
  return (
    <div className={css.analytics}>
      <Portfolio></Portfolio>
      <div className={css.analytics_right_half_container}>
        <TradeList></TradeList>
        <Distribution></Distribution>
      </div>
    </div>
  );
};

export default Analytics;

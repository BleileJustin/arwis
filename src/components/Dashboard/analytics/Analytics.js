import Portfolio from "./Portfolio/Portfolio";
import TradeList from "./TradeList/TradeList";
import Distribution from "./Distribution/Distribution";

import css from './Analytics.module.css'

const Analytics = () => {
  return (
    <div className={css.analytics}>
      <Portfolio></Portfolio>
      <TradeList></TradeList>
      <Distribution></Distribution>
    </div>
  );
};

export default Analytics;

import Analytics from "./Analytics/Analytics";
import Wallets from "./Wallets/Wallets";

import css from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={css.dashboard}>
      <Analytics></Analytics>
      <Wallets></Wallets>
    </div>
  );
};

export default Dashboard;

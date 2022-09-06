import Analytics from "./Analytics/Analytics";
import Algorithms from "./Algorithms/Algorithms";

import css from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={css.dashboard}>
      <Analytics></Analytics>
      <Algorithms></Algorithms>
    </div>
  );
};

export default Dashboard;

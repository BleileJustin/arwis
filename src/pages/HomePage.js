import css from "./HomePage.module.css";

import Background from "../components/App/Background/Background";
import Navigation from "../components/App/Navigation/Navigation";
import Dashboard from "../components/App/Dashboard/Dashboard";

const HomePage = () => {
  return (
    <div className={css.home}>
      <Background />
      <Navigation />
      <Dashboard />
    </div>
  );
};

export default HomePage;

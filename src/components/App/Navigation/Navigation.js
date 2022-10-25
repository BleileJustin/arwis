import css from "./Navigation.module.css";
import logo from "../../../assets/logos/logo.png";

const Navigation = () => {
  return (
    <div className={css.navigation}>
      <img src={logo} alt="logo" className={css.logo}></img>
    </div>
  );
};

export default Navigation;

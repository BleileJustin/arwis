import css from "./Navigation.module.css";
import logo from "../../../assets/logos/logo.png";
import AuthContext from "../../../store/auth-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={css.navigation}>
      <img src={logo} alt="logo" className={css.logo}></img>
      <div className={css.nav_button_container}>
        <button className={css.nav_button} onClick={() => navigate("/")}>
          Home
        </button>
        <button className={css.nav_button} onClick={() => navigate("/profile")}>
          Profile
        </button>
      </div>
      <button className={css.nav_button} onClick={() => authCtx.logout()}>
        Log Out
      </button>
    </div>
  );
};

export default Navigation;

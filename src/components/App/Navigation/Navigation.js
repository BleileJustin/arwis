import css from "./Navigation.module.css";
import logo from "../../../assets/logos/logo.png";
import AuthContext from "../../../store/auth-context";
import { useContext } from "react";

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <div className={css.navigation}>
      <img src={logo} alt="logo" className={css.logo}></img>
      <button onClick={logoutHandler}>Log Out</button>
    </div>
  );
};

export default Navigation;

import css from "./Navigation.module.css";
import logo from "../../../assets/logos/logo.png";
import AuthContext from "../../../store/auth-context";
import { useContext } from "react";

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    authCtx.logout();
  };

  const testRead = async () => {
    //let userID = await prompt("Enter userid");
    let userID = "arwisdemo";
    const response = await fetch(`http://localhost:80/read/${userID}`);
    const data = await response.json();
    let count = data.count;
    console.log(count);
  };

  const testWrite = async () => {
    let userID = await prompt("Enter userid");
    const response = await fetch(`http://localhost:80/write/${userID}`);
    const data = await response.json();
    let count = data.count;
    console.log(count);
  };
  const testInstance = async () => {
    let userID = await prompt("Enter userid");
    const response = await fetch(`http://localhost:80/instance/${userID}`);
    const data = await response.text();
    console.log(data);
  };

  const testCount = async () => {
    let userID = await prompt("Enter userid");
    await fetch(
      // "https://us-central1-arwis1.cloudfunctions.net/app/count"
      `http://localhost:80/count/${userID}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          console.log("Error");
          console.log(res.json());
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className={css.navigation}>
      <img src={logo} alt="logo" className={css.logo}></img>
      <div className={css.test_button_container}>
        <button className={css.nav_button} onClick={testRead}>
          Test Read
        </button>
        <button className={css.nav_button} onClick={testWrite}>
          Test Write
        </button>
        <button className={css.nav_button} onClick={testCount}>
          Test Count
        </button>
        <button className={css.nav_button} onClick={testInstance}>
          Test Instance
        </button>
      </div>
      <button className={css.nav_button} onClick={logoutHandler}>
        Log Out
      </button>
    </div>
  );
};

export default Navigation;

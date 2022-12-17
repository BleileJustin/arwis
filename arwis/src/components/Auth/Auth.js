import Background from "../App/Background/Background";
import AuthForm from "./AuthForm/AuthForm";

import css from "./Auth.module.css";

const Auth = () => {
  return (
    <div className={css.login}>
      <Background />
      <div className={css.login_content}>
        <div>
          <div className={css.heading_container}>
            <h1 className={css.logo_heading}>A</h1>
            <h1 className={css.login_heading}>RWIS</h1>
          </div>
          <h4 className={css.sub_heading}>
            A cryptocurrency
            <br />
            trading bot
          </h4>
        </div>
        <AuthForm></AuthForm>
        <div>
          <h4 className={css.sub_heading} style={{ marginTop: "2%" }}>
            Built with <br />
            <a style={{ color: "#61DBFB" }} href="https://reactjs.org">
              ReactJS
            </a>
            ,{" "}
            <a style={{ color: "#3c873a" }} href="https://nodejs.org/">
              NodeJS
            </a>
            ,{" "}
            <a style={{ color: "black" }} href="https://expressjs.com/">
              Express
            </a>
            ,{" "}
            <a style={{ color: "#4db33d" }} href="https://mongodb.com/">
              MongoDB
            </a>
            ,{" "}
            <a style={{ color: "#da4dff" }} href="https://railway.app/">
              Railway
            </a>
            <br />
            <br />
            View source code on <br />
            <a
              style={{ color: "black" }}
              href="https://github.com/bleilejustin/arwis"
            >
              Github
            </a>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Auth;

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
      </div>
    </div>
  );
};

export default Auth;

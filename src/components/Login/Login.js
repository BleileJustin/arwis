import Background from "../App/Background/Background";
import LoginForm from "./LoginForm/LoginForm";

import css from "./Login.module.css";

const Login = () => {
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
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default Login;

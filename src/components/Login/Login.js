import Background from "../../src/components/Background/Background";
import LoginForm from "./LoginForm/LoginForm";

import css from "./Login.module.css";

const Login = () => {
  return (
    <div>
      <Background />
      <LoginForm className={css.login}></LoginForm>
    </div>
  );
};

export default Login;

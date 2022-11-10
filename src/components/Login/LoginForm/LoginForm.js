import { useState } from "react";
import css from "./LoginForm.module.css";

const LoginForm = (props) => {
  const [loginFormState, setLoginFormState] = useState({
    username: null,
    password: null,
    apikey: null,
  });

  const submitForm = (event) => {
    event.preventDefault();
    console.log("Submit");
    loginFormState.username && loginFormState.password
      ? props.onLoginSubmit(loginFormState)
      : alert("Invalid Input");
  };

  return (
    <div className={css.login_form_container}>
      <h1 className={css.title}>Sign Up/Log In</h1>
      <hr className={css.break_line}></hr>
      <form className={css.login_form} onSubmit={submitForm}>
        <input
          placeholder="Username"
          className={css.text_input_field}
          type="text"
          onChange={(e) =>
            setLoginFormState({ ...loginFormState, username: e.target.value })
          }
        ></input>

        <input
          placeholder="Password"
          className={css.text_input_field}
          type="password"
          onChange={(e) =>
            setLoginFormState({ ...loginFormState, password: e.target.value })
          }
        ></input>

        <input
          placeholder="API Key"
          className={css.text_input_field}
          type="text"
          onChange={(e) =>
            setLoginFormState({ ...loginFormState, apikey: e.target.value })
          }
        ></input>
        <button className={css.submit_button} type="submit" value="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

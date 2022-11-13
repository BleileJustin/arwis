import { useRef, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import css from "./Login.module.css";

const Login = (props) => {
  const navigate = useNavigate();
  const [loginFormState, setSignupFormState] = useState({
    email: null,
    password: null,
    apikey: null,
  });

  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitForm = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    fetch(props.url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken);
        navigate("/", { replace: true });
      });
  };

  return (
    <div className={css.login_form_container}>
      <h1 className={css.title}>Log In</h1>
      <hr className={css.break_line}></hr>
      <form className={css.login_form} onSubmit={submitForm}>
        <input
          placeholder="Email"
          className={css.text_input_field}
          type="text"
          ref={emailInputRef}
          onChange={(e) =>
            setSignupFormState({ ...loginFormState, email: e.target.value })
          }
        ></input>

        <input
          placeholder="Password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
          onChange={(e) =>
            setSignupFormState({ ...loginFormState, password: e.target.value })
          }
        ></input>

        <button className={css.submit_button} type="submit" value="submit">
          Submit
        </button>
      </form>
      <button
        className={css.switch_to_login_button}
        onClick={props.switchToSignup}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Login;

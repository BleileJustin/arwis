import css from "./AuthForm.module.css";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config/config";

import AuthContext from "../../../store/auth-context";

const Auth = (props) => {
  const navigate = useNavigate();
  const [authFormState, setAuthFormState] = useState({
    email: null,
    password: null,
    apikey: null,
  });
  const [isSignup, setIsSignup] = useState(false);
  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const apiKeyInputRef = useRef();

  const toggleSignupVsLogin = () => {
    setIsSignup((current) => !current);
  };

  const authFormValidation = () => {};

  const submitForm = (event) => {
    event.preventDefault();

    let url;

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredApiKey = apiKeyInputRef.current.value;

    if (isSignup) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.APIKEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.APIKEY}`;
    }
    if (enteredPassword.length > 7) {
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          apiKey: enteredApiKey,
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
              console.log(data);
            });
          }
        })
        .then((data) => {
          authCtx.login(data.idToken);
          navigate("/", { replace: true });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("Password must be 8+ characters");
    }

    console.log("Submit");
  };

  const signUpForm = (
    <div className={css.auth_form_container}>
      <h1 className={css.title}>Sign Up</h1>
      <hr className={css.break_line}></hr>
      <form className={css.auth_form} onSubmit={submitForm}>
        <input
          placeholder="Email"
          className={css.text_input_field}
          type="text"
          ref={emailInputRef}
          onChange={(e) =>
            setAuthFormState({ ...authFormState, email: e.target.value })
          }
        ></input>

        <input
          placeholder="Password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
          onChange={(e) =>
            setAuthFormState({ ...authFormState, password: e.target.value })
          }
        ></input>

        <input
          placeholder="API Key"
          className={css.text_input_field}
          type="text"
          ref={apiKeyInputRef}
          onChange={(e) =>
            setAuthFormState({ ...authFormState, apikey: e.target.value })
          }
        ></input>
        <button className={css.submit_button} type="submit" value="submit">
          Submit
        </button>
      </form>
      <button className={css.login_signup_toggle} onClick={toggleSignupVsLogin}>
        Login
      </button>
    </div>
  );

  const logInForm = (
    <div className={css.auth_form_container}>
      <h1 className={css.title}>Log In</h1>
      <hr className={css.break_line}></hr>
      <form className={css.auth_form} onSubmit={submitForm}>
        <input
          placeholder="Email"
          className={css.text_input_field}
          type="text"
          ref={emailInputRef}
          onChange={(e) =>
            setAuthFormState({ ...authFormState, email: e.target.value })
          }
        ></input>

        <input
          placeholder="Password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
          onChange={(e) =>
            setAuthFormState({ ...authFormState, password: e.target.value })
          }
        ></input>

        <button className={css.submit_button} type="submit" value="submit">
          Submit
        </button>
      </form>
      <button className={css.login_signup_toggle} onClick={toggleSignupVsLogin}>
        Sign Up
      </button>
    </div>
  );

  return isSignup ? signUpForm : logInForm;
};

export default Auth;

import css from "./Signup.module.css";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";

const Signup = (props) => {
  const navigate = useNavigate();
  const [signupFormState, setSignupFormState] = useState({
    username: null,
    password: null,
    apikey: null,
  });

  const authCtx = useContext(AuthContext);
  const userNameInputRef = useRef();
  const passwordInputRef = useRef();
  const apiKeyInputRef = useRef();

  const submitForm = (event) => {
    event.preventDefault();

    const enteredUsername = userNameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredApiKey = apiKeyInputRef.current.value;

    fetch(props.url, {
      method: "POST",
      body: JSON.stringify({
        username: enteredUsername,
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
          return res.json;
        } else {
          return res.json().then((data) => {
            let errorMessage = "Sign Up Failed";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken);
        navigate.replaceState("/");
      });

    console.log("Submit");
  };
  return (
    <div className={css.login_form_container}>
      <h1 className={css.title}>Sign Up</h1>
      <hr className={css.break_line}></hr>
      <form className={css.login_form} onSubmit={submitForm}>
        <input
          placeholder="Username"
          className={css.text_input_field}
          type="text"
          ref={userNameInputRef}
          onChange={(e) =>
            setSignupFormState({ ...signupFormState, username: e.target.value })
          }
        ></input>

        <input
          placeholder="Password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
          onChange={(e) =>
            setSignupFormState({ ...signupFormState, password: e.target.value })
          }
        ></input>

        <input
          placeholder="API Key"
          className={css.text_input_field}
          type="text"
          ref={apiKeyInputRef}
          onChange={(e) =>
            setSignupFormState({ ...signupFormState, apikey: e.target.value })
          }
        ></input>
        <button className={css.submit_button} type="submit" value="submit">
          Submit
        </button>
      </form>
      <button
        className={css.switch_to_login_button}
        onClick={props.switchToLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Signup;

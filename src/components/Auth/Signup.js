import css from "./Signup.module.css";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";

const Signup = (props) => {
  const navigate = useNavigate();
  const [signupFormState, setSignupFormState] = useState({
    email: null,
    password: null,
    apikey: null,
  });

  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const apiKeyInputRef = useRef();

  const submitForm = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredApiKey = apiKeyInputRef.current.value;

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

    console.log("Submit");
  };
  return (
    <div className={css.login_form_container}>
      <h1 className={css.title}>Sign Up</h1>
      <hr className={css.break_line}></hr>
      <form className={css.login_form} onSubmit={submitForm}>
        <input
          placeholder="Email"
          className={css.text_input_field}
          type="text"
          ref={emailInputRef}
          onChange={(e) =>
            setSignupFormState({ ...signupFormState, email: e.target.value })
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

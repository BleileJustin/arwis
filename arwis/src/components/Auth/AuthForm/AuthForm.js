import css from "./AuthForm.module.css";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import encryptKey from "../../../utils/encrypt-key.js";

import AuthContext from "../../../store/auth-context";

const Auth = (props) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const apiKeyInputRef = useRef();
  const apiSecretInputRef = useRef();

  const toggleSignupVsLogin = () => {
    setIsSignup((current) => !current);
  };

  const apiKeyHandler = async (enteredEmail) => {
    const enteredApiKey = apiKeyInputRef.current.value;
    const enteredApiSecret = apiSecretInputRef.current.value;
    //ENCRYPT AND SEND APIKEY AND APISECRET TO SERVER
    const getPublicKey = await fetch(`${authCtx.url}/api/client-public-key/`, {
      method: "POST",
    }).catch((err) => {
      console.log(err);
    });
    const publicKeyData = await getPublicKey.json();
    const publicKey = publicKeyData.publicKey;

    const encryptedApiKey = encryptKey(enteredApiKey, publicKey);
    const encryptedApiSecret = encryptKey(enteredApiSecret, publicKey);
    const sendEncryptedApiKey = await fetch(
      `${authCtx.url}/api/encrypt-api-key/`,
      {
        method: "POST",
        body: JSON.stringify({
          encryptedApiKey: encryptedApiKey,
          encryptedApiSecret: encryptedApiSecret,
          email: enteredEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((err) => {
      console.log(err);
    });

    await sendEncryptedApiKey.text();
  };
  const startPortfolioValueDBRecord = async (email) => {
    await fetch(`${authCtx.url}/api/set-portfolio-value`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
  };

  //const authFormValidation = () => {};

  const submitForm = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let url;

    //AUTHENTICATION FOR SIGNUP AND LOGIN
    if (isSignup) {
      await apiKeyHandler(enteredEmail);
      await startPortfolioValueDBRecord(enteredEmail);
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_APIKEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_APIKEY}`;
    }

    const sendCred = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await sendCred.json();
    if (sendCred.ok) {
      authCtx.login(data.idToken, enteredEmail);
      navigate("/", { replace: true });
    } else {
      alert(data.error.message);
    }
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
        ></input>

        <input
          placeholder="Password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
        ></input>

        <input
          placeholder="API Key"
          className={css.text_input_field}
          type="password"
          ref={apiKeyInputRef}
        ></input>

        <input
          placeholder="API Secret"
          className={css.text_input_field}
          type="password"
          ref={apiSecretInputRef}
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
        <div
          className={css.text_input_field}
          style={{ background: "transparent" }}
        ></div>
        <input
          placeholder="Demo Email: arwisdemo@gmail.com"
          className={css.text_input_field}
          type="Email"
          ref={emailInputRef}
        ></input>

        <input
          placeholder="Demo Password: password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
        ></input>
        <div
          className={css.text_input_field}
          style={{ background: "transparent" }}
        ></div>
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

import css from "./AuthForm.module.css";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config/config";
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
    const publicKeyPromise = await fetch(
      `https://us-central1-arwisv1.cloudfunctions.net/app/api/client-public-key/`,
      {
        method: "POST",
      }
    );
    //const publicKeyPromise = await fetch("http://localhost:80/api/client-public-key");
    const publicKeyData = await publicKeyPromise.json();
    const publicKey = publicKeyData.publicKey;

    const encryptedApiKey = encryptKey(enteredApiKey, publicKey);
    const encryptedApiSecret = encryptKey(enteredApiSecret, publicKey);
    const encryptedApiKeyPromise = await fetch(
      `https://us-central1-arwisv1.cloudfunctions.net/app/api/encrypt-api-key/`,
      //"http://localhost:80/api/encrypted-api-key",
      {
        method: "POST",
        body: JSON.stringify({
          encryptedApiKey: encryptedApiKey,
          encryptedApiSecret: encryptedApiSecret,
          uid: enteredEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const promiseStatus = await encryptedApiKeyPromise.text();
    console.log(`Encrypt key: ${promiseStatus}`);
  };

  //const authFormValidation = () => {};

  const submitForm = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let url;

    //AUTHENTICATION FOR SIGNUP AND LOGIN
    if (isSignup) {
      apiKeyHandler(enteredEmail);
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.APIKEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.APIKEY}`;
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
      authCtx.login(data.idToken);
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
        <input
          placeholder="Demo Email: arwisdemo@gmail.com"
          className={css.text_input_field}
          type="text"
          ref={emailInputRef}
        ></input>

        <input
          placeholder="Demo Password: password"
          className={css.text_input_field}
          type="password"
          ref={passwordInputRef}
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

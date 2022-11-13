import { useState } from "react";
import Login from "../Login";
import Signup from "../Signup";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true);

  const signUpVsLogIn = () => {
    setIsSignup((current) => !current);
  };

  let url;
  let jsx;

  if (isSignup) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]";
    jsx = <Signup url={url} switchToLogin={signUpVsLogIn}></Signup>;
  } else {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]";
    jsx = <Login url={url} switchToSignup={signUpVsLogIn}></Login>;
  }

  return jsx;
};

export default AuthForm;

import { useState } from "react";
import Login from "../Login";
import Signup from "../Signup";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);

  const signUpVsLogIn = () => {
    setIsSignup((current) => !current);
  };

  let url;
  let jsx;

  if (isSignup) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCTXSnYN9vcdlcltoZ7ucz8S7Sii8iV33E";
    jsx = <Signup url={url} switchToLogin={signUpVsLogIn}></Signup>;
  } else {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCTXSnYN9vcdlcltoZ7ucz8S7Sii8iV33E";
    jsx = <Login url={url} switchToSignup={signUpVsLogIn}></Login>;
  }

  return jsx;
};

export default AuthForm;

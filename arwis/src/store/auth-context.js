import React, { useCallback, useState } from "react";

const AuthContext = React.createContext({
  url: "",
  email: "",
  setEmail: (email) => {},
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const retrieveToken = () => {
  const storedToken = localStorage.getItem("token");

  return {
    token: storedToken,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveToken();
  //const userEmail = retrieveEmail();

  let initalToken;
  if (tokenData) {
    initalToken = tokenData.token;
  }
  const [token, setToken] = useState(initalToken);
  const [email, setEmail] = useState("");

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const emailHandler = (email) => {
    setEmail(email);
  };

  const contextValue = {
    // url: "http://localhost:5001",
    url: "https://arwis-server.up.railway.app",

    email: email,
    setEmail: emailHandler,
    token: tokenData,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

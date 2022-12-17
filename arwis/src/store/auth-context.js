import React, { useCallback, useState } from "react";

const AuthContext = React.createContext({
  url: "",
  email: "",
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const retrieveToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedEmail = localStorage.getItem("email");
  return {
    token: storedToken,
    email: storedEmail,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveToken();

  let initalToken;
  let initialEmail;
  if (tokenData) {
    initalToken = tokenData.token;
    initialEmail = tokenData.email;
  }

  const [token, setToken] = useState(initalToken);
  const [email, setEmail] = useState(initialEmail);
  const userIsLoggedIn = !!token && !!email;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }, []);

  const loginHandler = (token, email) => {
    setToken(token);
    setEmail(email);
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  };

  const contextValue = {
    // url: "http://localhost:5001",
    url: "https://arwis-server.up.railway.app",

    email: tokenData.email,
    token: tokenData.token,
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

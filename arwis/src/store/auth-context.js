import React, { useCallback, useState } from "react";

const AuthContext = React.createContext({
  token: "",
  uid: "",
  isLoggedIn: false,
  setUserId: (uid) => {},
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

  let initalToken;
  if (tokenData) {
    initalToken = tokenData.token;
  }

  const [token, setToken] = useState(initalToken);
  const [uid, setUid] = useState("");

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  const loginHandler = (token, uid) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const setUserIdHandler = (uid) => {
    setUid(uid);
    localStorage.setItem("uid", uid);
  };

  const contextValue = {
    token: tokenData,
    uid: uid,
    isLoggedIn: userIsLoggedIn,
    setUserId: setUserIdHandler,
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

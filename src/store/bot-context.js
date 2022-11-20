import React, { useState } from "react";

const BotContext = React.createContext({
  user: {
    email: "",
    activeWallets: {},
  },
});

export const BotContextProvider = (props) => {
  const [userData, setUserData] = useState({});

  const addBarHandlerContext = (userEmail) => {
    setUserData({ ...userData, email: userEmail });
  };

  //   const contextValue = {
  //     user: {
  //       email: email,
  //       activeWallets: [],
  //     },
  //   };

  return (
    <BotContext.Provider value={userData} addBarContext={addBarHandlerContext}>
      {props.children}
    </BotContext.Provider>
  );
};

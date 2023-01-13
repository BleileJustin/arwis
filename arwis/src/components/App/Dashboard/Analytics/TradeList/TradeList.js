//import React, { useState, useEffect, useContext } from "react";
//import AuthContext from "../../../../../store/auth-context";

const TradeList = () => {
  // const authCtx = useContext(AuthContext);
  // const [trades, setTrades] = useState([]);

  // useEffect(() => {
  //   // fetch data
  //   const tradeDomHandler = async () => {
  //     const fetchTrades = async () => {
  //       try {
  //         const response = await fetch(`${authCtx.url}/api/tradelist/`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             email: authCtx.email,
  //           }),
  //         });
  //         const data = await response.json();
  //         return data;
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };
  //     const fetchedTrades = await fetchTrades();
  //     console.log(fetchedTrades);
  //     const tradesDom = fetchedTrades.map((trade) => {
  //       return (
  //         <div>
  //           <p>{trade}</p>
  //         </div>
  //       );
  //     });
  //     setTrades(tradesDom);
  //   };
  //   tradeDomHandler();
  // }, [authCtx.email, authCtx.url]);

  //return <div>{trades}</div>;
  return <div></div>;
};

export default TradeList;

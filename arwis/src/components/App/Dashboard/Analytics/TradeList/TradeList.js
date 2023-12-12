import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../../../../store/auth-context";

import css from "./TradeList.module.css";

const TradeList = () => {
  const authCtx = useContext(AuthContext);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // fetch data
    const tradeDomHandler = async () => {
      const fetchTrades = async () => {
        try {
          const response = await fetch(`${authCtx.url}/api/tradelist/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: authCtx.email,
            }),
          });
          const data = await response.json();
          return data;
        } catch (e) {
          console.log(e);
        }
      };
      const fetchedTrades = await fetchTrades();
      setTrades([]);
      fetchedTrades.forEach((trade) => {
        ////// Time Formatting //////
        let time = new Date(trade.timestamp);
        const offset = new Date().getTimezoneOffset();
        const offsetMs = offset * 60 * 1000;
        if (time.getTimezoneOffset() > 0) {
          time = new Date(time + offsetMs);
        } else {
          time = new Date(time - offsetMs);
        }
        time = time.toString();
        time = time.slice(16, 21);
        if (time.slice(0, 2) > 12) {
          time = `${time.slice(0, 2) - 12}${time.slice(2, 5)} PM`;
        } else {
          time = `${time} AM`;
        }

        trade.time = time;
        ////// Color Formatting //////
        let color;
        if (trade.side === "buy") {
          trade.side = "Buy";
          color = "rgb(5, 255, 0)";
        } else {
          trade.side = "Sell";
          color = "rgb(225, 50, 85)";
        }
        ////// Symbol Formatting //////

        trade.symbol = trade.symbol.slice(0, -5);

        const tradeDom = (
          <div
            key={trade.timestamp + Math.random()}
            className={css.trade}
            style={{ color: [color] }}
          >
            <h3 className={css.item}>{trade.side}</h3>
            <h3
              className={css.item}
              style={{ width: "15%", textAlign: "right" }}
            >
              {trade.symbol}
            </h3>
            <h3
              className={css.item}
              style={{ width: "35%", textAlign: "right" }}
            >
              {trade.amount + " " + trade.symbol}
            </h3>
            <h3
              className={css.item}
              style={{ width: "30%", textAlign: "right", paddingRight: "1rem" }}
            >
              {trade.time}
            </h3>
          </div>
        );
        setTrades((prevTrades) => {
          return [...prevTrades, tradeDom];
        });
      });
    };

    tradeDomHandler();
    setInterval(() => {
      tradeDomHandler();
    }, 15000); // 10 seconds
  }, [authCtx.email, authCtx.url]);

  return (
    <div className={css.tradeListContainer}>
      <div className={css.tradesList}>{trades}</div>
    </div>
  );
};

export default TradeList;

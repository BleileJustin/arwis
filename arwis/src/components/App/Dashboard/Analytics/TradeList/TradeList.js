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
      console.log(fetchedTrades);
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
        console.log(time);

        trade.time = time;
        ////// Color Formatting //////
        let color;
        if (trade.side === "buy") {
          trade.side = "Buy";
          color = "green";
        } else {
          trade.side = "Sell";
          color = "red";
        }
        ////// Symbol Formatting //////

        trade.symbol = trade.symbol.slice(0, -5);

        const tradeDom = (
          <div
            key={trade.timestamp}
            className={css.trade}
            style={{ color: [color] }}
          >
            <h3 className={css.item}>{trade.side}</h3>
            <h3 className={css.item}>{trade.symbol}</h3>
            <h3 className={css.item}>{trade.amount + " " + trade.symbol}</h3>
            <h3 className={css.item} style={{ width: "28%" }}>
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
  }, [authCtx.email, authCtx.url]);

  return <div className={css.tradesList}>{trades}</div>;
};

export default TradeList;

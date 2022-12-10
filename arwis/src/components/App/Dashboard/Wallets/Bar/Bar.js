/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useLayoutEffect, useRef } from "react";

import css from "./Bar.module.css";
import BarForm from "./BarForm/BarForm";
import Algorithms from "./Algorithms/Algorithms";
import Section from "../../../../UI/Section/Section";
import BarContainer from "../../../../UI/BarContainer/BarContainer";
import WalletChart from "./WalletChart/WalletChart";
import Graph from "../../../../UI/Graph/Graph";

import AuthContext from "../../../../../store/auth-context";

const Bar = (props) => {
  const [barJSX, setBarJSX] = useState();
  const [barExpanded, setBarExpanded] = useState(false);
  const [candles, setCandles] = useState();
  const [intervalAndCurPairState, setIntervalAndCurPairState] = useState({
    candleIntervale: "1h",
    curPairState: "",
    dropdwonIsEnabled: true,
  });
  const isFirstRender = useRef(true);

  const authCtx = useContext(AuthContext);
  const url = authCtx.url;

  const id = props.id;

  console.log("PROPS");
  console.log(props);
  console.log("PROPS END");

  //DELETE BAR
  const deleteBar = () => {
    props.onDeleteBar(id);
  };

  //GET TICKER PRICE
  const getTickerData = async (ticker) => {
    const tickerData = await ticker.json();
    const lastPrice = tickerData.last;
    const lastPercent = tickerData.info.priceChangePercent;
    return { lastPrice: lastPrice, lastPercent: lastPercent };
  };

  //GET WALLET DATA
  const getWalletBalance = async (walletData) => {
    const walletDataJSON = await walletData.json();
    const balance = walletDataJSON.walletBalance;
    const balanceToUsd = walletDataJSON.walletBalanceToUsd;
    return { balance: balance, balanceToUsd: balanceToUsd };
  };
  //GET CANDLESTICK DATA
  const getCandlestickData = async (curPair, interval) => {
    const candles = await fetch(`${url}/api/binance/candles/`, {
      method: "POST",
      body: JSON.stringify({
        interval: interval,
        curPair: curPair,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("CANDLES");
    const candlesJSON = await candles.json();
    setCandles(candlesJSON.candles);
  };

  // CONNECT WALLET FROM DB

  //ON CONNECT
  const onConnect = async (curPair) => {
    if (!props.isFromDB) {
      await fetch(`${url}/api/set-wallet/`, {
        method: "POST",
        body: JSON.stringify({
          email: authCtx.email,
          wallet: { curPair: curPair },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("SET WALLET");
    }

    setIntervalAndCurPairState({
      candleInterval: "1h",
      curPairState: curPair,
      dropdwonIsEnabled: false,
    });

    //Get list of current wallets
    const walletList = props.getWalletList(curPair);
    let isDuplicate = false;

    walletList.forEach((wallet) => {
      wallet.curPair === curPair || isDuplicate
        ? (isDuplicate = true)
        : (isDuplicate = false);
    });

    //if curPair exists and does not equal select and isDuplicate returns false
    if ((curPair && curPair !== "select" && !isDuplicate) || props.isFromDB) {
      props.setWalletCurPair(curPair);
      const ticker = await fetch(`${url}/api/binance/${curPair}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("TICKER");
      const tickerData = await getTickerData(ticker);
      const lastPrice = tickerData.lastPrice;
      const lastPercent = tickerData.lastPercent;
      const priceString = lastPrice.toString();
      const percentColor =
        lastPercent.charAt(0) === "-" ? "rgb(225, 50, 85)" : "rgb(5, 255, 0)";

      await getCandlestickData(curPair, intervalAndCurPairState.candleInterval);
      const currency = curPair.replace("USDT", "");

      const walletData = await fetch(`${url}/api/wallet/`, {
        method: "POST",
        body: JSON.stringify({
          currency: currency,
          uid: "justinxbleile@gmail.com",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const walletBalance = await getWalletBalance(walletData);
      const balance = walletBalance.balance;
      const balanceToUsd = walletBalance.balanceToUsd;
      console.log("BALANCE");

      setBarJSX(
        <BarContainer isWalletBar={true}>
          <button className={css.delete_bar} onClick={deleteBar}></button>

          <div className={css.cur_pair_container}>
            <h2 className={css.cur_pair}>{curPair.replace("USDT", "/USDT")}</h2>
            <div className={css.cur_pair_value_container}>
              <h3 className={css.cur_pair_value_crypto}>{`$${priceString}`}</h3>
              <h4
                className={css.cur_pair_value_fiat}
                style={{ color: percentColor }}
              >
                {`${lastPercent} %`}
              </h4>
            </div>
          </div>

          <div className={css.wallet_value_container}>
            <h3 className={css.wallet_value_title}>Wallet Value:</h3>
            <div className={css.wallet_value_curpair_container}>
              <h3 className={css.wallet_value_crypto}>
                {balance} {currency}
              </h3>
              <h4 className={css.wallet_value_fiat}>
                {balanceToUsd} {"USD"}
              </h4>
            </div>
          </div>
          <button
            className={css.expand_bar}
            onClick={() => {
              setBarExpanded(!barExpanded);
            }}
          ></button>
        </BarContainer>
      );
    } else {
      alert("Validation: Please choose a valid currency pair(Non duplicate)");
      setIntervalAndCurPairState({
        ...intervalAndCurPairState,
        dropdwonIsEnabled: true,
      });
    }
  };
  useLayoutEffect(() => {
    if (props.isFromDB) {
      onConnect(props.curPair);
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, []);
  console.log("RENDER");

  return barJSX ? (
    <>
      {barJSX}
      <Section barIsExpanded={barExpanded}>
        <Graph>
          <div className={css.candle_interval_buttons}>
            <button
              className={css.candle_interval_button}
              onClick={async () =>
                await getCandlestickData(
                  intervalAndCurPairState.curPairState,
                  "1m"
                )
              }
            >
              1M
            </button>
            <button
              className={css.candle_interval_button}
              onClick={async () =>
                await getCandlestickData(
                  intervalAndCurPairState.curPairState,
                  "5m"
                )
              }
            >
              5M
            </button>
            <button
              className={css.candle_interval_button}
              onClick={async () =>
                await getCandlestickData(
                  intervalAndCurPairState.curPairState,
                  "15m"
                )
              }
            >
              15M
            </button>
            <button
              className={css.candle_interval_button}
              onClick={async () =>
                await getCandlestickData(
                  intervalAndCurPairState.curPairState,
                  "1h"
                )
              }
            >
              1H
            </button>
            <button
              className={css.candle_interval_button}
              onClick={async () =>
                await getCandlestickData(
                  intervalAndCurPairState.curPairState,
                  "1d"
                )
              }
            >
              1D
            </button>
            <button
              className={css.candle_interval_button}
              onClick={async () =>
                await getCandlestickData(
                  intervalAndCurPairState.curPairState,
                  "1w"
                )
              }
            >
              1W
            </button>
          </div>
          <WalletChart data={candles}></WalletChart>
        </Graph>
        <Algorithms></Algorithms>
      </Section>
    </>
  ) : (
    <BarContainer isWalletBar={true}>
      <button className={css.delete_bar} onClick={deleteBar}></button>
      <BarForm
        onConnect={onConnect}
        dropdownIsEnabled={intervalAndCurPairState.dropdwonIsEnabled}
      ></BarForm>
    </BarContainer>
  );
};

export default Bar;

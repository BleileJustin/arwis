import { useState, useContext } from "react";

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
  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  
  //GET WALLET DATA
  console.log("uid", uid);

  const id = props.id;

  //EXPANDBAR
  const expandBar = () => {
    setBarExpanded((current) => !current);
  };

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

  //ON CONNECT
  const onConnect = async (curPair) => {
    //Get list of current wallets
    const walletList = props.getWalletList(curPair);
    let isDuplicate = false;

    walletList.forEach((wallet) => {
      wallet.curPair === curPair || isDuplicate
        ? (isDuplicate = true)
        : (isDuplicate = false);
    });

    //if curPair exists and does not equal select and isDuplicate returns false
    if (curPair && curPair !== "select" && !isDuplicate) {
      //setBarJSX to connected Bar DOM component

      props.setWalletCurPair(curPair);
      console.log(curPair);
      const ticker = await fetch(`http://localhost:80/api/binance/${curPair}`);
      const tickerData = await getTickerData(ticker);
      const lastPrice = tickerData.lastPrice;
      const lastPercent = tickerData.lastPercent;
      const priceString = lastPrice.toString();
      const percentColor =
        lastPercent.charAt(0) === "-" ? "rgb(225, 50, 85)" : "rgb(5, 255, 0)";

      const candles = await fetch(
        `http://localhost:80/api/binance/candles/${curPair}`
      );
      const candlesData = await candles.json();
      setCandles(candlesData.candles);

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
                {`0 ${curPair.replace("USDT", "")}`}
              </h3>
              <h4 className={css.wallet_value_fiat}>
                {"0"} {"USD"}
              </h4>
            </div>
          </div>
          <button className={css.expand_bar} onClick={expandBar}></button>
        </BarContainer>
      );
    } else {
      alert("Validation: Please choose a valid currency pair(Non duplicate)");
    }
  };

  return barJSX ? (
    <>
      {barJSX}
      <Section barIsExpanded={barExpanded}>
        <Graph>
          <WalletChart data={candles}></WalletChart>
        </Graph>

        <Algorithms></Algorithms>
      </Section>
    </>
  ) : (
    <BarContainer isWalletBar={true}>
      <button className={css.delete_bar} onClick={deleteBar}></button>
      <BarForm onConnect={onConnect}></BarForm>
    </BarContainer>
  );
};

export default Bar;

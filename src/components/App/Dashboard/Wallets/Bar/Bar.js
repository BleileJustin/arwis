import { useState } from "react";

import css from "./Bar.module.css";
import BarForm from "./BarForm/BarForm";
import Graph from "../../../../UI/Graph/Graph";
import Algorithms from "./Algorithms/Algorithms";
import Section from "../../../../UI/Section/Section";
import BarContainer from "../../../../UI/BarContainer/BarContainer";

const Bar = (props) => {
  const [barJSX, setBarJSX] = useState();
  const [barExpanded, setBarExpanded] = useState(false);

  const id = props.id;
  const walletValueCryp = 20000;
  const walletValueFiat = 10000;

  //EXPANDBAR
  const expandBar = () => {
    setBarExpanded((current) => !current);
  };

  //DELETE BAR
  const deleteBar = () => {
    props.onDeleteBar(id);
  };
  //ON CONNECT
  const onConnect = (curPair) => {
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
      setBarJSX(
        <BarContainer isWalletBar={true}>
          <button className={css.delete_bar} onClick={deleteBar}></button>

          <div className={css.cur_pair_container}>
            <h2 className={css.cur_pair}>{curPair}</h2>
            <div className={css.cur_pair_value_container}>
              <h3 className={css.cur_pair_value_crypto}>
                {walletValueCryp} {curPair.slice(0, curPair.indexOf("/"))}
              </h3>
              <h4 className={css.cur_pair_value_fiat}>
                {walletValueFiat}{" "}
                {curPair.slice(curPair.indexOf("/") + 1, curPair.indexOf(":"))}
              </h4>
            </div>
          </div>

          <div className={css.wallet_value_container}>
            <h3 className={css.wallet_value_title}>Wallet Value:</h3>
            <div className={css.wallet_value_curpair_container}>
              <h3 className={css.wallet_value_crypto}>
                {walletValueCryp} {curPair.slice(0, curPair.indexOf("/"))}
              </h3>
              <h4 className={css.wallet_value_fiat}>
                {walletValueFiat}{" "}
                {curPair.slice(curPair.indexOf("/") + 1, curPair.indexOf(":"))}
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
        <Graph></Graph>
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

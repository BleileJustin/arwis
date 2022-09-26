import { useState } from "react";

import "./Bar.css";
import BarForm from "./BarForm/BarForm";

const Bar = (props) => {
  const [barState, setBarState] = useState(1);
  const [barExpanded, setBarCSS] = useState(false);

  console.log(barExpanded);
  const id = props.id;
  const walletValueCryp = 20000;
  const walletValueFiat = 10000;

  //EXPANDBAR
  const expandBar = () => {
    setBarCSS((current) => !current);
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
      //setBarState to connected Bar DOM component
      props.setWalletCurPair(curPair);
      setBarState(
        <div className={"bar"}>
          <button className={"expand_bar"} onClick={expandBar}></button>

          <div className={"cur_pair_container"}>
            <h2 className={"cur_pair"}>{curPair}</h2>
            <div className={"cur_pair_value_container"}>
              <h3 className={"cur_pair_value_crypto"}>
                {walletValueCryp} {curPair.slice(0, curPair.indexOf("/"))}
              </h3>
              <h4 className={"cur_pair_value_fiat"}>
                {walletValueFiat}{" "}
                {curPair.slice(curPair.indexOf("/") + 1, curPair.indexOf(":"))}
              </h4>
            </div>
          </div>

          <div className={"wallet_value_container"}>
            <h3 className={"wallet_value_title"}>Wallet Value:</h3>
            <div className={"wallet_value_curpair_container"}>
              <h3 className={"wallet_value_crypto"}>
                {walletValueCryp} {curPair.slice(0, curPair.indexOf("/"))}
              </h3>
              <h4 className={"wallet_value_fiat"}>
                {walletValueFiat}{" "}
                {curPair.slice(curPair.indexOf("/") + 1, curPair.indexOf(":"))}
              </h4>
            </div>
          </div>

          <button className={"delete_bar"} onClick={deleteBar}></button>
        </div>
      );
    } else {
      //otherwise alert
      alert("Validation: Please choose a Pair before connecting");
    }
  };

  props.validateFormCompletion(barState);

  return barState !== 1 ? (
    <div className={`${barExpanded ? "bar_expanded" : ""}`}>{barState}</div>
  ) : (
    <div className={"bar"}>
      <BarForm onConnect={onConnect}></BarForm>
      <button className={"delete_bar"} onClick={deleteBar}></button>
    </div>
  );
};

export default Bar;

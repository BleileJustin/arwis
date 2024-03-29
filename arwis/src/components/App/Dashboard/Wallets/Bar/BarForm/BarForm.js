import { useState } from "react";

import css from "./BarForm.module.css";

const BarForm = (props) => {
  const [dropdownState, setDropdownState] = useState("");

  const connect = (event) => {
    event.preventDefault();
    props.onConnect(dropdownState);
  };

  return (
    //Eventually eliminate hard coded options

    <form className={css.wallet_form} onSubmit={connect}>
      <select
        className={css.cur_pair}
        form="wallet_form"
        onChange={(e) => setDropdownState(e.target.value)}
        disabled={!props.dropdownIsEnabled}
      >
        <option value="select">Pair</option>
        <option value="BNBUSDT">BNB/USDT</option>
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="LTCUSDT">LTC/USDT</option>
      </select>
      {props.dropdownIsEnabled ? (
        <input type="submit" value="Connect" className={css.connect} />
      ) : (
        <h2 className={css.loading}>...Loading</h2>
      )}
    </form>
  );
};

export default BarForm;

import { useState } from "react";

import css from "./BarForm.module.css";

const BarForm = (props) => {
  const [dropdownState, setDropdownState] = useState("");

  const connect = (event) => {
    event.preventDefault();
    console.log(dropdownState);
    props.onConnect(dropdownState);
  };
  return (
    //Eventually eliminate hard coded options
    <form className={css.wallet_form} onSubmit={connect}>
      <select
        className={css.cur_pair}
        form="wallet_form"
        onChange={(e) => setDropdownState(e.target.value)}
      >
        <option value="select">Pair</option>
        <option value="BTC/USD:">BTC/USD</option>
        <option value="ETH/USD:">ETH/USD</option>
      </select>
      <input type="submit" value="Connect" className={css.connect} />
    </form>
  );
};

export default BarForm;

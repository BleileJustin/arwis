import { useState } from "react";

import css from "./Bar.module.css";
import BarForm from "./BarForm/BarForm";

const Bar = (props) => {
  const [barState, setBarState] = useState();
  const expandBar = () => {
    console.log("EXPAND_BAR CLICKED");
  };

  const id = props.id;

  const deleteBar = () => {
    props.onDeleteBar(id);
    console.log("DELETE_BAR CLICKED");
  };

  const onConnect = (curPair) => {
    setBarState(
      <div className={css.bar}>
        <button className={css.expand_bar} onClick={expandBar}></button>
        <h2 className={css.cur_pair}>{curPair}</h2>
        <h3 className={css.wallet_value}> </h3>
        <button className={css.delete_bar} onClick={deleteBar}></button>
      </div>
    );
  };

  return barState ? (
    barState
  ) : (
    <div className={css.bar}>
      <BarForm onConnect={onConnect}></BarForm>
    </div>
  );
};

export default Bar;

import { useState } from "react";

import css from "./Bar.module.css";
import BarForm from "./BarForm/BarForm";

const Bar = (props) => {
  const [barState, setBarState] = useState(1);
  const id = props.id;

  //DELETE BAR
  const deleteBar = () => {
    props.onDeleteBar(id);
  };
  //ON CONNECT
  const onConnect = (curPair) => {
    const algoList = props.getAlgoList(curPair);
    let isDuplicate = false;

    algoList.forEach((algo) => {
      algo.curPair === curPair || isDuplicate
        ? (isDuplicate = true)
        : (isDuplicate = false);
    });
    //if curPair exists and does not equal select and isDuplicate returns false
    if (curPair && curPair !== "select" && !isDuplicate) {
      //setBarState to connected Bar DOM component
      props.setAlgoCurPair(curPair);
      setBarState(
        <div className={css.bar}>
          <div className={css.cur_pair_container}>
            <button className={css.expand_bar}></button>
            <h2 className={css.cur_pair}>{curPair}</h2>
          </div>
          <div className={css.wallet_value_container}>
            <h3 className={css.wallet_value}>Wallet Value:</h3>
            <button className={css.delete_bar} onClick={deleteBar}></button>
          </div>
        </div>
      );
    } else {
      //otherwise alert
      alert("Validation: Please choose a Pair before connecting");
    }
  };

  props.validateFormCompletion(barState);

  return barState !== 1 ? (
    barState
  ) : (
    <div className={css.bar}>
      <BarForm onConnect={onConnect}></BarForm>
      <button className={css.delete_bar} onClick={deleteBar}></button>
    </div>
  );
};

export default Bar;

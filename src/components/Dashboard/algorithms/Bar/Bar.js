import { useState } from "react";

import css from "./Bar.module.css";
import BarForm from "./BarForm/BarForm";

const Bar = (props) => {
  const [barState, setBarState] = useState(1);
  const id = props.id;
  console.log(props.algorithms);

  const expandBar = () => {
    //
  };

  const deleteBar = () => {
    props.onDeleteBar(id);
  };

  const validateForm = () => {
    props.validate(barState);
  };

  const onConnect = (curPair) => {
    console.log(props.algorithms);
    props.duplicateValidation(curPair)
    curPair && curPair !== "select" && !props.algorithms.includes(curPair)//Duplicate validation logic too!
      ? setBarState(
          <div className={css.bar}>
            <div className={css.cur_pair_container}>
              <button className={css.expand_bar} onClick={expandBar}></button>
              <h2 className={css.cur_pair}>{curPair}</h2>
            </div>
            <div className={css.wallet_value_container}>
              <h3 className={css.wallet_value}>Wallet Value:</h3>
              <button className={css.delete_bar} onClick={deleteBar}></button>
            </div>
          </div>
        )
      : alert("Validation: Please choose a Pair before connecting");
  };

  validateForm();
  return barState !== 1 ? (
    barState
  ) : (
    <div className={css.bar} validate={validateForm}>
      <BarForm onConnect={onConnect}></BarForm>
      <button className={css.delete_bar} onClick={deleteBar}></button>
    </div>
  );
};

export default Bar;

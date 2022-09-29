import css from "./BarExpanded.module.css";

import WalletGraph from "./WalletGraph/WalletGraph";
import Algorithms from "./Algorithms/Algorithms";

const BarExpanded = (props) => {
  return (
    <div className={props.css ? css.bar_expanded : css.bar_closed}>
      {props.css ? (
        <>
          <WalletGraph></WalletGraph>
          <Algorithms></Algorithms>
        </>
      ) : null}
    </div>
  );
};

export default BarExpanded;

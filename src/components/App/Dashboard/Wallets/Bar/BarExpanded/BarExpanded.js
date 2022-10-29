import css from "./BarExpanded.module.css";

import WalletGraph from "./WalletGraph/WalletGraph";
import Algorithms from "./Algorithms/Algorithms";

const BarExpanded = (props) => {
  const tickHandler = async () => {
    const symbol = prompt("Choose a currency pair");
    symbol
      ? await fetch(`http://localhost:3000/ticker/${symbol}`)
          .then((res) => res.json())
          .then((data) => console.log(data))
      : console.log("err");
    return symbol;
  };
  //tickHandler();
  
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

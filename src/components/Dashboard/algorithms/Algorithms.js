import Bar from "./Bar/Bar";
import { useState } from "react";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const [bars, setBars] = useState([
    {
      id: 0,
      curPair: "ETH/USD",
      price: "$0.00",
    },
  ]);
  const addBar = () => {
    console.log("ADD_BAR CLICKED");
    //(DESIGN)!!!OPEN FORM INSIDE NEW BAR IN DOM!!!
  };

  const connectWallet = () => {
    console.log('WALLET CONNECTED')
  }

  const deleteBarHandler = (barId) => {
    setBars((prevBars) => {
      const updatedBars = prevBars.filter((bar) => bar.id !== barId);
      console.log(updatedBars)
      return updatedBars;
    });
  };

  return (
    <div className={css.algorithms}>
      <ul>
        {bars.map((bar) => (
          <Bar key={bar.id} id={bar.id} onDeleteBar={deleteBarHandler}>{bar.data}</Bar>
        ))}
      </ul>
      <button className={css.add_bar} onClick={addBar} />
    </div>
  );
};

export default Algorithms;

/*
{
        id: 0,
        curPair: 'ETH/USD',
        price: '$0.00',

      },
      {
        id: 1,
        curPair: 'BTC/USD',
        price: '$0.00'
      }
}
*/

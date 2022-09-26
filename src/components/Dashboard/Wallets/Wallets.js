import Bar from "./Bar/Bar";
import React, { useState } from "react";

import css from "./Wallets.module.css";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  let latestBarState = 0;
  let content = {};

  const validateFormCompletion = (barState) => {
    latestBarState = barState;
  };


  const setWalletCurPair = (curPair) => {
    const assignedCurPairWallet = {
      ...wallets[wallets.length - 1],
      curPair: curPair,
    };
    const walletList = [...wallets];
    walletList.splice([...wallets].length - 1, 1, assignedCurPairWallet);
    setWallets(walletList);
  };

  const getWalletList = (curPair) => {
    return [...wallets];
  };

  const addBarHandler = (event) => {
    if (latestBarState !== 1 || wallets.length < 1) {
      setWallets((prevBars) => {
        const prev = [...prevBars];
        prev.push({ id: Math.random(), curPair: null });
        return [...prev];
      });
    } else {
      alert("Please connect prevbar");
    }
    //Validation: "Please Connect before creating a new WalletBar"
    // Onclick of + retrieve bar state
  };

  const deleteBarHandler = (barId) => {
    setWallets((prevBars) => {
      const updatedBars = prevBars.filter((bar) => bar.id !== barId);
      return updatedBars;
    });
  };

  content = wallets.map((bar) => (
    <Bar
      key={bar.id}
      id={bar.id}
      onDeleteBar={deleteBarHandler}
      validateFormCompletion={validateFormCompletion}
      setWalletCurPair={setWalletCurPair}
      getWalletList={getWalletList}
    ></Bar>
  ));

  return (
    <div className={css.wallets}>
      <ul>{content}</ul>
      <button className={css.add_bar} onClick={addBarHandler} />
    </div>
  );
};

export default Wallets;

import Bar from "./Bar/Bar";
import React, { useState, useContext, useEffect, useRef } from "react";

import AuthContext from "../../../../store/auth-context";

import css from "./Wallets.module.css";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const authCtx = useContext(AuthContext);
  const scrollRef = useRef();

  let content = {};

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

  const addBarHandler = async () => {
    console.log(wallets);
    if (!wallets.length || wallets[wallets.length - 1].curPair) {
      setWallets((prevBars) => {
        const prev = [...prevBars];
        prev.push({ id: Math.random(), curPair: null });
        return [...prev];
      });
    } else {
      console.log(wallets);
      alert("Please connect prevbar");
    }
    //Validation: "Please Connect before creating a new WalletBar"
    // Onclick of + retrieve bar state
  };

  const deleteBarHandler = async (barId) => {
    const curPair = wallets.filter((wallet) => wallet.id === barId)[0].curPair;
    console.log(curPair);
    await fetch(`${authCtx.url}/api/delete-wallet/`, {
      method: "POST",
      body: JSON.stringify({
        email: authCtx.email,
        curPair: curPair,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setWallets((prevBars) => {
      const updatedBars = prevBars.filter((bar) => bar.id !== barId);
      return updatedBars;
    });
  };

  // GET WALLETS FROM DB

  useEffect(() => {
    const getWallets = async () => {
      const response = await fetch(`${authCtx.url}/api/get-wallets/`, {
        method: "POST",
        body: JSON.stringify({
          email: authCtx.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.wallets) return;
      const walletList = data.wallets.map((wallet) => {
        return { id: Math.random(), curPair: wallet.curPair, isFromDB: true };
      });
      setWallets(walletList);
    };
    getWallets();
  }, [authCtx.url, authCtx.email]);

  content = wallets.map((bar) => (
    <Bar
      curPair={bar.curPair}
      isFromDB={bar.isFromDB}
      key={bar.id}
      id={bar.id}
      onDeleteBar={deleteBarHandler}
      setWalletCurPair={setWalletCurPair}
      getWalletList={getWalletList}
    ></Bar>
  ));
  content.push(
    <div
      key="bottomOfScroll"
      ref={scrollRef}
    ></div>
  );

  return (
    <>
      <div className={css.wallets}>
        <div className={css.scroll_wrapper}>
          <ul>{content}</ul>
        </div>
      </div>
      <button className={css.add_bar} onClick={addBarHandler} />
    </>
  );
};

export default Wallets;

/* eslint-disable react-hooks/exhaustive-deps */
import css from "./Algorithms.module.css";

import Algorithm from "./Algorithm/Algorithm";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../../../../../../store/auth-context";
import { v4 as uuidv4 } from "uuid";

const Algorithms = (props) => {
  const [algoList, setAlgoList] = useState([]);
  const authCtx = useContext(AuthContext);
  //LIFT STATE^ UP TO PERSIST IT
  const getAlgoDBData = async () => {
    const algoDBData = await fetch(`${authCtx.url}/api/algo/get/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authCtx.email,
      }),
    });

    const algoData = await algoDBData.json();
    console.log(algoData);

    algoData.algoData.forEach((algo) => {
      const updatedAlgo = {
        id: algo.id,
        algo: algo.algo,
        algoData: [
          { value: algo.algo, label: "Algorithms:" },
          { value: algo.interval, label: "Interval:" },
          { value: algo.period, label: "Period:" },
          { value: algo.standardDev, label: "StdDev:" },
          { value: algo.amount, label: "% Amt:" },
        ],
      };
      setAlgoList((prevAlgos) => {
        const prev = [...prevAlgos];
        prev.push(updatedAlgo);
        return [...prev];
      });
    });
  };

  let content = {};

  const sendAlgoListToChild = () => {
    return [...algoList];
  };

  const setAlgo = (chosenAlgo) => {
    console.log(chosenAlgo);
    const assignedAlgo = {
      ...algoList[algoList.length - 1],
      algo: chosenAlgo,
    };
    const algos = [...algoList];
    algos.splice([...algoList].length - 1, 1, assignedAlgo);
    setAlgoList(algos);
  };

  const deleteAlgoHandler = async (algoId) => {
    console.log("algoId", algoId);
    setAlgoList((prevAlgos) => {
      const updatedAlgos = prevAlgos.filter((algo) => algo.id !== algoId);
      return updatedAlgos;
    });
    await fetch(`${authCtx.url}/api/algo/delete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authCtx.email,
        id: algoId,
      }),
    });
  };

  const addAlgoHandler = () => {
    algoList
      ? setAlgoList((prevAlgos) => {
          const prev = [...prevAlgos];
          prev.push({ id: uuidv4() });
          return [...prev];
        })
      : alert("Algo List Error");
  };

  const getTradeList = async () => {
    try {
      const tradeList = await fetch(`${authCtx.url}/api/tradelist/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authCtx.email,
        }),
      });
      const tradeListData = await tradeList.json();
      console.log("tradeListData", tradeListData);
      return tradeListData;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAlgoDBData();
    getTradeList();
  }, []);
  console.log("algoList", algoList);

  algoList
    ? (content = algoList.map((algo) => (
        <Algorithm
          key={algo.id}
          id={algo.id}
          onDeleteAlgo={deleteAlgoHandler}
          setAlgo={setAlgo}
          getAlgoList={sendAlgoListToChild}
          curPair={props.curPair}
          sendAlgoData={props.sendAlgoData}
          algo={algo}
        ></Algorithm>
      )))
    : console.log("err");

  return (
    <div className={css.algorithms}>
      <div className={css.scroll_wrapper}>
        <ul className={css.list}>{content}</ul>
        <button
          onClick={addAlgoHandler}
          className={css.add_algo_button}
        ></button>
      </div>
    </div>
  );
};

export default Algorithms;

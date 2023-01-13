import css from "./Algorithms.module.css";

import Algorithm from "./Algorithm/Algorithm";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../../../../../../store/auth-context";
import { v4 as uuidv4 } from "uuid";

const Algorithms = (props) => {
  const [algoList, setAlgoList] = useState([]);
  const authCtx = useContext(AuthContext);
  //  const dataArr = [];

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
          prev.push({ id: uuidv4(), curPair: props.curPair });
          return [...prev];
        })
      : alert("Algo List Error");
  };
  // get algortihms from db
  useEffect(() => {
    const fetchAlgos = async () => {
      const response = await fetch(`${authCtx.url}/api/algo/get/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authCtx.email,
        }),
      });
      const data = await response.json();
      if (!data.algoData) return;

      const algos = data.algoData.map((algo) => {
        console.log("JKL:");
        console.log(algo.active);
        return {
          id: algo.id,
          active: algo.active,
          curPair: algo.curPair,
          algoData: [
            {
              label: "Algorithm:",
              value: algo.algo,
            },
            {
              label: "Freq: ",
              value: algo.interval,
            },
            {
              label: "Period: ",
              value: algo.period,
            },
            {
              label: "StdDev: ",
              value: algo.standardDev,
            },
            {
              label: "% Amt: ",
              value: algo.amount,
            },
          ],
          isFromDB: true,
        };
      });
      algos.reverse();
      setAlgoList(algos);
    };
    fetchAlgos();
  }, [authCtx.email, authCtx.url]);

  if (algoList) {
    content = algoList.map(
      (algo) =>
        props.curPair === algo.curPair && (
          <Algorithm
            key={algo.id}
            id={algo.id}
            onDeleteAlgo={deleteAlgoHandler}
            setAlgo={setAlgo}
            getAlgoList={sendAlgoListToChild}
            curPair={props.curPair}
            algo={algo}
            active={algo.active}
            isFromDB={algo.isFromDB}
            ref={props.algoRef}
          ></Algorithm>
        )
    );
  }

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

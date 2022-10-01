import css from "./Algorithms.module.css";

import Algorithm from "./Algorithm/Algorithm";
import { useState } from "react";

const Algorithms = () => {
  const [algoList, setAlgoList] = useState([]);
  let latestAlgoState = 0;
  let content = {};

  const validateAlgoForm = (algoState) => {
    latestAlgoState = algoState;
  };

  const setAlgo = (chosenAlgo) => {
    const assignedAlgo = {
      ...algoList[algoList.length - 1],
      algo: chosenAlgo,
    };
    const algos = [...algoList];
    algos.splice([...algoList].length - 1, 1, assignedAlgo);
    setAlgoList(algos);
  };

  const sendAlgoList = () => {
    return [...algoList];
  };

  const deleteAlgoHandler = (algoId) => {
    setAlgoList((prevAlgos) => {
      const updatedAlgos = prevAlgos.filter((algo) => algo.id !== algoId);
      return updatedAlgos;
    });
  };

  const addAlgoHandler = () => {
    console.log(algoList);
    if (latestAlgoState !== 1 || algoList.length < 1) {
      setAlgoList((prevAlgos) => {
        const prev = [...prevAlgos];
        prev.push({ id: Math.random() });
        console.log(...prev);
        return [...prev];
      });
    } else {
      alert("Please complete previous Algo");
    }
  };

  algoList
    ? (content = algoList.map((algo) => (
        <Algorithm
          key={algo.id}
          id={algo.id}
          validateAlgoForm={validateAlgoForm}
          onDeleteAlgo={deleteAlgoHandler}
          getAlgoList={sendAlgoList}
          setAlgo={setAlgo}
        ></Algorithm>
      )))
    : (content = []);

  return (
    <div className={css.algorithms}>
      <div className={css.scroll_wrapper}>
        <ul>{content}</ul>
        <button
          onClick={addAlgoHandler}
          className={css.add_algo_button}
        ></button>
      </div>
    </div>
  );
};

export default Algorithms;

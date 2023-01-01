import css from "./Algorithms.module.css";

import Algorithm from "./Algorithm/Algorithm";
import { useState } from "react";

const Algorithms = (props) => {
  const [algoList, setAlgoList] = useState([]);
  //LIFT STATE^ UP TO PERSIST IT

  let previousAlgoIsComplete = {};
  let content = {};

  const sendAlgoListToChild = () => {
    return [...algoList];
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

  const deleteAlgoHandler = (algoId) => {
    setAlgoList((prevAlgos) => {
      const updatedAlgos = prevAlgos.filter((algo) => algo.id !== algoId);
      return updatedAlgos;
    });
  };

  const addAlgoHandler = () => {
    if (previousAlgoIsComplete || algoList.length < 1) {
      algoList
        ? setAlgoList((prevAlgos) => {
            const prev = [...prevAlgos];
            prev.push({ id: Math.random() });
            return [...prev];
          })
        : alert("Algo List Error");
    } else {
      alert("Please complete previous Algo");
    }
  };

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

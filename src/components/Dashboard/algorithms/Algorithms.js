import Bar from "./Bar/Bar";
import React, { useState } from "react";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const [algorithms, setAlgorithms] = useState([]);
  let latestBarState = 0;
  let content = {};

  const validateFormCompletion = (barState) => {
    latestBarState = barState;
  };

  const validateFormDuplication = () => {
    //
  };

  const setAlgoCurPair = (curPair) => {
    const assignedCurPairAlgo = {
      ...algorithms[algorithms.length - 1],
      curPair: curPair,
    };
    const algoList = [...algorithms];
    algoList.splice([...algorithms].length - 1, 1, assignedCurPairAlgo);
    setAlgorithms(algoList);
  };

  const getAlgoList = (curPair) => {
    return [...algorithms];
  };

  const addBarHandler = (event) => {
    if (latestBarState !== 1 || algorithms.length < 1) {
      setAlgorithms((prevBars) => {
        const prev = [...prevBars];
        prev.push({ id: Math.random(), curPair: null });
        return [...prev];
      });
    } else {
      alert("Please connect prevbar");
    }
    //Validation: "Please Connect before creating a new AlgoBar"
    // Onclick of + retrieve bar state
  };

  const deleteBarHandler = (barId) => {
    setAlgorithms((prevBars) => {
      const updatedBars = prevBars.filter((bar) => bar.id !== barId);
      return updatedBars;
    });
  };

  content = algorithms.map((bar) => (
    <Bar
      key={bar.id}
      id={bar.id}
      onDeleteBar={deleteBarHandler}
      validateFormCompletion={validateFormCompletion}
      validateFormDuplication={validateFormDuplication}
      setAlgoCurPair={setAlgoCurPair}
      getAlgoList={getAlgoList}
      algorithms={algorithms}
    ></Bar>
  ));

  return (
    <div className={css.algorithms}>
      <ul>{content}</ul>
      <button className={css.add_bar} onClick={addBarHandler} />
    </div>
  );
};

export default Algorithms;

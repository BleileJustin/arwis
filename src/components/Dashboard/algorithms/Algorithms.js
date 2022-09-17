import Bar from "./Bar/Bar";
import React, { useState } from "react";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [prevBarState, setPrevBarState] = useState();
  console.log(algorithms);
  let content = {};

  const validateForm = (barState) => {
    setPrevBarState(barState);
    console.log(prevBarState);
  };

  const addBarHandler = (event) => {
    console.log("ADD_BAR CLICKED");
    console.log(algorithms.length)
    console.log(prevBarState)
    if (prevBarState !== 1 || algorithms.length < 1) {
      setAlgorithms((prevBars) => {
        const prev = [...prevBars];
        prev.push({ id: Math.random() });
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
      validate={validateForm}
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

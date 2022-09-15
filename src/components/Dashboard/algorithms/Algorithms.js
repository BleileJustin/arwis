import Bar from "./Bar/Bar";
import React, { useState } from "react";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const [algorithms, setAlgorithms] = useState([]);
  console.log(algorithms);
  let content = {};

  const addBarHandler = (event) => {
    console.log("ADD_BAR CLICKED");
    setAlgorithms((prevBars) => {
      console.log(prevBars);
      const prev = [...prevBars];
      prev.push({ id: Math.random() });
      console.log([...prevBars]);
      console.log(algorithms);
      return [...prev];
    });
  };

  const deleteBarHandler = (barId) => {
    setAlgorithms((prevBars) => {
      const updatedBars = prevBars.filter((bar) => bar.id !== barId);
      console.log(updatedBars);
      return updatedBars;
    });
  };
  content = algorithms.map((bar) => (
    <Bar key={bar.id} id={bar.id} onDeleteBar={deleteBarHandler}></Bar>
  ));
  console.log(content);
  console.log(algorithms);

  return (
    <div className={css.algorithms}>
      <ul>{content}</ul>
      <button className={css.add_bar} onClick={addBarHandler} />
    </div>
  );
};

export default Algorithms;

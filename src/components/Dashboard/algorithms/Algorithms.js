import Bar from "./Bar/Bar";
import React, { useState } from "react";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const [algorithms, setAlgorithms] = useState([]);

  const addBarHandler = () => {
    console.log("ADD_BAR CLICKED");
    setAlgorithms((prevBars) => {
      prevBars.push({ id: prevBars.length });
      console.log(...prevBars);
      const prev = [...prevBars];
      return prev;
    });
  };

  const deleteBarHandler = (barId) => {
    setAlgorithms((prevBars) => {
      const updatedBars = prevBars.filter((bar) => bar.id !== barId);
      console.log(updatedBars);
      return updatedBars;
    });
  };
  const content = algorithms.map((bar) => (
    <Bar key={bar.id} id={bar.id} onDeleteBar={deleteBarHandler}></Bar>
  ));
  console.log(content);

  return (
    <React.StrictMode>
      <div className={css.algorithms}>
        <ul>{content}</ul>
        <button className={css.add_bar} onClick={addBarHandler} />
      </div>
    </React.StrictMode>
  );
};

export default Algorithms;

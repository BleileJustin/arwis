import Bar from "./Bar/Bar";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const addBar = () => {
    console.log("ADD_BAR CLICKED");
  };
  return (
    <div className={css.algorithms}>
      <Bar></Bar>
      <button className={css.add_bar} onClick={addBar}/>
    </div>
  );
};

export default Algorithms;

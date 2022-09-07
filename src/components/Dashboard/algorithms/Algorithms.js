import Bar from "./Bar/Bar";

import css from "./Algorithms.module.css";

const Algorithms = () => {
  const addBar = () => {};
  return (
    <div className={css.algorithms}>
      <Bar></Bar>
      <button className={css.add_bar} onClick={addBar}>
        +
      </button>
    </div>
  );
};

export default Algorithms;

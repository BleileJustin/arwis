import css from "./Algorithms.module.css";

import Algorithm from "./Algorithm/Algorithm";

const Algorithms = () => {
  return (
    <div className={css.algorithms}>
      <Algorithm></Algorithm>
      <Algorithm></Algorithm>
    </div>
  );
};

export default Algorithms;


//Will take in data
//Will render data with a chart library
//
import css from "./Graph.module.css";

const Graph = () => {
  return (
    <div className={css.graph_container}>
      <div className={css.graph}></div>
    </div>
  );
};

export default Graph;

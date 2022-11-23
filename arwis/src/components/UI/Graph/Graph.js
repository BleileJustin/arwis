//Will take in data
//Will render data with a chart library
//
import css from "./Graph.module.css";

const Graph = (props) => {
  return (
    <div className={css.graph_container}>
      <div className={css.graph}>{props.children}</div>
    </div>
  );
};

export default Graph;

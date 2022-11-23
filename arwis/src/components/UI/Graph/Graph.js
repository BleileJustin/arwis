//Will take in data
//Will render data with a chart library
//
import css from "./Graph.module.css";

const Graph = (props) => {
  return (
    <div id="container" className={css.graph}>
      {props.children}
    </div>
  );
};

export default Graph;

import css from "./BarExpanded.module.css";

const BarExpanded = (props) => {
  return (
    <div className={props.css ? css.bar_expanded : null}>{props.content}</div>
  );
};

export default BarExpanded;

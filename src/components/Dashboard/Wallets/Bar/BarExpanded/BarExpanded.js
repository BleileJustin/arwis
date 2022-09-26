import css from "./BarExpanded.module.css";

const BarExpanded = (props) => {
  return <div className={css.bar_expanded}>{props.content}</div>;
};

export default BarExpanded;

import css from "./BarContainer.module.css";

const BarContainer = (props) => {
  return <div className={css.bar_container}>{props.children}</div>
}

export default BarContainer;
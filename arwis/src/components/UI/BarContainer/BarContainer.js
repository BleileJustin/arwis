import css from "./BarContainer.module.css";

const BarContainer = (props) => {
  return (
    <div
      className={css.bar_container}
      style={props.isWalletBar ? { marginBottom: "1em" } : { padding: "0" }}
    >
      {props.children}
    </div>
  );
};

export default BarContainer;

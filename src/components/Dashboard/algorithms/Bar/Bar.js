import css from "./Bar.module.css";

const Bar = (props) => {
  const expandBar = () => {
    console.log("EXPAND_BAR CLICKED");
  };
  const id = props.id;

  const deleteBar = () => {
    props.onDeleteBar(id);
    console.log("DELETE_BAR CLICKED")
  }

  return (
    <div className={css.bar}>
      <button className={css.expand_bar} onClick={expandBar}></button>
      <h2 className={css.cur_pair}> </h2>
      <h3 className={css.wallet_value}> </h3>
      <button className={css.delete_bar} onClick={deleteBar}></button>
    </div>
  );
};

export default Bar;

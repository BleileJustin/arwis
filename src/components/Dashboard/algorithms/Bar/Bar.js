import css from "./Bar.module.css";

const Bar = () => {
  const expandBar = () => {
    console.log("EXPAND_BAR CLICKED");
  };

  return (
    <div className={css.bar}>
      <button className={css.expand_bar} onClick={expandBar}></button>
      <h2 className={css.cur_pair}> </h2>
      <h3 className={css.wallet_value}> </h3>
    </div>
  );
};

export default Bar;

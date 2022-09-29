import css from "./Algorithm.module.css";

const Algorithm = () => {
  return (
    <div className={css.algorithm}>
      <div className={css.algo_form_item_active}>
        <h4>Active:</h4>
        <label className={css.switch}>
          <input type="checkbox"></input>
          <span className={css.slider}></span>
        </label>
      </div>
      <div className={css.algo_form_item}>
        <h4>Algo:</h4>
        <select className={css.algo_form_select}>
          <option value="BollingerBands">Bollinger Bands</option>
        </select>
      </div>
      <div className={css.algo_form_item}>
        <h4>Freq:</h4>
        <input
          className={css.text_input}
          type="text"
          id="freq"
          name="freq"
          placeholder="σ"
        ></input>
      </div>
      <div className={css.algo_form_item}>
        <h4>Amt:</h4>
        <input
          className={css.text_input}
          type="text"
          id="amt"
          name="amt"
          placeholder="%"
        ></input>
      </div>
    </div>
  );
};

export default Algorithm;

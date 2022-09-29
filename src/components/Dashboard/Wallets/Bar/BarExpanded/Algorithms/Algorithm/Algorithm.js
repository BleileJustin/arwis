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
          <option value="DCA">Dollar Cost Avg</option>
        </select>
      </div>
      <div className={css.algo_form_item}>
        <h4>Freq:</h4>
        <span className={css.text_input}>
          <input
            className={css.text_input_bar}
            type="text"
            id="amt"
            name="amt"
          />
          σ
        </span>
      </div>
      <div className={css.algo_form_item}>
        <h4>Amt:</h4>
        <span className={css.text_input}>
          <input
            className={css.text_input_bar}
            type="text"
            id="amt"
            name="amt"
          />
          %
        </span>
      </div>
    </div>
  );
};

export default Algorithm;

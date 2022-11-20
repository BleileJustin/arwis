import { useState } from "react";
import css from "../Algorithm.module.css";

const AlgorithmForm = (props) => {
  //Square vs rectangle
  const [formState, setFormState] = useState({
    active: false,
    algo: "",
    freq: "",
    amt: "",
  });

  const submitForm = (event) => {
    event.preventDefault();

    setFormState((prevState) => ({
      ...prevState,
      active: true,
    }));
    const submittedForm = formState;
    props.onAlgoSubmit(submittedForm);
  };

  return (
    <form className={css.form} onSubmit={submitForm}>
      <div className={css.algorithm}>
        <div className={css.algo_container}>
          <div className={css.algo_button}>
            <button
              className={css.delete_algo}
              onClick={props.deleteAlgo}
            ></button>
          </div>
          <div className={css.algo_form_item}>
            <h4 className={css.algo_title}>Algo:</h4>
            <select
              className={css.algo_form_select}
              autoFocus={true}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  algo: e.target.value,
                }))
              }
            >
              <option value="select">Select Algo</option>
              <option value="BBands">Bollinger Bands</option>
              <option value="DCA">Dollar Cost Avg</option>
            </select>
          </div>
          <div className={css.algo_form_item}>
            <h4 className={css.algo_title}>Freq:</h4>
            <span className={css.text_input}>
              <input
                className={css.text_input_bar}
                type="text"
                id="freq"
                name="freq"
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    freq: e.target.value,
                  }))
                }
              />
              σ
            </span>
          </div>
          <div className={css.algo_form_item}>
            <h4 className={css.algo_title}>Amt:</h4>
            <span className={css.text_input_perc}>
              <input
                className={css.text_input_bar}
                type="text"
                id="amt"
                name="amt"
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    amt: e.target.value,
                  }))
                }
              />
              %
            </span>
          </div>
          <div className={css.algo_form_item_active}>
            <button
              type="submit"
              value="submit"
              className={css.submit}
            ></button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AlgorithmForm;
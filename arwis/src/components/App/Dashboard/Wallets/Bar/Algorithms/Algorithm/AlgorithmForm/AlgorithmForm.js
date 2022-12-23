import { useState } from "react";
import css from "../Algorithm.module.css";

const AlgorithmForm = (props) => {
  //Square vs rectangle
  const [formState, setFormState] = useState({
    isAlgoSet: false,
  });

  const [algoJSX, setAlgoJSX] = useState();

  const submitForm = (event) => {
    event.preventDefault();
    const targetArr = [];
    for (let i = 1; i < event.target.length - 1; i++) {
      console.log(event.target[i].parentNode.childNodes[0].textContent);
      targetArr.push({
        value: event.target[i].value,
        label: event.target[i].parentNode.childNodes[0].textContent,
      });
    }
    props.onAlgoSubmit(targetArr);
  };

  const submitAlgoChoice = (event) => {
    event.preventDefault();
    const submittedAlgo = event.target[1].value;
    const nextForm = algoFormList[submittedAlgo];
    setFormState((prevState) => ({
      ...prevState,
      algo: submittedAlgo,
      isAlgoSet: true,
    }));
    setAlgoJSX(nextForm);
  };

  const algoChoiceForm = (
    <form className={css.form} onSubmit={submitAlgoChoice}>
      <div className={css.algorithm}>
        <div className={css.algo_container}>
          <div className={css.algo_button}>
            <button
              className={css.delete_algo}
              onClick={props.deleteAlgo}
            ></button>
          </div>
          <div className={css.algo_form_item}>
            <h4 className={css.algo_title}>Algorithm:</h4>
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
              <option value="select">Select</option>
              <option value="BBands">Bollinger Bands</option>
              <option value="DCA">Dollar Cost Avg</option>
              <option value="MACD">MACD</option>
            </select>
          </div>
          <div className={css.algo_form_item}></div>
          <div className={css.algo_form_item}></div>
          <div className={css.algo_form_item}></div>
          <div className={css.algo_form_item}></div>
          <div className={css.algo_form_item}></div>
          <div className={css.algo_form_item}>
            <br />
            <button className={css.algo_form_next} type="submit">
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  const algoFormList = {
    BBands: (
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
              <h4 className={css.algo_title}>Algorithm:</h4>
              <select className={css.algo_form_select} disabled={true}>
                <option value="BBands">Bollinger Bands</option>
              </select>
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Freq:</h4>
              <select className={css.algo_form_select}>
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="30m">30m</option>
                <option value="1h">1h</option>
                <option value="6h">6h</option>
                <option value="12h">12h</option>
                <option value="1d">1d</option>
                <option value="1w">1w</option>
              </select>
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Period:</h4>
              <input
                className={css.algo_form_select}
                type="number"
                min="1"
                max="100"
                defaultValue="20"
              />
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>StdDev:</h4>
              <input
                className={css.algo_form_select}
                type="number"
                min="1"
                max="100"
                defaultValue="2"
              />
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Amt:</h4>
              <input
                className={css.algo_form_select}
                type="number"
                min="1"
                max="100"
                defaultValue="1"
              />
            </div>
            <div className={css.algo_form_item}></div>

            <div className={css.algo_button}>
              <button className={css.submit} type="submit"></button>
            </div>
          </div>
        </div>
      </form>
    ),
    MACD: (
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
              <h4 className={css.algo_title}>Algorithm:</h4>
              <select className={css.algo_form_select} disabled={true}>
                <option value="MACD">MACD</option>
              </select>
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Freq:</h4>
              <select className={css.algo_form_select}>
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="30m">30m</option>
                <option value="1h">1h</option>
                <option value="6h">6h</option>
                <option value="12h">12h</option>
                <option value="1d">1d</option>
                <option value="1w">1w</option>
              </select>
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Fast:</h4>
              <input
                className={css.text_input_perc}
                type="number"
                min="1"
                max="100"
                defaultValue="12"
              />
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Slow:</h4>
              <input
                className={css.text_input_perc}
                type="number"
                min="1"
                max="100"
                defaultValue="26"
              />
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Signal:</h4>
              <input
                className={css.text_input_perc}
                type="number"
                min="1"
                max="100"
                defaultValue="9"
              />
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Amt:</h4>
              <input
                className={css.text_input_perc}
                type="percent"
                min="1"
                max="100"
                defaultValue="10"
              />
            </div>
            <div className={css.algo_button}>
              <button className={css.submit} type="submit"></button>
            </div>
          </div>
        </div>
      </form>
    ),
    DCA: (
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
              <h4 className={css.algo_title}>Algorithm:</h4>
              <select className={css.algo_form_select} disabled={true}>
                <option value="DCA">DCA</option>
              </select>
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Freq:</h4>
              <select className={css.algo_form_select}>
                <option value="1h">1h</option>
                <option value="6h">6h</option>
                <option value="12h">12h</option>
                <option value="1d">1d</option>
                <option value="1w">1w</option>
                <option value="2w">2w</option>
                <option value="1m">1m</option>
              </select>
            </div>
            <div className={css.algo_form_item}>
              <h4 className={css.algo_title}>Amt:</h4>
              <input
                className={css.algo_form_select}
                type="number"
                defaultValue="1"
              />
            </div>
            <div className={css.algo_form_item}></div>
            <div className={css.algo_form_item}></div>
            <div className={css.algo_form_item}></div>
            <div className={css.algo_button}>
              <button className={css.submit} type="submit"></button>
            </div>
          </div>
        </div>
      </form>
    ),
  };
  return formState.isAlgoSet ? algoJSX : algoChoiceForm;
};

export default AlgorithmForm;

// //////////////////////////

/* <div className={css.algo_form_item}>
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
          </div> */

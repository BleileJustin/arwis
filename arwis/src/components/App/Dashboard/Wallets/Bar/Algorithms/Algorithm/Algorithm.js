import { useState } from "react";
import css from "./Algorithm.module.css";

import AlgorithmForm from "./AlgorithmForm/AlgorithmForm";
import getBollingerBands from "../../../../../../../../src/indicators/bollinger-bands.js";

const Algorithm = (props) => {
  const [algoState, setAlgoState] = useState({
    active: false,
    algo: "",
    freq: "",
    amt: "",
  });

  const [algoDom, setAlgoDom] = useState();
  const [algoIsDuplicate, setAlgoIsDuplicate] = useState(false);
  const id = props.id;

  const checkFormStateComplete = (formState) => {
    if (formState.algo && formState.freq && formState.amt) {
      setAlgoState((prevState) => {
        return { ...formState, complete: true, active: true };
      });
      return true;
    } else {
      setAlgoState((prevState) => {
        return { ...formState, complete: false, active: false };
      });
      return false;
    }
  };

  const checkAlgorithmIsDuplicate = (formState) => {
    const algoList = props.getAlgoList();
    algoList.forEach((algorithm) => {
      algorithm.algo === formState || algoIsDuplicate
        ? setAlgoIsDuplicate(true)
        : setAlgoIsDuplicate(false);
    });
    return algoIsDuplicate;
  };

  const deleteAlgo = () => {
    props.onDeleteAlgo(id);
  };
  var period = 14;

  var input = {
    period: period,
    values: [
      48.16, 48.61, 48.75, 48.63, 48.74, 49.03, 49.07, 49.32, 49.91, 50.13,
      49.53, 49.5, 49.75, 50.03, 50.31, 50.52, 50.41, 49.34, 49.37, 50.23,
      49.24, 49.93, 48.43, 48.18, 46.57, 45.41, 47.77, 47.72, 48.62, 47.85,
    ],
    stdDev: 2,
  };

  const bollingerBands = getBollingerBands(input.values, input.period, input.stdDev);
  console.log(bollingerBands);

  const onAlgoSubmit = (formState) => {
    const formIsComplete = checkFormStateComplete(formState);
    const formIsDuplicate = checkAlgorithmIsDuplicate(formState);
    if (formState && formIsComplete && !formIsDuplicate) {
      props.setAlgo(formState.algo);
      setAlgoDom(
        <div className={css.algo_container}>
          <div className={css.algorithm}>
            <div className={css.algo_button}>
              <button onClick={deleteAlgo} className={css.delete_algo}></button>
            </div>

            <div className={css.algo_item}>
              <h4 className={css.algo_title}>Algo:</h4>
              <h4 className={css.algo_content}>{formState.algo}</h4>
            </div>
            <div className={css.algo_item}>
              <h4 className={css.algo_title}>Freq:</h4>
              <h4 className={css.algo_content}>{formState.freq}σ</h4>
            </div>
            <div className={css.algo_item}>
              <h4 className={css.algo_title}>Amt:</h4>
              <h4 className={css.algo_content}>{formState.amt}%</h4>
            </div>
            <div className={css.algo_form_item_active}>
              <h4 className={css.algo_title}>Active:</h4>
              <label className={css.switch}>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    setAlgoState((prevState) => ({
                      ...prevState,
                      active: !prevState.active,
                    }));
                  }}
                ></input>
                <span className={css.slider}></span>
              </label>
            </div>
          </div>
        </div>
      );
    } else {
      alert("Validation: please complete form before submiting");
    }
  };
  return algoState.complete ? (
    algoDom
  ) : (
    <div className={css.algo_container}>
      <AlgorithmForm
        onAlgoSubmit={onAlgoSubmit}
        deleteAlgo={deleteAlgo}
      ></AlgorithmForm>
    </div>
  );
};
export default Algorithm;

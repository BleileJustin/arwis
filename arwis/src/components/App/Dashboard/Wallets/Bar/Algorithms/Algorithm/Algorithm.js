import { useState } from "react";
import css from "./Algorithm.module.css";

import AlgorithmForm from "./AlgorithmForm/AlgorithmForm";

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

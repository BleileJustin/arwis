/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useLayoutEffect } from "react";
import css from "./Algorithm.module.css";

import AuthContext from "../../../../../../../store/auth-context";
import AlgorithmForm from "./AlgorithmForm/AlgorithmForm";

const Algorithm = (props) => {
  let isFromDBActive;
  if (props.active === false) {
    isFromDBActive = false;
  } else {
    isFromDBActive = true;
  }

  const [activeState, setActiveState] = useState({
    active: isFromDBActive,
  });
  const [algoDom, setAlgoDom] = useState();
  const authCtx = useContext(AuthContext);

  let algoVariables = [];
  console.log(activeState);
  const id = props.id;
  console.log("algo id: " + id);

  const startAlgo = async (algoFormArr) => {
    setActiveState({
      active: true,
    });
    console.log(algoFormArr);
    const serverArray = algoFormArr.map((item) => {
      return {
        [item.label]: item.value,
      };
    });
    const serverObj = {};
    serverArray.forEach((item) => {
      Object.assign(serverObj, item);
    });
    console.log(serverObj);
    try {
      await fetch(`${authCtx.url}/api/algo/start/${algoFormArr[0].value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: authCtx.email,
          curPair: props.curPair,
          variables: serverObj,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const stopAlgo = async (algoFormArr) => {
    try {
      await fetch(`${authCtx.url}/api/algo/stop/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: authCtx.email,
        }),
      });
      setActiveState({
        active: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const restartAlgo = async (algoFormArr) => {
    console.log("restart");
    console.log(algoFormArr);
    console.log("restart");
    try {
      await fetch(`${authCtx.url}/api/algo/restart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: authCtx.email,
        }),
      });
      setActiveState({
        active: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAlgo = () => {
    props.onDeleteAlgo(id);
    stopAlgo(props.algo.algoData);
  };

  const onAlgoSubmit = async (formArr, isFromDB) => {
    console.log(formArr);
    if (props.algo.algoData || formArr) {
      console.log("formArr");
      if (!isFromDB) {
        await startAlgo(formArr);
      }
      props.setAlgo(formArr[0].value);
      const remainingBoxes = 6 - formArr.length;

      formArr.forEach((item) => {
        algoVariables.push(
          <div className={css.algo_form_item} key={item.label}>
            <h4 className={css.algo_title}>{item.label}</h4>
            <h4 className={css.algo_content}>{item.value}</h4>
          </div>
        );
      });

      for (let i = 0; i < remainingBoxes; i++) {
        algoVariables.push(
          <div className={css.algo_form_item} key={i}>
            <div className={css.spacer_line}></div>
          </div>
        );
      }

      setAlgoDom(
        <div className={css.algo_container}>
          <div className={css.algorithm}>
            <div className={css.algo_button}>
              <button onClick={deleteAlgo} className={css.delete_algo}></button>
            </div>
            {algoVariables}
            <div className={css.algo_form_item_active}>
              <h4 className={css.algo_title}>Active:</h4>
              <label className={css.switch}>
                <input
                  type="checkbox"
                  defaultChecked={activeState.active}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      stopAlgo(props.algo.algoData);
                    } else {
                      restartAlgo(props.algo.algoData);
                    }
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

  useLayoutEffect(() => {
    console.log(props.isFromDB);
    if (props.isFromDB) {
      console.log("isFromDB");
      onAlgoSubmit(props.algo.algoData, true);
    }
  }, [props.isFromDB]);

  return algoDom ? (
    algoDom
  ) : (
    <div className={css.algo_container}>
      <AlgorithmForm
        onAlgoSubmit={onAlgoSubmit}
        deleteAlgo={deleteAlgo}
        curPair={props.curPair}
      ></AlgorithmForm>
    </div>
  );
};
export default Algorithm;

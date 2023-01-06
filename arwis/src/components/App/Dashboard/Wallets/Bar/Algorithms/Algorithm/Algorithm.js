/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import css from "./Algorithm.module.css";

import AuthContext from "../../../../../../../store/auth-context";
import AlgorithmForm from "./AlgorithmForm/AlgorithmForm";

const Algorithm = (props) => {
  const [activeState, setActiveState] = useState({
    active: false,
  });
  const [algoDom, setAlgoDom] = useState();
  const authCtx = useContext(AuthContext);

  let algoVariables = [];
  console.log(activeState);
  const id = props.id;
  console.log("algo id: " + id);

  const startAlgo = async (algoFormArr) => {
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

      // Sends data all the way to the WalletChart component
      // const data = await response.json();
      // props.sendAlgoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const stopAlgo = async () => {
    try {
      await fetch(`${authCtx.url}/api/algo/stop/${props.algo.algo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: id,
          email: authCtx.email,
          curPair: props.curPair,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAlgo = () => {
    props.onDeleteAlgo(id);
    stopAlgo();
  };

  const onAlgoSubmit = async (formArr) => {
    console.log(formArr);
    if (props.algo.algoData || formArr) {
      if (formArr) {
        await startAlgo(formArr);
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
        setActiveState((prevState) => ({
          ...prevState,
          active: true,
        }));
      } else if (props.algo.algoData) {
        const remainingBoxes = 6 - props.algo.algoData.length;
        props.algo.algoData.forEach((item) => {
          console.log(item);
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
                  defaultChecked={true}
                  onChange={(e) => {
                    setActiveState((prevState) => ({
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

  useEffect(() => {
    if (props.algo.algoData) {
      onAlgoSubmit();
    }
  }, [props.algo.algoData]);

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

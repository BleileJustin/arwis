import { useState, useContext } from "react";
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

  const deleteAlgo = () => {
    props.onDeleteAlgo(id);
  };

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
    try {
      const response = await fetch(
        `${authCtx.url}/api/algo/start/${algoFormArr[0].value}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authCtx.email,
            curPair: props.curPair,
            variables: serverObj,
          }),
        }
      );
      const data = await response.json();
      props.sendAlgoData(data);
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  };

  const onAlgoSubmit = async (formArr) => {
    if (formArr) {
      await startAlgo(formArr);
      setActiveState((prevState) => ({
        ...prevState,
        active: true,
      }));
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

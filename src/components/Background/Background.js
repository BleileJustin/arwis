import css from "./Background.module.css";

const Background = () => {
  return (
    <div className={css.background}>
      <div className={css.gradientTL}></div>
      <div className={css.gradientBC}></div>
      <div className={css.gradientTR}></div>
    </div>
  );
};

export default Background;

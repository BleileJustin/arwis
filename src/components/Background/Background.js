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

//background: radial-gradient(circle, #14a1f246, #14a0f13b 10%, #14a0f118 35%, transparent 60%);
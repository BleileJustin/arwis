import css from "./Section.module.css";

const Section = (props) => {
  return (
    <div
      className={props.barIsExpanded ? css.visible : css.invisible}
      style={
        props.isWalletSection
          ? { marginTop: "-1em", marginBottom: "1em" }
          : { padding: "0" }
      }
    >
      {props.children}
    </div>
  );
};
export default Section;

import css from "./Section.module.css";

const Section = (props) => {
  return (
    <div className={props.barIsExpanded ? css.visible : css.invisible}>
      {props.children}
    </div>
  );
};
export default Section;

import css from "./LoginForm.module.css";

const LoginForm = () => {
  return (
    <div className={css.login_form_container}>
      <form>
        <label htmlFor="Username">Username</label>
        <input type="text"></input>
        <label htmlFor="Password">Password</label>
        <input type="text"></input>
      </form>
    </div>
  );
};

export default LoginForm;

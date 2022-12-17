import css from "./Profile.module.css";
import Background from "../../App/Background/Background";
import Navigation from "../../App/Navigation/Navigation";
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../../store/auth-context";

const Profile = () => {
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const emailInputRef = useRef();

  const submitPasswordChangeRequest = async (event) => {
    event.preventDefault();
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_APIKEY}`;
    const email = emailInputRef.current.value;
    if (email === "") {
      alert("Please enter your email address");
      return;
    } else if (email !== authCtx.email) {
      alert("Please enter the email address associated with your account");
      return;
    } else {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: authCtx.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        console.log(err);
      });
      setIsRequestSubmitted(true);
      setTimeout(() => {
        authCtx.logout();
        navigate("/", { replace: true });
      }, 5000);
    }
  };

  const deleteHandler = async (event) => {
    event.preventDefault();
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.REACT_APP_APIKEY}`;

    if (window.confirm("Are you sure you want to delete your account?")) {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          idToken: localStorage.getItem("token"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        console.log(err);
      });

      fetch(`${authCtx.url}/api/delete-user`, {
        method: "POST",
        body: JSON.stringify({
          email: authCtx.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        console.log(err);
      });

      localStorage.removeItem("token");
      window.location.reload();

      navigate("/", { replace: true });
      return;
    }
  };

  return (
    <div className={css.profile}>
      <Background />
      <div className={css.nav_container}>
        <Navigation />
      </div>
      <div className={css.profile_content}>
        <div>
          <div className={css.heading_container}>
            <h1 className={css.logo_heading}>A</h1>
            <h1 className={css.profile_heading}>RWIS</h1>
          </div>
          <h4 className={css.sub_heading}>Profile Settings</h4>
        </div>
        <div className={css.profile_main_container}>
          <h1 className={css.title}>Change Password</h1>
          {!isRequestSubmitted ? (
            <div className={css.send_pass_request_container}>
              <h1 className={css.form_sub_heading}>
                Request Email Verification Code
              </h1>
              <br />
              <form
                className={css.password_form}
                style={{ width: "80%" }}
                onSubmit={submitPasswordChangeRequest}
              >
                <input
                  className={css.text_input_field}
                  type="email"
                  placeholder="Email"
                  ref={emailInputRef}
                ></input>
              </form>
              <button
                className={css.submit_button}
                type="submit"
                value="submit"
              >
                Change Password
              </button>
            </div>
          ) : (
            <>
              <h1
                className={css.form_sub_heading}
                style={{ color: "rgb(5, 255, 0)" }}
              >
                Email Code Sent
                <h1
                  className={css.form_sub_heading}
                  style={{ color: "rgb(5, 255, 0)" }}
                >
                  Follow the email link to reset your password
                </h1>
              </h1>
              <h1
                className={css.form_sub_heading}
                style={{ color: "rgb(225, 50, 85)" }}
              >
                Prepare to be redirected to the login page
              </h1>
            </>
          )}

          <hr className={css.break_line}></hr>
          <h1 className={css.title}>Delete Account</h1>
          <form className={css.delete_form} onSubmit={deleteHandler}>
            <h1 className={css.form_sub_heading}>Cannot be undone!</h1>
            <br />
            <input
              placeholder="Password"
              className={css.text_input_field}
              type="password"
            ></input>
            <button className={css.delete_button} type="submit" value="submit">
              DELETE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

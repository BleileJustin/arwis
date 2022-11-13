import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";

const App = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          authCtx.isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />
        }
      />
      <Route
        path="/"
        exact
        element={
          !authCtx.isLoggedIn ? <Navigate to="/auth" replace /> : <HomePage />
        }
      />
    </Routes>
  );
};

export default App;

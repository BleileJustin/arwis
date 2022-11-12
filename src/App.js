import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Routes>
      <Route path="/auth">
        <LoginPage />
      </Route>
      <Route path="/home">
        <HomePage></HomePage>
      </Route>
    </Routes>
  );
};

export default App;

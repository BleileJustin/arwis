import Background from "./components/Background/Background";
import Navigation from "./components/Navigation/Navigation";
import Dashboard from "./components/Dashboard/Dashboard";

import './App.css'

const App = () => {
  return (
    <div className="app">
      <Background />
      <Navigation />
      <Dashboard />
    </div>
  );
};

export default App;

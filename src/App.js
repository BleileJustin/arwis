import Background from "./components/App/Background/Background";
import Navigation from "./components/App/Navigation/Navigation";
import Dashboard from "./components/App/Dashboard/Dashboard";

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

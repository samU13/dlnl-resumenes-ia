import Hero from "./components/Hero";
import Main from "./components/Main";

import "./App.css";

const App = () => {
  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>
      <div className="app">
        <Hero />
        <Main />
      </div>
    </main>
  );
};

export default App;

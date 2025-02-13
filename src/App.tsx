import "./css/App.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import NarutoLayout from "./components/NarutoLayout";
import NarutoDex from "./components/NarutoDex";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NarutoDex />} />
        <Route path="/:narutoId" element={<NarutoLayout />} />
        <Route path="/*/*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

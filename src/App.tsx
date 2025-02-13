import "./css/App.css";

import { useEffect } from "react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import MarioLayout from "./components/MarioLayout";
import MarioDex from "./components/MarioDex";

const removeAccents = (str : string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const RemoveAccentsGlobal = () => {
  useEffect(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while (node = walker.nextNode()) {
      node.nodeValue = removeAccents(node.nodeValue || '');
    }
  }, []);

  return null; // Ce composant ne retourne rien
};

function App() {
  return (
    <Router>
      <RemoveAccentsGlobal />
      <Routes>
        <Route path="/" element={<MarioDex />} />
        <Route path="/:marioId" element={<MarioLayout />} />
        <Route path="/*/*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

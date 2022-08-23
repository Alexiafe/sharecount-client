import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";

// Screen
import Home from "./screen/Home";
import Details from "./screen/Details";
import Edit from "./screen/Edit";
import Add from "./screen/Add";

function App() {
  return (
    <div>
      <Header></Header>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/add" element={<Add />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

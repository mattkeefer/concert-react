import React from 'react';
import './App.css';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";

function App() {
  return (
      <div className="app">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/Home"/>}/>
            <Route path="/Home" element={<Home/>}/>
          </Routes>
        </HashRouter>
      </div>
  );
}

export default App;

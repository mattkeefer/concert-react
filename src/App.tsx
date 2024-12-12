import React from 'react';
import './App.css';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";
import Navigation from "./Navigation";
import Register from "./Account/Register";
import Login from "./Account/Login";
import {Provider} from "react-redux";
import store from "./Store";
import {PersistGate} from "redux-persist/integration/react";
import ConcertDetailsScreen from "./Concert/DetailsScreen";
import Profile from "./Profile";

function App() {
  return (
      <div className="app">
        <Provider store={store.store}>
          <PersistGate persistor={store.persistor}>
            <HashRouter>
              <Navigation/>
              <Routes>
                <Route path="/" element={<Navigate to="/Home"/>}/>
                <Route path="/Home" element={<Home/>}/>
                <Route path="/Login" element={<Login/>}/>
                <Route path="/Register" element={<Register/>}/>
                <Route path="/Concert/:source/:eventId" element={<ConcertDetailsScreen/>}/>
                <Route path="/Profile/:userId" element={<Profile/>}/>
              </Routes>
            </HashRouter>
          </PersistGate>
        </Provider>
      </div>
  );
}

export default App;

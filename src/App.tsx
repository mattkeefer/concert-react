import React from 'react';
import './App.css';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./Screens/Home";
import Navigation from "./Components/Navigation";
import Register from "./Screens/Account/Register";
import Login from "./Screens/Account/Login";
import {Provider} from "react-redux";
import store from "./Store";
import {PersistGate} from "redux-persist/integration/react";
import ConcertDetailsScreen from "./Screens/ConcertDetails";
import Profile from "./Screens/Profile";

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
                <Route path="/Concert/:concertId" element={<ConcertDetailsScreen/>}/>
                <Route path="/Profile/:userId" element={<Profile/>}/>
              </Routes>
            </HashRouter>
          </PersistGate>
        </Provider>
      </div>
  );
}

export default App;

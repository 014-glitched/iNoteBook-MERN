//import './App.css';
import React from 'react';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import NoteState from './context/NoteState';


function App() {
  return (
    <>
    <NoteState>
      <BrowserRouter>
        <Navbar />
        <div className='container'>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
        </div>
      </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;


import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

const App = () => {
  return(
  <BrowserRouter>
  <Routes>
    <Route path='/register' element={<Register/>} />
    <Route path='/' element={<Login/>}/>
    <Route path='/home' element={<Home/>}/>


  </Routes>
  </BrowserRouter>
  );
}

export default App
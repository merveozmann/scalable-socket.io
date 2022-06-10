import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, email, } = values;
      const { data } = await axios.post("http://localhost:5000/login", {
        email, password
      })
      if (data.status == false) {
        alert("Password error")
      }
      if (data.status == true) {
        console.log(data)
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      }
    }
  }
  const handleValidation = () => {
    const { password, email } = values;
    if (password === "") {
      alert("Password is not null")
      return false;
    } else if (email === "") {
      alert("Username is not null")
      return false;
    }
    return true;
  }
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })

  }
  return (
    <div className='login__container'>

      <form onSubmit={(event) => handleSubmit(event)} className="login__form">
        <div className="title">
          <h3>LOG IN</h3>
        </div>
        <input type="text" name="email" id="" placeholder='email' onChange={(e) => handleChange(e)} />
        <input type="password" name="password" id="" placeholder='password' onChange={(e) => handleChange(e)} />
        <button type='submit' className='login__btn'>Log In</button>
        <span>
          <Link to="/register">Register</Link>
        </span>

      </form>

    </div>
  )
}

export default Login
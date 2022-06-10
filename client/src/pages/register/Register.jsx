import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { io } from 'socket.io-client'

import "./register.css"

const Register = () => {
    const socket = useRef();

    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        langue: "",
    })
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username, email, country, langue } = values;
            const { data } = await axios.post("http://localhost:5000/register", {
                username, email, password, country, langue
            })
            console.log(data)
            if (data.status == false) {
                alert(data.msg)
            }
            if (data.status == true) {
                socket.current = io("http://localhost:5000");
                socket.current.emit("register-user", data.user);
                navigate("/")

            }
        }
    }
    const handleValidation = () => {
        const alphanumeric = /^[\p{L}\p{N}]*$/u;
        const { password, confirmPassword, username, email, country, langue } = values;

        if (password !== confirmPassword) {
            alert("Password and confirm password should be same")
            return false;
        } else if (password == "" && confirmPassword == "") {
            alert("Password is not null")
            return false;
        } else if (email == "") {
            alert("Email is not null")
            return false;
        } else if (username == "") {
            alert("Username is not null")
            return false;
        }
        else if (langue == "") {
            alert("Langue is not null")
            return false;
        }
        else if (country == "") {
            alert("Country is not null")
            return false;
        } else if (password == confirmPassword) {
            if (password.match(alphanumeric) == null) {
                alert("Password should be alfanumeric")
                return false;
            }
            if (password.length < 8) {
                alert("Password should be at least 8 characters")
                return false;
            }
        }
        return true;
    }
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })

    }
    return (
        <div className="register__container">
            <form onSubmit={(event) => handleSubmit(event)} className="register__form">
                <div className="title">
                    <h3>REGISTER</h3>
                </div>
                <input type="text" name="username" id="" placeholder='username' onChange={(e) => handleChange(e)} />
                <input type="text" name="email" id="" placeholder='email' onChange={(e) => handleChange(e)} />
                <input type="password" name="password" id="" placeholder='password' onChange={(e) => handleChange(e)} />
                <input type="password" name="confirmPassword" id="" placeholder='confirm password' onChange={(e) => handleChange(e)} />
                <select  name="langue" onChange={(e) => handleChange(e)}>
                    <option value="0" selected disabled >Langue Select</option>
                    <option value="German">German</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Turkish">Turkish</option>
                </select>
                <select name="country" onChange={(e) => handleChange(e)}>
                    <option value="0" selected disabled >Country Select</option>
                    <option value="Germany">Germany</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Brazil">Brazil</option>
                    <option value="USA">USA</option>
                </select>
                <button type="submit" className='register__btn'>Create User</button>
                <span>
                    <Link to="/">Login</Link>
                </span>
            </form>
        </div>
    )
}

export default Register
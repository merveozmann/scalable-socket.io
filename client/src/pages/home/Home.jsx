import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import "./home.css"
const Home = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userList, setUserList] = useState([]);
  const [onlineUser, setOnline] = useState([]);
  const [onlineUserList, setOnlineUserList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/")
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user")))
      setIsLoaded(true)
    }
  }, [])
  useEffect(() => {
    if (currentUser) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("add-user", currentUser._id);
      socket.current.on("get-users", async (users) => {
        const data = await axios.get("http://localhost:5000/allusers/" + currentUser._id);
        setUserList(data.data)
        setOnline(users)
      })
      socket.current.on("new-user", async (user) => {
        console.log(user)
        if (currentUser._id != user) {
          const data = await axios.get("http://localhost:5000/getuserdetail/" + user);
          alert(data.data.username + " New User Created")
        }

      })
    }
  }, [currentUser])
  useEffect(() => {
    var obj = {}
    for (var i = 0; i < userList.length; i++) {
      var id = userList[i]._id
      if (!obj[id]) {
        obj[id] = { username: userList[i].username, connect: false, email: userList[i].email, _id: userList[i]._id }
      }
      if (onlineUser.length > 0) {
        for (var j = 0; j < onlineUser.length; j++) {
          if (userList[i]._id == onlineUser[j].userId) {
            obj[id].connect = true
          }
        }
      }
    }

    setOnlineUserList(obj)

  }, [onlineUser])
  const handleUserDetail = async (id) => {
    const data = await axios.get("http://localhost:5000/getuserdetail/" + id);
    var message = "Username = " + data.data.username + "\r\n" + "Email = " + data.data.email + "\r\n" + "Country = " + data.data.country + "\r\n" + "langue = " + data.data.langue + "\r\n";
    alert(message)
  }
  return (
    isLoaded &&
    <div className="content">

      <div className='container'>
        <div className='container__first'>
          <div className="user__list">
            {
              Object.keys(onlineUserList).map((key, index) => {
                return (
                  <div className="user__list-item" key={index}>
                    <div className="item">
                      <h3>{onlineUserList[key].username}</h3>
                    </div>
                    <div className="item">
                      <h3>{onlineUserList[key].connect == true ? "Online" : "Offline"}</h3>
                    </div>
                    <div className="button">
                      <button className='btn' onClick={() => handleUserDetail(onlineUserList[key]._id)}>View</button>
                    </div>

                  </div>
                )
              })
            }
          </div>
          <div className="current__user">

            <div className="item">
              <h3>Active User :  {currentUser.username}</h3>
            </div>
          </div>
        </div>
        <div className="container__second">
          <h3>WELCOME , {currentUser.username}</h3>
        </div>

      </div>
    </div>
  )
}

export default Home
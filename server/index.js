var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster) {
  var server = require('http').createServer();
  var io = require('socket.io')(server);
  var redis = require('socket.io-redis');

  io.adapter(redis({ host: 'localhost', port: 6379 }));

  setInterval(function () {
    io.emit('data', 'payload');
  }, 1000);

  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
}
if (cluster.isWorker) {
  var express = require('express');
  const cors = require("cors");
  const mongoose = require("mongoose")
  const userRoutes = require("./route/userRoutes");
  var bodyParser = require("body-parser")

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(express.json());

  app.use("/", userRoutes)

  mongoose.connect("mongodb://localhost:27017/socketIO", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB SUCCESS")
  }).catch((err) => { console.log(err.message) })


  const server = app.listen(5000, () => {
    console.log("LİSTEN - >" + 5000)
  })
  var socketIO = require("socket.io");

  var io = socketIO(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
      credentials: true,
    }
  });
  var redis = require('socket.io-redis');

  io.adapter(redis({ host: 'localhost', port: 6379 }));

  let users = [];
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  io.on("connection", (socket) => {

    socket.on("add-user", (userId) => {
      addUser(userId, socket.id);
      io.emit("get-users", users)
      io.emit("new-user", userId)

    })
    socket.on("register-user", (user) => {
      io.emit("new-user", user._id)
    })
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("get-users", users);
    })

  })
}

module.exports = app;
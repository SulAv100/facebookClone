const { Server } = require("socket.io");
const userModel = require("./models/usermodel.js");
const requestModel = require("./models/requestmodel.js");
const mongoose = require("mongoose");
const {
  aafuBayek,
  kaslaiPathako,
  kaslePathako,
} = require("./services/services.js");

const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  const userSockets = {};

  io.on("connection", (socket) => {
    console.log("An user connected with id", socket.id);

    socket.on("register", ({ userId }) => {
      console.log(`User with id ${userId} is trying to connect to the server`);
      userSockets[userId] = socket.id;

      console.log("The list of users are", userSockets);
    });

    socket.on("getUserList", async ({ userId }) => {
      const aafuBayekUser = await aafuBayek(userId);
      console.log(aafuBayekUser);
      if (userSockets[userId]) {
        io.to(userSockets[userId]).emit("aaruUser", { aafuBayekUser });
      }
    });

    socket.on("sendRequest", async ({ from, to }) => {
      console.log(`User ${from} is trying to be friend with user ${to}`);
      const isPresent = await requestModel.find({ from: from, to: to });
      if (isPresent.length < 1) {
        console.log(
          "There is no such request adding this request please wait "
        );
        const newRequest = new requestModel({
          from: from,
          to: to,
        });
        await newRequest.save();
        console.log("The request has been sent successful");

        const whomSend = await kaslaiPathako(from);
        const whoSend = await kaslePathako(to);
        console.log("Yeslai pathako hai ta", whomSend);
        console.log("Yesle pathako hai ta ", whoSend);

        const filterWhoSend = whoSend.map((item) => item.yeslePathako);

        if (userSockets[to]) {
          io.to(userSockets[to]).emit("requestAayo", { filterWhoSend });
        }
      } else {
        console.log(
          "This request is already present in the db no need to send againb"
        );
      }
    });

    socket.on("requestHaru", async ({ userId }) => {
      console.log(`User with id ${userId} is trying to get all requests`);
      const whoSend = await kaslePathako(userId);

      const filterWhoSend = whoSend.map((item) => item.yeslePathako);
      console.log("YO seperate hio hai", filterWhoSend);

      if (userSockets[userId]) {
        io.to(userSockets[userId]).emit("requestAayo", { filterWhoSend });
      }
    });

    socket.on("disconnect", () => {
      console.log("An user just disconnected");
      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
        }
      }
    });
  });
};

module.exports = { initSocketServer };
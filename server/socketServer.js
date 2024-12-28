const { Server } = require("socket.io");
const userModel = require("./models/usermodel.js");
const requestModel = require("./models/requestmodel.js");
const mongoose = require("mongoose");
const {
  aafuBayek,
  kaslaiPathako,
  kaslePathako,
  friendAdder,
  friendKoXa,
} = require("./services/services.js");

const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "*"],
      credentials: true,
      methods: "GET,POST,PATCH,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    },
  });

  const userSockets = {};

  io.on("connection", (socket) => {
    // console.log("An user connected with id", socket.id);

    socket.on("register", ({ userId }) => {
      // console.log(`User with id ${userId} is trying to connect to the server`);
      userSockets[userId] = socket.id;

      // console.log("The list of users are", userSockets);
    });

    socket.on("getUserList", async ({ userId }) => {
      const normmalData = await aafuBayek(userId);
      const yeskoSathiHaru = await friendKoXa(userId);
      const idMatra = yeskoSathiHaru.friends;

      // console.log("Yei ho hai ta friends ko id", idMatra);

      const aafuBayekUser = normmalData.filter(
        (user) => !idMatra.includes(user._id)
      );
      console.log(aafuBayekUser);
      if (userSockets[userId]) {
        io.to(userSockets[userId]).emit("aaruUser", { aafuBayekUser });
      }
    });

    socket.on("sendRequest", async ({ from, to }) => {
      // console.log(`User ${from} is trying to be friend with user ${to}`);
      const isPresent = await requestModel.find({ from: from, to: to });
      if (isPresent.length < 1) {
        const newRequest = new requestModel({
          from: from,
          to: to,
        });
        await newRequest.save();
        // console.log("The request has been sent successful");

        const whomSend = await kaslaiPathako(from);
        const whoSend = await kaslePathako(to);

        const filterWhoSend = whoSend.map((item) => item.yeslePathako);

        if (userSockets[to]) {
          io.to(userSockets[to]).emit("requestAayo", { filterWhoSend });
        }
      } else {
      }
    });

    socket.on("requestHaru", async ({ userId }) => {
      const whoSend = await kaslePathako(userId);

      const filterWhoSend = whoSend.map((item) => item.yeslePathako);

      if (userSockets[userId]) {
        io.to(userSockets[userId]).emit("requestAayo", { filterWhoSend });
      }
    });

    socket.on("sendHanekoRequest", async ({ userId }) => {
      const pathakoRequest = await kaslaiPathako(userId);
      const pathakoFilter = pathakoRequest.map((user) => user.pathakoRequest);

      if (userSockets[userId]) {
        io.to(userSockets[userId]).emit("tailePathako", { pathakoFilter });
      }
    });

    socket.on("cancelRequest", async ({ kasle, kasko }) => {
      // console.log(`${kasle} is tryin to cancel the reqyst to ${kasko}`);
      const kasleHaneko = await kaslePathako(kasko);
      const filterHaneko = kasleHaneko.map((item) => item.yeslePathako);
      const isPresent = await requestModel.findOneAndDelete({
        from: kasle,
        to: kasko,
      });

      // console.log("Yesle ho hai cancel haneko", filterHaneko);

      // const filterWhoSend = [];
      if (userSockets[kasko]) {
        io.to(userSockets[kasko]).emit("cancelHanyo", { filterHaneko });
      }
    });

    socket.on("requestAcceptHanyo", async ({ kasle, kasko }) => {
      // console.log(`User with id ${kasle} accepted the request of ${kasko}`);

      const result = await friendAdder(kasle, kasko);
      const result2 = await friendAdder(kasko, kasle);

      // console.log(result, "Yo ra aakro result chai yo ho hia", result2);

      const aayekoRequest = await userModel.findOne({ userId: kasle });

      const deleteRequest = await requestModel.findOneAndDelete({
        from: kasko,
        to: kasle,
      });

      // console.log(`${kasko} pathako yesle ho hai ta ${kasle}`);

      const userIds = [kasle, kasko];

      userIds.forEach((userId) => {
        if (userSockets[userId]) {
          io.to(userSockets[userId]).emit("acceptvayo", { kasle, kasko });
        }
      });

      // console.log(userAdd);
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

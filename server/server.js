const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./router/authrouter.js")

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,POST,PATCH,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth",authRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoDb connected successfully ");
  })
  .catch((error) => {
    console.error(error);
  });
app.get("/", (req, res) => {
  return res.status(200).json("Welcome to the server start point ");
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`The server is running at port ${PORT}`);
});

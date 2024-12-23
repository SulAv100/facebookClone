const userModel = require("../models/usermodel.js");
const requestModel = require("../models/requestmodel.js");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, date, gender } = req.body;
    const isPresent = await userModel.find({ email: email });
    if (isPresent.length > 0) {
      return res
        .status(403)
        .json({ msg: "User with this email already exists" });
    }
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password,
      date,
      gender,
    });

    await newUser.save();

    const token = await newUser.generateToken();
    console.log("Yo tolken ho hai", token);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .json({ msg: "User has been successfully created" });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ msg: "Server connection timeout" });
  }
};

const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const isPresent = await userModel.findOne({ email: email });
    if (!isPresent) {
      return res.status(402).json({ msg: "No user which such email exists" });
    }
    const passwordCompare = await bcrypt.compare(password, isPresent.password);

    if (passwordCompare) {
      const token = await isPresent.generateToken();

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .json({ msg: "Successfully logged in" });
    } else {
      return res.status(403).json({ msg: "Invalid credentails" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(504)
      .json({ msg: "Unexpected error occured in the server" });
  }
};

const verifyUser = (req, res) => {
  try {
    return res.status(203).json(req.user);
  } catch (error) {
    console.error(error);
  }
};

const getUsers = async (req, res) => {
  try {
    let finalList = [];
    const { userId } = req.body;
    const getRequestUsers = await requestModel.aggregate([
      {
        $match: {
          from: { $eq: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          as: "requestUsers",
        },
      },
      {
        $project: {
          "requestUsers.password": 0,
          "requestUsers.email": 0,
          "requestUsers.date": 0,
          "requestUsers.gender": 0,
          "requestUsers.friends": 0,
        },
      },
      {
        $unwind: "$requestUsers",
      },
      {
        $addFields: {
          "requestUsers.status": "$status",
        },
      },
    ]);

    console.log("Process haneko yo ho hai tra", getRequestUsers);

    const allUsers = await userModel
      .find({
        _id: { $ne: new mongoose.Types.ObjectId(userId) },
      })
      .select("-password -friends -date -gender -email");

    const requestRecieved = getRequestUsers.map((req) => req.to.toString());
    console.log("The users who recieved the request are ", requestRecieved);

    finalList = allUsers.filter(
      (user) => !requestRecieved.includes(user._id.toString())
    );

    const finalRequestList = getRequestUsers.map((item) => item.requestUsers);

    if (finalList && finalRequestList) {
      return res.status(201).json({ finalList, finalRequestList });
    }
    return res.status(404).json({ msg: "No data found" });
  } catch (error) {
    console.error(error);
  }
};

const logout = async (req, res) => {
  try {
    console.log("Aayo hai request");
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(202).json({ msg: "Successfully logged out " });
  } catch (error) {
    console.error(error);
  }
};

const sendRequest = async (req, res) => {
  try {
    const { from, to } = req.body;
    const findRequest = await requestModel.findOne({ from, to });
    if (findRequest) {
      console.log("Already send an request");

      return;
    }
    const newRequest = new requestModel({
      from: from,
      to: to,
    });
    await newRequest.save();
    return res.status(201).json({ msg: "Successfully sent the request" });
  } catch (error) {
    return res.status(505).json({ msg: "Internal server error occured" });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const isPresent = await requestModel.findOneAndDelete({ to: userId });
    if (isPresent) {
      return res.status(201).json({ msg: "Request unsent successfully" });
    }
    return res.status(404).json({ msg: "Request wasnt found" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  register,
  login,
  verifyUser,
  getUsers,
  logout,
  sendRequest,
  cancelRequest,
};

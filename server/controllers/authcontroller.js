const userModel = require("../models/usermodel.js");
const requestModel = require("../models/requestmodel.js");
const postModel = require("../models/postmodel.js");
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

    // console.log("Process haneko yo ho hai tra", getRequestUsers);

    const allUsers = await userModel
      .find({
        _id: { $ne: new mongoose.Types.ObjectId(userId) },
      })
      .select("-password -friends -date -gender -email");

    const requestRecieved = getRequestUsers.map((req) => req.to.toString());
    // console.log("The users who recieved the request are ", requestRecieved);

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

const posting = async (req, res) => {
  try {
    const { userId, postHeading, fileType } = req.body;

    const fileName = req.file.filename;

    const isPresent = await postModel.findOne({ userId: userId });
    if (!isPresent) {
      console.log("This user hasnt posted a single post till now");
      const newPost = new postModel({
        userId,
        content: [
          {
            heading: postHeading,
            contentType: fileType,
            image: fileType === "image" ? `/uploads/${fileName}` : null,
            video: fileType === "video" ? `/uploads/${fileName}` : null,
          },
        ],
      });

      await newPost.save();
      return res.status(203).json({ msg: "New post created successfully" });
    } else {
    }
  } catch (error) {
    console.error(error);
  }
};

const getRelatedPosts = async (req, res) => {
  try {
    console.log("This is the userId", req.body);
    const { userId } = req.body;
    // user le haleko posts haru first ma
    //   user ko friends array lai access hanera tiniaru le kunai post
    // hanexa ki nai check hanne ani yeuta array ma rakhera
    //  time stamp aanusar teslia sort garera return ???
    //  Possible - 1 (difficulty medium method: recursive )

    // const userPostsArray = await postModel.aggregate([
    //   {
    //     $match: {
    //       userId: { $eq: userId },
    //     },
    //   },
    // ]);

    const userPostsArray = await postModel.findOne({ userId: userId });
    console.log("Match vayeko data haru yei ho hai ta", userPostsArray);
    return res.status(202).json(userPostsArray);
  } catch (error) {
    return res.status(505).json({ msg: "Internal Server Error occured" });
  }
};

module.exports = {
  register,
  login,
  verifyUser,
  getUsers,
  logout,
  getRelatedPosts,
  posting,
};

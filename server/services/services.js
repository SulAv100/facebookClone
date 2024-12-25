const userModel = require("../models/usermodel.js");
const requestModel = require("../models/requestmodel.js");
const mongoose = require("mongoose");

const aafuBayek = async (userId) => {
  return await userModel
    .find({
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
    })
    .select("-password -email -friends -gender -date");
};

const kaslaiPathako = async (userId) => {
  return await requestModel.aggregate([
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
        as: "pathakoRequest",
      },
    },
    {
      $project: {
        "pathakoRequest.password": 0,
        "pathakoRequest.email": 0,
        "pathakoRequest.friends": 0,
        "pathakoRequest.date": 0,
        "pathakoRequest.gender": 0,
      },
    },
    {
      $unwind: "$pathakoRequest",
    },
    {
      $addFields: {
        "pathakoRequest.status": "$status",
      },
    },
  ]);
};

const kaslePathako = async (kasle) => {
  return await requestModel.aggregate([
    {
      $match: {
        to: { $eq: new mongoose.Types.ObjectId(kasle) },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "yeslePathako",
      },
    },
    {
      $project: {
        "yeslePathako.password": 0,
        "yeslePathako.email": 0,
        "yeslePathako.friends": 0,
        "yeslePathako.date": 0,
        "yeslePathako.gender": 0,
      },
    },
    {
      $unwind: "$yeslePathako",
    },
    {
      $addFields: {
        "yeslePathako.status": "$status",
      },
    },
  ]);
};

const friendAdder = async (user1, user2) => {
  try {
    const addUser = await userModel.findByIdAndUpdate(
      { _id: user1 },
      { $push: { friends: user2 } },
      { new: true }
    );

    if (addUser) {
      return "Successful";
    } else {
      return "Failed";
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { aafuBayek, kaslaiPathako, kaslePathako, friendAdder };

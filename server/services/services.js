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

const aafulePathayeko = async (userId) => {
  return await requestModel.aggregate([
    {
      $match: {
        from: { $eq: new mongoose.Types.ObjectId(userId) },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
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

module.exports = { aafuBayek, aafulePathayeko };

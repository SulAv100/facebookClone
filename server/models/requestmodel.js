const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  timeStanp: {
    type: Date,
    default: Date.now,
  },
});

const requestModel = mongoose.model("Request", requestSchema);
module.exports = requestModel;

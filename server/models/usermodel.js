const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  friends: {
    type: [String],
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      firstName: this.firstName,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "2d",
    }
  );
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

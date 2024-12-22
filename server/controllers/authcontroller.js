const userModel = require("../models/usermodel.js");
const bcrypt = require("bcryptjs");

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
    console.log(req.body);
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
    const totalUsers = await userModel.find({}).select("-password");
    if (totalUsers.length > 0) {
      console.log("Printing total users", totalUsers);
      return res.status(202).json({ totalUsers });
    }
    return res.status(404).json({ msg: "No users found" });
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

module.exports = { register, login, verifyUser, getUsers, logout };

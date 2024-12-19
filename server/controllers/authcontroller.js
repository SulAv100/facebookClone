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

module.exports = { register, login };

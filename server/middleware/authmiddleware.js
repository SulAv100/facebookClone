const jwt = require("jsonwebtoken");
const userModel = require("../models/usermodel.js");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log("Yo ho hai ta token", token);

  if (!token || token === undefined) {
    return res.status(404).json({ msg: "Invalid auth token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).json({ msg: "Invalid login token" });
  }
};

module.exports = authMiddleware;

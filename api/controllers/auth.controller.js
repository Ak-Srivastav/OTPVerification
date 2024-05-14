import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import OTP from "../models/otp.model.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    next(errorHandler(error));
  }
};

export const signin = async (req, res, next) => {
  if (req.cookies.access_token)
    return next(errorHandler(400, "User already logged in!"));
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const { password: pass, ...rest } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
    next();
  } catch (err) {
    next(errorHandler(err));
  }
};

export const signOut = async (req, res, next) => {
  if (!req.cookies.access_token)
    return next(errorHandler(400, "User not logged in!"));
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(errorHandler(error));
  }
};

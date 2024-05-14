import otpGenerator from "otp-generator";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const sendOTP = async (req, res, next) => {
  // console.log("inside sendOTP");
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      res.status(401).json({
        success: false,
        message: "User is already registered",
      });
      next();
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    // console.log(error);
    next(errorHandler(error));
  }
};

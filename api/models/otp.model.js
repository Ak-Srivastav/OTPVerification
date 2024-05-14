import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 15, // The document will be automatically deleted after 15 minutes of its creation time
  },
});

const mailSender = async (email, otp) => {
  // console.log(email, otp);
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: {
      name: process.env.NAME,
      address: process.env.ADDRESS,
    },
    to: email,
    subject: "OTP for email verification",
    html: `<h1>Please confirm your OTP</h1>
     <p>Here is your OTP code: ${otp}. This OTP will expire after 15 minutes.</p>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(info);
    return;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  if (this.isNew) {
    try {
      await mailSender(this.email, this.otp);
      next();
    } catch (err) {
      // console.log(err);
      next(errorHandler(500, "Error occurred while sending OTP"));
    }
  }
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;

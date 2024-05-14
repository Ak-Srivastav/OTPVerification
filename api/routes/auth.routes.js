import express from "express";
import { signOut, signin, signup } from "../controllers/auth.controller.js";
import { sendOTP } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/sendotp", sendOTP);
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signOut);

export default router;

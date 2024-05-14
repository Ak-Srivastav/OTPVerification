import express from "express";
import { getdetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get/:id", verifyJWT, getdetails);
export default router;

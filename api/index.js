import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import mongoose from "mongoose";
import { errorHandling } from "./utils/errorHandling.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/details", userRouter);

app.use(errorHandling);


// 
app.get("/api/helloworld", (req, res) => {
  res.json({ message: "Hello World from api route" });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the home page" });
});

app.get("*", (req, res) => {
  res.json({ message: "Page Not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

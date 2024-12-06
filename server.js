// @file    ./server.js

// Dependencies
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import bookRouter from "./routes/book.js";

// Database configuration
dotenv.config();
const uri = process.env.DB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to DocumentDB."))
  .catch((error) => {
    console.error("Connection error:", error.message);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    console.error("Stack trace:", error.stack);
  });

// Express app setup
const app = express();
app.use(express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("*", cors());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// - Homepage route
const homeRouter = require("./routes/home")
app.use('/', homeRouter)

// - Auth route
app.use("/auth", authRouter);

// - User route
app.use("/user", userRouter);

// - Book route
app.use("/book", bookRouter);


const port = process.env.PORT;

// Run app (Listen on port) ----------------------------------------------------
app.listen(port, () => {
  console.log(`The app is running on port ${port}.`);
});


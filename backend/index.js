import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js"
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
})

connectDB()
  // when  we use async then we get promises too
  // so we  hav eto handle them also

  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at Port :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed !! ;", error);
  });






















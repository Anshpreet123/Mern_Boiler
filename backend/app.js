import express from "express";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
// for any public static files
app.use(cookieParser());


// routes
import userRouter from "./routes/user.routes.js"
app.use("/user" , userRouter );

export {app};
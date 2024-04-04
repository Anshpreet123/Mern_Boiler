import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    // username:{
    //     type:String,
    //     required:true,
    //     unique:false
    // } , 
    email:{
        type:String ,
        unique:true
    } , 
    password:{
        type:String ,  
        unique:false
    } , 
    refreshToken:{
        type:String
    }
} , {timestamps:true});

// for checking while logging in 
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compareSync(password, this.password);
  //  return value will be either true or false
};

// for access and refresh token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
     
    },

    process.env.REFRESH_TOKEN_SECRECT,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User" , userSchema);

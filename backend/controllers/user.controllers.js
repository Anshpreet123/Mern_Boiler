import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js "
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    console.log('User found:', user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    console.log('Tokens generated:', accessToken, refreshToken);

    // Store the refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    console.log('User updated with refresh token');

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new apiError(500, "Something went wrong while generating refresh and access token");
  }
};

const signup = asyncHandler(async (req , res)=>{
         const {email , password} = req.body;
        console.log(email , password);
        if (!email || !password){
            throw new apiError(400 , "Invalid credentials");
        }
        const existedUser = await User.findOne({email});
    
        if (existedUser){
           throw new apiError(400 , "User Already Exists");
        }

        // encrypting the password
        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            email,
            password:hashedPassword
        });

        // i dont want to send the password and refresh token of the registered user
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if (!createdUser) {
            throw new apiError(500, "Something went wrong while registering the user");
        }
    
       return res.status(200).json(new apiResponse(200 ,createdUser ,  "Success"));
})

const signin = asyncHandler(async (req , res)=>{
     const {email , password} = req.body;
     if (!email || !password){
        throw new apiError(400 , "username and password is required");
     };

     const user = await User.findOne({email});

     if (!user){
        throw new apiError(400 , "User not found");
     }

     //if got the user then we have to check if its password is correct or not
     // make a extended function in the user model to get a boolean
      const isPasswordValid = await user.isPasswordCorrect(password);

      if (!isPasswordValid){
        throw new apiError(401, "user Password is incorrect");
      }
      // generating access and refresh tokens for user
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
         );
    
    // what are those tokens
    console.log(accessToken , refreshToken);


  // cookies me bhejo
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // while generating cookies we need to generate
  // these option makes the cookies unmodifiable
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options ,)
    .cookie("refreshToken", refreshToken, {sameSite:"lax" , httpOnly:true,secure:true})
    .cookie()
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully !"
      )
    );



})

export  {
    signup , 
    signin
}
import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
/**
 * Registers a new user.
 *
 * This function is an asynchronous handler that processes a POST request to register a new user.
 * It uses the 'asyncHandler' utility function to handle any potential errors that may occur during the registration process.
 *
 * @param {Object} req - The request object containing the user's registration data.
 * @param {Object} res - The response object to be sent back to the client.
 * @param {Object} req.body - The user's registration data.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @returns {void} - This function does not return any value.
 */
 const options = {
  httpOnly:true,
  secure:true
  }
  const generateAccessAndRefreshToken = async(userId)=>{
    try{
      const user = await User.findById(userId);
     
      const refreshToken = user.generateRefrehToken();
      const accessToken =  user.generateAccessToken();
       user.refreshToken = refreshToken;
     
      await user.save({validateBeforeSave:false}); //here we are saving only new refresh token in the user but when you save something in the user ,user modal kicks in and 
       //we defined that user should be saved with password as required so that is why  we user do not validate before saving in this case.
       return {accessToken,refreshToken};
    } catch(error){
      throw new ApiError(500,"Something went wrong while creating access and refresh tokens ")
    }
  }




const registerUser = asyncHandler(async (req, res) => {
  // TODO: Implement the registration logic here.
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const userData = req.body;
  const { username, fullName, email, password } = userData;
  if (
    [username, fullName, email, password].some((fields) => {
      fields.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserExist) {
    throw new ApiError(409, "User with username and email are  already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath); //even if cloudinary doesn't get any image in coverImagePath it just return empty string rather than
  //throwing an error/exception.

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id)?.select(
    "-password -refreshtoken"
  );
  // console.log({ user: user, createdUser: createdUser });
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // TODO: Implement the login logic here.
  // TODO: Implement the login logic here.
  // get user details from request body
  // validation - check if username or email not empty
  // check if user exists using the request username, email
  // check for password , whether this password is correct or not check with decrypt
  // create refresh token and access token
  // remove password and refresh token field from response
  // return res
  const {username,password,email} = req?.body;
  // console.log(req.body);
  if(!username && !email){
    throw new ApiError(400,"username or email is required")
  }

  //Here is an alternative based on logic discussion --- > 
  //if!(username || email){
   // throw new ApiError(400,"username or email is required")
  //}

  const user = await User.findOne({$or:[{username},{email}]})
  
  if(!user){
  throw new ApiError(404,"User does not exist");
}

// console.log({user:user});

 const isPasswordValid = await user.isPasswordCorrect(password);
 if(!isPasswordValid){
    throw new ApiError(401,"Please enter correct password");
 }

  const {refreshToken , accessToken} = await generateAccessAndRefreshToken(user._id);
  
  const loginUser = await User.findById(user?._id).select("-password -refreshToken"); //Here we again write query to fetch user from user db model because now we have
  //updated user with new refresh token which is not updated yet in the previous user reference in  line 125. So either we can just update refresh token i nthe 
  //isUserexist or call the updated user from db.
  console.log(accessToken,'tokenss   ',refreshToken)
  const options = {
    httpOnly:true,
    secure:true
  }
   return res.
   status(200).
   cookie("refreshToken",refreshToken,options).cookie("accessToken",accessToken,options)
   .json(new apiResponse(
    200,
    {user:loginUser,refreshToken,accessToken},
    "User logged In Successfully"));
   
});

// Logic when user is logged out

/**
 * Handles the user logout process.
 *
 * This function is an asynchronous handler that processes a POST request to log out a user.
 * It clears the refresh token cookie and the access token cookie from the client's browser.
 * It also updates the user's refresh token in the database to undefined.
 *
 * @param {Object} req - The request object containing the user's logout data.
 * @param {Object} res - The response object to be sent back to the client.
 * @returns {Object} - The response object with a status code of 200 and a JSON object containing a success message.
 */
const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true});
  const options = {
    httpOnly:true,
    secure:true
   }

  return res.status(200).clearCookie("refreshToken",options).clearCookie("accessToken",options).json(new apiResponse(200,{},"User Logged Out"))
});

/**
 * Verifies the refresh token and generates a new access token.
 *
 * This function is an asynchronous handler that processes a POST request to verify a refresh token.
 * It verifies the incoming refresh token, retrieves the user from the database, and checks if the refresh token is valid.
 * If the refresh token is valid, it generates a new access token and refresh token, and sends them back to the client.
 *
 * @param {Object} req - The request object containing the refresh token.
 * @param {Object} res - The response object to be sent back to the client.
 * @param {string} req.cookies.refreshToken - The refresh token sent from the client.
 * @param {string} req.body.refreshToken - The refresh token sent from the client.
 * @returns {Object} - The response object with a status code of 200 and a JSON object containing the new access token and refresh token.
 * @throws {ApiError} - If the refresh token is invalid or expired, it throws an ApiError with a status code of 401.
 */
const VerifyRefreshToken = asyncHandler(async(req,res)=>{
  try{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken ;
    if(!incomingRefreshToken) {
      throw new ApiError(401,"Unauthorized Access");
    }
    const decodedRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedRefreshToken?._id);

    if(!user){
     throw new Error(401,"Refresh token is invalid")
    }

    if(user?.refreshToken !== incomingRefreshToken){
      throw new Error(401,"Refresh token is expired or used");
    }

    const {accessToken ,refreshToken} = await generateAccessAndRefreshToken(user?._id);
      return res.status(200).
      cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(200,{refreshToken ,accessToken},"User Logged In Successfully")

  } catch(error){
    throw new ApiError(401,error.message || "Invalid Refresh Token")
  }
})

const changeUserPassword = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {oldPassword , newPassword} = req.body;
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
    if(!(isPasswordCorrect)){
      throw new ApiError(401,"Invalid Old Password")
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(200,{},"Password Updated Successfully")
})

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
  ))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {email,fullName} = req.body;
   if(!(email && fullName)){
    throw new ApiError(400,"Email and full Name must be provided");
   }
    const user = await User.findByIdAndUpdate(req?.user?._id ,{set:{email,fullName}},{new:true}).select(" -password");
    res.status(200).json(new apiResponse(200,{user},"User Updated Successfully"));
})

const uploadAvatarImage = asyncHandler(async(req,res)=>{
  try{
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
     throw new ApiError(400,"Avatar file is missing");
    }
  const avatar =   await uploadOnCloudinary(avatarLocalPath);
  if(!avatar){
    throw new ApiError(400,"Upload on cloudinary failed");
  }
  //TODO Delete the avatar file from system
   const user = await User.findByIdAndUpdate(req?.user?._id,{$set:{avatar:avatar.url}},{new:true}).select(" -password");
  return  res.status(200).json(new ApiResponse(200,{user},"File Updated Successfully"))
  }catch(error){
    throw new ApiError(400,"File Upload failed")
  }
 
})

const uploadCoverImage = asyncHandler(async(req,res)=>{
  try{
    const coverImageLocalPath =  req.file?.path;
    if(!coverImageLocalPath){
     throw new ApiError(400,"Cover Image file not found");
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
      throw new ApiError(400,"Error while uploading cover Image on cloudinary");
    }
    const user = await User.findByIdAndUpdate(req.user._id,{$set:{coverImage:coverImage?.url}},{new:true}).select("-password");
    return res.status(200).json(200,{user},"Cover Image Updated Successfully")
  } catch(error){
    throw new ApiError(400,"Error while updating cover Image"); 
  }
 
})

const getUserChannelInfo = asyncHandler(async (req,res)=>{

  const {userName} = req.params;
  if(!userName){
    throw new ApiError(400,"User not found");
  }

   const channel = User.aggregate([
    {$match:{userName}},
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"Subscribers"
      }
    },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as:"SubscribedTo"
        }
      },
      {
        $addFields : {
          subscribersCount:{$size:"subscribers"},
          subscribedToCount:{$size:"subscribedTo"},
          isSubscribed : {
            $cond: {
              if: $in(req.user._id,"subscribers.subscriber" ),
              then:true,
              else: false
            }
          }
        }
      },
      

      {
        $project: {
          userName: 1,
          fullName : 1,
          avatar :1,
          coverImage : 1,
          email : 1,
          subscribersCount:1,
          subscribedToCount:1,
          isSubscribed:1
        }
      }

   ])

   if(!channel?.length){
    throw new ApiError(400,"Channel Not Found");
   }

   return res.status(200).json(200,{channel:channel[0],"Channel Information Fetched Successfully"})
})


const getUserWatchHistory = asyncHandler(async(req,res)=>{
  const user = User.aggregate([
 {
  $match: {
  _id: new mongoose.Types.ObjectId(req.user._id)
          }
},
 {
  $lookup:{
  from:"videos",
  localField:"watchHistory",
  foreignField:"_id",
  as:"watchHistory",
  pipeline:[
    {
      $lookup : {
        from:"users",
        localField:"owner",
        foreignField:"_id",
        as:"owner",
        pipeline:[
          {
            $project:{
              userName:1,
              fullName:1,
              avatar:1,
              email:1
            },
          }
        ]
      }
    },
  {
    $addFields:{
      owner :{ $first:"$owner"}
    }
  }
  ]
 }
}
  ])

  if(!user){
    return new ApiError(400,"User Not Found");
  }
  return res.status(200).json(200,{user:user[0].watchHistor},"User History Fetched Successfully")
})


export {registerUser , loginUser ,logoutUser,VerifyRefreshToken,changeUserPassword,getCurrentUser,updateAccountDetails,uploadAvatarImage,uploadCoverImage,getUserChannelInfo,getUserWatchHistory};

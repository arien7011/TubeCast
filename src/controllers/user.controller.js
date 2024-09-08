import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
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

  const generateAccessAndRefreshToken = async(userId)=>{
    try{
      const user = await User.findById(userId);
      const refreshToken =  user.generateRefreshToken();
      const accessToken = user.generateAccessToken();
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
  console.log({ user: user, createdUser: createdUser });
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
  const {username,password,email} = req.body;
  if(!username && !email){
    throw new ApiError(400,"username or email is required")
  }

  //Here is an alternative based on logic discussion --- > 
  //if!(username || email){
   // throw new ApiError(400,"username or email is required")
  //}

  const isUserExist = await User.findOne({$or:[{username},{email}]})
  
  if(!isUserExist){
  throw new ApiError(404,"User does not exist");
}

 const isPasswordCorrect = await user.isPasswordCorrect(password);
 if(!isPasswordCorrect){
    throw new ApiError(401,"Please enter correct password");
 }

  const {refreshToken , accessToken} =  generateAccessAndRefreshToken(isUserExist._id)
  const loginUser = await User.findById(user?._id).select("-password -refreshToken"); //Here we again write query to fetch user from user db model because now we have
  //updated user with new refresh token which is not updated yet in the previous user reference in  line 125. So either we can just update refresh token i nthe 
  //isUserexist or call the updated user from db.

  const options = {
    httpOnly:true,
    secure:true
  }
   return res.
   status(200).
   cookie("refreshToken",refreshToken,options).cookie("accessToken",accessToken,options)
   .json(new apiResponse(
    201,
    {loginUser,refreshToken,accessToken},
    "User login Successfully"));
   
});

// Logic when user is logged out

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,{refreshToken:undefined},{$set:{new:true}});
   options = {
    httpOnly:true,
    secure:true
   }

  return res.status(200).clearCookie("refreshToken",options).clearCookie("accessToken",options).json(new apiResponse(200,{},"User Logged Out"))


});

export {registerUser , loginUser ,logoutUser};

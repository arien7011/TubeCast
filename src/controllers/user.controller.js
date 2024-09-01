import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js';
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
const registerUser = asyncHandler( async (req,res)=>{
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
  const {username,fullName,email,password} = userData;
  if(
    [username,fullName,email,password].some((fields)=>{
     fields.trim() === ''}))
     {
       throw new ApiError(400,'All fields are required');
     }
   const isUserExist = await User.findOne({
    $or:[{username},{email}]
  });
   if(isUserExist){
    throw new ApiError(409,'User with username and email are  already exists');
   }
   const avatarLocalPath = req.files?.avatar[0]?.path;
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;
   
   let coverImageLocalPath ;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPath = req.files.coverImage[0].path;
   }

   if (!avatarLocalPath) {
       throw new ApiError(400, "Avatar file is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)  //even if cloudinary doesn't get any image in coverImagePath it just return empty string rather than
   //throwing an error/exception.

   if (!avatar) {
       throw new ApiError(400, "Avatar file is required")
   }

 const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username:username.toLowerCase()
   })
   const createdUser = await User.findById(user._id)?.select("-password -refreshtoken");
   console.log({user:user,createdUser:createdUser});
   if(!createdUser){
    throw new ApiError(500,'Something went wrong while registering the user')
   }
   
    return  res.status(201).json(new apiResponse(200,createdUser,"User created successfully"));
})



export default registerUser
import { User } from '../models/user.model.js';
import jwt from "jsonwebtoken";
import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware function to verify JWT token.
 * This function is used as a middleware in Express.js routes to authenticate requests.
 * It extracts the access token from the request cookies or Authorization header, verifies it,
 * and populates the req.user object with the user data from the database.
 *
 * @param {import('express').Request} req - The Express.js request object.
 * @param {import('express').Response} _ - The Express.js response object (not used in this function).
 * @param {import('express').NextFunction} next - The Express.js next middleware function.
 *
 * @throws {ApiError} - Throws an ApiError if the access token is not provided, invalid, or the user does not exist.
 *
 * @returns {void} - This function does not return a value. It modifies the req object and calls the next middleware function.
 */

const verifyjwtToken = asyncHandler(async(req,_,next)=>{
    //here we have user '_' symbol after req because we have not used 'res' obj anywhere in the function therefore we can use this '_' instead of using 'res'
    //to avoid any warnings or unnecessary code .
    try{
        const accessToken = req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","");
        if(!accessToken){
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select(" -password -refreshToken")

        if(!user){
            throw new ApiError(401,"Invalid access token");
        }
        req.user = user
        next(); //middleware might be used before any other method execution in routes so we need to add next() middleware function to tell the successive function to determine that my work has done now 
        //you can execute.
    } catch(error){
      throw new ApiError(401,error?.message || "Invalid access token")
    }

})

export {verifyjwtToken}

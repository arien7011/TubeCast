/**
 * This module sets up the Express router for user-related routes.
 * It imports the necessary modules and sets up the route for user registration.
 *
 * @module router/userRouter
 * @requires express
 * @requires ./controller/user.controller/registerUser
 */
import router from "express";
import {registerUser , loginUser, logoutUser} from "../controllers/user.controller.js";
import  {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/**
 * Initializes the Express router and sets up the route for user registration.
 *
 * @function
 * @name userRouter
 * @returns {express.Router} - The initialized Express router with the user registration route.
 */
const userRouter = router();

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

    userRouter.route("/login").post(loginUser);

    //secured routes
    userRouter.route("/logout").post(verifyJWT,logoutUser); //This verifyjwtToken is a middleware which is used to authenticate the request that means whoever send this request is an authenticated user
    // or not to access our protected resources.

export default userRouter;


/**
 * This module sets up the Express router for user-related routes.
 * It imports the necessary modules and sets up the route for user registration.
 *
 * @module router/userRouter
 * @requires express
 * @requires ./controller/user.controller/registerUser
 */
import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails
} from "../controllers/user.controller.js";
import  {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/**
 * Initializes the Express router and sets up the route for user registration.
 *
 * @function
 * @name userRouter
 * @returns {express.Router} - The initialized Express router with the user registration route.
 */
const userRouter = Router();

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
    userRouter.route("/refresh-token").post(refreshAccessToken);
    userRouter.route('/change-password').post(verifyJWT,changeCurrentPassword);
    userRouter.route('/current-user').post(verifyJWT,getCurrentUser);
    userRouter.route('/update-account').patch(verifyJWT,updateAccountDetails);
    userRouter.route('/avatar').patch(verifyJWT,upload.single('avatar'),updateUserAvatar);
    userRouter.route('/cover-image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage);
    userRouter.route('/c/:userName').get(verifyJWT,getUserChannelProfile);
    userRouter.route('/user-watch-history').get(verifyJWT, getWatchHistory);

export default userRouter;


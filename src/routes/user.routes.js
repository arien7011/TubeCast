/**
 * This module sets up the Express router for user-related routes.
 * It imports the necessary modules and sets up the route for user registration.
 *
 * @module router/userRouter
 * @requires express
 * @requires ./controller/user.controller/registerUser
 */
import router from "express";
import registerUser from "../controllers/user.controller.js";

/**
 * Initializes the Express router and sets up the route for user registration.
 *
 * @function
 * @name userRouter
 * @returns {express.Router} - The initialized Express router with the user registration route.
 */
const userRouter = router();

userRouter.route("/register").post(registerUser);

export default userRouter;


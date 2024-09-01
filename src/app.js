/**
 * Initializes and configures the Express application with middleware.
 *
 * @module app
 * @requires express
 * @requires ./cookieParser
 * @requires ./cors
 *
 * @returns {express.Application} The configured Express application.
 */
import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

/**
 * Configures Cross-Origin Resource Sharing (CORS) middleware.
 *
 * @param {Object} options - The CORS options.
 * @param {string} options.origin - The origin URL to allow requests from.
 * @param {boolean} options.credentials - Indicates whether to include credentials in the request.
 * @param {number} options.optionsSuccessStatus - The status code to use for successful OPTIONS requests.
 */
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

/**
 * Parses incoming request bodies in JSON format.
 *
 * @param {Object} options - The JSON body parser options.
 * @param {string} options.limit - The maximum request body size.
 */
app.use(express.json({ limit: "16kb" }));

/**
 * Parses incoming request bodies in URL-encoded format.
 *
 * @param {Object} options - The URL-encoded body parser options.
 * @param {boolean} options.extended - Whether to use the 'extended' syntax.
 * @param {string} options.limit - The maximum request body size.
 */
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

/**
 * Serves static files from the 'Public' directory.
 *
 * @param {string} path - The path to the static files directory.
 */
app.use(express.static("Public"));

/**
 * Parses and validates cookies from incoming requests.
 * app.use(cookieParser()); signifies that the cookieParser() middleware is being added to the Express application.
 * The cookieParser() middleware is used to parse cookie headers and populate the req.cookies
 * object with the parsed cookies. This allows you to access the cookies in your request handlers.
 * @module cookieParser
 */

app.use(cookieParser());

export { app };

// Import routers
import userRouter from './routes/user.routes.js'; // If you have exported a file using 'default', you can give any name
// Just like we gave userRouter though we have defined it as userRouter. But if you have just used export {method name},
// you need to explicitly declare the exact name of that method and also its path.

// Declaring routes
// localhost:4000/api/v1/users/register
app.use("/api/v1/users", userRouter);

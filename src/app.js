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
import cookieParser from "./cookieParser";
import cors from "./cors";

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
 *The cookieParser() middleware is used to parse cookie headers and populate the req.cookies
 *object with the parsed cookies. This allows you to access the cookies in your request handlers.
 * @module cookieParser
 */

app.use(cookieParser());

export { app };

/*
OPTIONAL NOTES FOR THIS PAGE
# We have used three packages here namely express for making express app , cookie-parser for parsing and configure cookies settings
and  cors for configuring  cors(cross origin resource sharing to prevent and determine unwanted request or unauthorzised request) 
rules .
#On line 7 , we have middleware using app.use and define cors settings, you can define in two ways 1. app.use(cors())  and second 
by providing options that is an object so simply use object symbol(curly bracess) and define various properties based on the 
requirement
# so origin key defines the expecting request origins you want to allow , credentials defines the credentials you want to allow ,
 optionsSuccessStatus : 200 defines the status code that express should send back when a request is allowed to pass through the middleware.
# In line 12, we are using express.json() and express.urlencoded() middleware for parsing json and urlencoded request body respectively.
# express.json() middleware parses incoming request bodies in a JSON format and express.urlencoded() middleware parses incoming request bodies 
# to populate req.body with key-value pairs of strings.
# express.static middleware serves static files from the "public" directory.
# At last, we export our app object so that we can use it in other parts of our application.
*/

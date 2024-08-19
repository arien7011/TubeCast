/**
 * This script initializes the Express application and connects to the MongoDB database.
 * It uses dotenv to load environment variables from a .env file and connects to the database using the connectDB function.
 *
 * @module index
 * @requires dotenv
 * @requires ./db/index
 * @requires ./app
 */

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

/**
 * Loads environment variables from a .env file.
 *
 * @function
 * @param {Object} options - Options for dotenv configuration.
 * @param {string} options.path - Path to the .env file.
 */
dotenv.config({
  path: "./env",
});

/**
 * Connects to the MongoDB database and starts the Express application.
 *
 * @async
 * @function
 */
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App listening on PORT : ${process.env.PORT}`);
    });

    /**
     * Event listener for application errors.
     *
     * @event app#error
     * @param {Error} err - The error that occurred.
     */
    app.on("error", (err) => {
      console.log(`Error: ${err} `);
    });
  })
  .catch((err) => {
    /**
     * Logs an error message if the MongoDB connection fails.
     *
     * @param {Error} err - The error that occurred during the connection.
     */
    console.error(`MONGODB connection failed,${err}`);
  });

/*
this is another way to connect to MONGODB database . The best way is to separate the logic of database connection in another file 
and then call that database connction method here in index.js just like we have done above.
KEY POINTS :
* Database is in another continent that means database connection takes time so always wrap database connecton login in try and catch 
and make the db. connection function asynchronous using async await.
import express from "express"
const app = express();
;(async ()=>{
  try{
    const dbConnect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MONGODB connected !!!! HOST : ${dbConnect.connection.HOST}`);
    app.on("error",(err)=>{
      console.log(`MONGODB connection error : ${err}`);
      throw err;
    })
  }catch(error){
    console.error(`MONGODB Connection Failed : ${error}`);
   throw error
  }

})()

*/

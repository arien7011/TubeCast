/**
 * This function establishes a connection to a MongoDB database using Mongoose.
 *
 * @async
 * @function connectDB
 * @returns {void}
 *
 * @throws Will throw an error if the connection fails.
 *
 * @example
 * import connectDB from './connectDB';
 *
 * try {
 *   await connectDB();
 * } catch (error) {
 *   console.error('Failed to connect to MongoDB:', error);
 * }
 */
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Connect to MongoDB

const connectDB = async () => {
  try {
    const connnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `"MongoDB Connected !!: HOST:":${connnectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`"ERORR:${error}`);
    Process.exit(1); //process defines a process that is running currently in our app.
  }
};

export default connectDB;

import dotenv from "dotenv";
import connectDB from "./db/index.js"

// Connect to MongoDB
dotenv.config({
  path:'./env'
})


connectDB();
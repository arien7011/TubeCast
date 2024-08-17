import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Connect to MongoDB

const connectDB = async () => {
    try{
    const connnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
     console.log(`"MongoDB Connected !!: HOST:":${connnectionInstance.connection.host}`)
    } catch(error){
        console.log(`"ERORR:${error}`);
        Process.exit(1)   //process defines a process that is running currently in our app.
    }
}

export default connectDB ;
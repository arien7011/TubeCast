import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Defines the Mongoose schema for a User and includes methods for password hashing and verification.//+
 * //+
 * @typedef {import('mongoose').Schema} Schema//+
 * @typedef {import('mongoose').Document} Document//+
 * @typedef {import('mongoose').Model} Model//+
 * //+
 * @typedef {Object} UserDocument//+
 * @property {string} username - The username of the user.//+
 * @property {string} email - The email of the user.//+
 * @property {string} fullname - The full name of the user.//+
 * @property {string} password - The hashed password of the user.//+
 * @property {string} avtar - The URL of the user's avatar image on Cloudinary.//+
 * @property {string} coverImage - The URL of the user's cover image on Cloudinary.//+
 * @property {Array.<string>} watchHistory - An array of video IDs representing the user's watch history.//+
 * @property {string} refreshToken - The refresh token for the user's authentication.//+
 * 
 * @extends {Document}//+
 * @augments {UserDocument}//+
 */
const userSchema = new mongoose.Schema(
    {
     username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
     },
     email : {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
     },
     fullName: {
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true
     },
     password: {
        type:String,
        required:[true,"Password is required"]
     },
     avatar : {
      type:String,  //cloudinary url
      required:true 
     },
     coverImage : {
        type:String, //cloudinary url
     },
     watchHistory : [
        {
            type:Schema.Types.ObjectId,
            ref:'Video'
        }
     ],
     refreshToken : {
        type:String,
     }
    }
,{timestamps:true})


/**
 * A Mongoose pre-save hook that hashes the password before saving the user document.//+
 * //+
 * @param {import('mongoose').HookNextFunction} next - The next function in the middleware chain.//+
 *///+
 userSchema.pre("save", async function (next) {
   if(!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10)
   next()
})

/**
 * A method that compares a given password with the hashed password stored in the user document.
 * 
 * @param {string} password - The password to compare.//+
 * @returns {Promise<boolean>} - A promise that resolves to true if the password is correct, otherwise false.
 */
userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password,this.password,)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
      {
         _id:this._id,
         username:this.username,
         fullName:this.fullName,
         email:this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
   )
}

userSchema.methods.generateRefrehToken = function (){
   return jwt.sign(
     {
        _id:this._id,
           },
           process.env.REFRESH_TOKEN_SECRET,
           {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  )
}

export const User = mongoose.model('User',userSchema);
import mongoose , {schema} from mongoose;

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
     fullname: {
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
     avtar : {
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


export const user = mongoose.model('User',userSchema);
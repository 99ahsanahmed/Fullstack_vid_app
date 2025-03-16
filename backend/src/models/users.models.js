import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String, // Cloudinary URL
    required: true,
  },
  coverImage: { 
    type: String, // Cloudinary URL
    required: false,
  },
  watchHistory: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
},
{timestamps: true}
);

//CRYPTING PASSWORD
userSchema.pre("save" , async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password , 10)
  next();
});
//PASSWORD VALIDATION
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password , this.password);
}

userSchema.methods.generateAcessToken = function(){
  return jwt.sign({
    _id : this._id,
    email : this.email,
    username : this.username,
    fullname : this.fullname,
  },
  process.env.ACCESS_TOKEN,
  {expiresIn : process.env.TOKEN_EXPIRY}
)
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: process.env.REFRESH_EXPIRY },
  );
}
export const User = mongoose.model("User",userSchema)

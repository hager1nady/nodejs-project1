
import  mongoose from "mongoose"
import { Schema,model} from "mongoose";
////////// create userSchema////////
const userSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
    username: {
        type: String,
        required: true,
        unique: true
      },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password: {
        type: String,
        required: true
      },
     DOB:{
        type:Date,
        required:true
   },
   recoveryEmail: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['User', 'Company_HR'],
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  }
    
},{
    timestamps:true
})

/////// create userModel////////
const userModel=mongoose.model("user",userSchema)

export default userModel
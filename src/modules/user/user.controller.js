import userModel from "../../../DB/models/user.modl.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmails } from "../../services/sendEmail.js"
import nodemailer from 'nodemailer'
import { ErrorClass } from "../../utils/error-class.utils.js"
////////////////////api sign up/////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,user}
 * @description sign up
 */
const signUp=async(req,res,next)=>{
   
     const {firstName,lastName,username,email,password,DOB,recoveryEmail,role,status,mobileNumber}=req.body
     const userExist=await userModel.findOne({email})
     if(userExist){
         next(
            new ErrorClass(
                "user already exist",
                409,
                {email},
                "error exist in sign up",
               
            )
         )
     }
     //////hashing password befor store it////////
     const hash=bcrypt.hashSync(password,+process.env.SALT_ROUND)
     console.log(process.env.SALT_ROUND);
     const user=await userModel.create({firstName,lastName,username,email,password:hash,DOB,recoveryEmail,role,status,mobileNumber})
     sendEmails(req.body.email)
     res.status(201).json({message:"sign up success",user})
    
    }
///////////////////////api sign in///////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,token}
 *  @description sign in
 */
const signIn=async(req,res,next)=>{
    // try{
     const {password,email,mobileNumber,_id}=req.body
     const userExist=await userModel.findOne({$or: [{ email }, { mobileNumber}]})
     if(!userExist || !bcrypt.compareSync(password,userExist.password)){
        next(
            new ErrorClass(
                "uinvalid email or password incorrect",
                409,
                {email,password},
                "error exist in sign in",
               
            )
         )
     }   
    ////////////genarate token///////////////////////
     const token=jwt.sign({id:userExist._id,firstName:userExist.firstName,email},"ahmed")
     // Update status to online
     userExist.status = 'online';
     await userExist.save();
     res.status(201).json({message:"sign in success",token})
    }
///////////////////api update account///////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message}
 * @description update account
 */
const updateUser=async(req,res,next)=>{  
        const {email,mobileNumber,recoveryEmail,lastName,firstName}=req.body
        const {id}=req.params
        const user=await userModel.findOneAndUpdate({_id:id},{email},{mobileNumber},{recoveryEmail},{firstName},{lastName},{new:true})  
        if(!user){
         return   next(
                new ErrorClass(
                    "you are not authorized",
                    400,
                    {_id},
                    "error exist in update ",
                   
                )
             )
        }

        // Ensure the user is updating their own account
         if (req.user._id != req.params.id) {
         return   next(
                new ErrorClass(
                    "Access Denied: You can only update your own account",
                    403,
                    req.user._id,
                    "error exist in update ",      
                )
             )
        }
          // Check if the new email is already  used
        if (email && email !== user.email) {
            const emailExists = await userModel.findOne({ email });
            if (emailExists) return res.status(400).send('Email already in use');
            user.email = email;
        }


         // Check if the new mobile number is already  used
         if (mobileNumber && mobileNumber !== user.mobileNumber) {
            const mobileNumberExists = await userModel.findOne({ mobileNumber });
            if (mobileNumberExists) return res.status(400).send('Mobile number already in use');
            user.mobileNumber = mobileNumber;
        }
     res.status(200).json({message:"Account updated successfully"})
    }


 ///////////////////api delete user///////////////////////////////////////////////////////
 /**
  * 
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  * @returns {message}
  * @description delete user
  */
 const deleteUser=async(req,res,next)=>{    
        // check if user login or not
        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).send('User not found');
         // Ensure the user is deleting their own account
      
         if (req.user._id != req.params.id) {
         
            next(
                new ErrorClass(
                    "'Access Denied: You can only delete your own account",
                    404,
                    (req.user._id),
                    "error exist in delete user ",
                   
                )
             )

        }
        
        const users=await userModel.deleteOne({})
        res.status(200).json({message:"deleted success"})
      
    }
 
 ////////////////////////// api for Get user account data ///////////////////////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,user}
 * @description api for Get user account data
 */
 const getProfile=async(req,res,next)=>{
        // Find the user by ID to check if user logged in or not
        const user = await userModel.findById(req.user._id).select('-password'); // Exclude the password field
        if (!user){
            //  return res.status(404).send('User not found');
            next(
                new ErrorClass(
                    "User not found",
                    404,
                    (req.user._id),
                    "error exist api for get user account data",
                   
                )
             )

        }
        res.send(user);
        
    }

/////////////////////////////api for get another user profile data/////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,user}
 * @description get another user profile data
 */
const anotherProfile=async(req,res,next)=>{
        const userId = req.params.userId;
        // Find the user by ID
        const user = await userModel.findById(userId).select('-password'); // Exclude the password field
        if (!user) {
            return   next(
                new ErrorClass(
                    "User not found",
                    404,
                    (req.user._id),
                    "error exist api for get another profile data",       
                )
             )
        }
        res.status(200).json({message:"success",user});
    } 
//////////////////////////// api for  Forget password route/////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message}
 * @description  Forget password route
 */
const forgetPassword=async(req,res,next)=>{
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
              next(
                new ErrorClass(
                    "User with this email does not exist",
                    400,
                    (email),
                    "error exist api forget passsword",       
                )
             )
        }
        // Generate OTP
        const otp = crypto.randomBytes(3).toString('hex');
        console.log(otp);
        userModel.otp = otp;
        userModel.otpExpires = Date.now() + 3600000; // 1 hour
    
        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {  
                user: "hajrnady24@gmail.com",
                pass: "xjcm erzk rjih razm"
            },
        });
        const mailOptions = {
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting password is ${otp}. It is valid for 1 hour.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error){
                return   next(
                    new ErrorClass(
                        "Error sending OTP email",
                        400,
                        (error),
                        "error exist api forget passsword",       
                    )
                 )
            }
            res.send('OTP sent to your email');
        });
    } 

////////////////////////////// update password/////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message}
 * @description update password
 */
const updatePassword=async(req,res,next)=>{
    
        const { email, otp, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).send('Invalid email');

        if (userModel.otp != otp || userModel.otpExpires < Date.now()) {
         return  next(
            new ErrorClass(
                "Invalid or expired OTP",
                400,
                ([email,otp,newPassword]),
                "error exist api update passsword",       
            )
         )

        }
        // Reset password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.json('Password has been updating successfully');
    } 















export{
    signUp,
    signIn,
    updateUser,
    deleteUser,
    getProfile,
    anotherProfile,
    forgetPassword,
    updatePassword
   
}
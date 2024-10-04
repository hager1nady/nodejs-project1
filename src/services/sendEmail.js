

import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { emailHtml } from './emailHTML.js';
export const sendEmails=async(email)=>{
const transporter = nodemailer.createTransport({
service:"gmail",
  auth: {
    user: "hajrnady24@gmail.com",
    pass: "xjcm erzk rjih razm",
  },
});
jwt.sign({email},'hager',async(err,token)=>{
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"route course👻" <hajrnady24@gmail.com>',
      to: email, 
      subject: "fawaqy ya hager",
      html: emailHtml(token), 
    });
    console.log("Message sent: %s", info.messageId);
})
}






import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const hashString = async (userValue)=>{
    const salt= await bcrypt.genSalt(10);
    const hashPassword=bcrypt.hash(userValue,salt);
    return hashPassword;
}
export const CompareString = async (userPassword,password)=>{
    try{
        const isMatch=await bcrypt.compare(userPassword, password);
        return isMatch;
    }
    catch(err){
        console.log(err);
    }
}

export const createJWT=async(id)=>{
    return jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:'1d'});
}


// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send OTP via email (using nodemailer)
export const sendOTPEmail = async (email, otp) => {
    try {
      console.log('Attempting to send OTP email to:', email);
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      };
    
      const info = await transporter.sendMail(mailOptions);
      console.log('OTP Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error in sendOTPEmail:', error);
      throw error;
    }
  };

// Send invitation email to join a family
export const sendInvitationEmail = async (email, familyName, link) => {
  try {
    // Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email template
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Invitation to Join ${familyName} on Finance Manager`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">Family Finance Invitation</h2>
          <p>Hello,</p>
          <p>You've been invited to join <strong>${familyName}</strong> on Finance Manager!</p>
          <p>As a family member, you'll be able to:</p>
          <ul>
            <li>View and manage shared expenses</li>
            <li>Participate in family budgeting</li>
            <li>Track shared financial goals</li>
            <li>Collaborate on financial decisions</li>
          </ul>
          <p>Click the button below to accept the invitation and join the family:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${link}" 
               style="background-color: #10b981; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px;
                      font-weight: bold;
                      display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #7f8c8d; font-size: 0.9em;">
            This link will expire in 7 days. If you don't have an account, you will be asked to create one.
          </p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #7f8c8d; font-size: 0.8em; text-align: center;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
};
import Users from "../models/userModel.js";
import {
  CompareString,
  createJWT,
  generateOTP,
  hashString,
  sendOTPEmail,
} from "../utils/index.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      occupation,
      annualIncome,
      maritalStatus,
      dependents,
      ownHome,
      ownCar,
      healthConditions,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    // Validate the password here
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must contain at least one number, one uppercase letter, one lowercase letter, and be between 8 and 16 characters long.",
      });
    }

    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    await sendOTPEmail(email, otp);

    const hashPassword = await hashString(password); // Hash the validated password
    const user = new Users({
      name,
      email,
      password: hashPassword,
      phone,
      dateOfBirth,
      occupation,
      annualIncome,
      maritalStatus,
      dependents,
      ownHome,
      ownCar,
      healthConditions,
      otp,
      otpExpires,
    });

    const token = await createJWT(user?.id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const passwordMatch = await CompareString(password, user?.password);
    if (!passwordMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    if (user?.isVerified === false) {
      return res.status(400).json({ msg: "User not verified" });
    }
    const token = await createJWT(user?.id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Please provide email and OTP" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // OTP is valid, clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    const token = await createJWT(user?.id);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. User logged in.",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const {
      name,
      email,
      phone,
      dateOfBirth,
      occupation,
      annualIncome,
      maritalStatus,
      dependents,
      ownHome,
      ownCar,
      healthConditions,
    } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.occupation = occupation || user.occupation;
    user.annualIncome = annualIncome || user.annualIncome;
    user.maritalStatus = maritalStatus || user.maritalStatus;
    user.dependents = dependents || user.dependents;
    user.ownHome = ownHome || user.ownHome;
    user.ownCar = ownCar || user.ownCar;
    user.healthConditions = healthConditions || user.healthConditions;
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

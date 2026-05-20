import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },  // Add this line
  dateOfBirth: { type: Date },
  occupation: { type: String },
  annualIncome: { type: Number },
  maritalStatus: { type: String },
  dependents: { type: Number },
  ownHome: { type: Boolean },
  ownCar: { type: Boolean },
  healthConditions: [{ type: String }],
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
});

const Users = mongoose.model('User', userSchema);
export default Users;
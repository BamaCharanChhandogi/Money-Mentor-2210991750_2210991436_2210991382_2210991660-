import InsurancePolicy from '../models/InsurancePolicyModel.js';
import Users from '../models/userModel.js';
import { generateInsuranceRecommendation } from '../services/insuranceRecommendationService.js';
/**
 * Creates a new insurance policy record for the user.
 * 
 * @param {Object} req - Express request object with policy data.
 * @param {Object} res - Express response object.
 */
export const addInsurance = async (req, res) => {
  try {
    const policy = new InsurancePolicy({
      ...req.body,
      user: req.user._id,
    });
    await policy.save();
    res.status(201).send(policy);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getInsurance = async (req, res) => {
  try {
    const policies = await InsurancePolicy.find({ user: req.user._id });
    res.send(policies);
  } catch (error) {
    res.status(500).send();
  }
};
export const getSpecificInsurance = async (req, res) => {
  try {
    const policy = await InsurancePolicy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!policy) {
      return res.status(404).send();
    }
    res.send(policy);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateInsurance = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "provider",
    "coverageAmount",
    "premium",
    "endDate",
    "beneficiaries",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const policy = await InsurancePolicy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!policy) {
      return res.status(404).send();
    }

    updates.forEach((update) => (policy[update] = req.body[update]));
    await policy.save();
    res.send(policy);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const deleteInsurance = async (req, res) => {
  try {
    const policy = await InsurancePolicy.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!policy) {
      return res.status(404).send();
    }
    res.send(policy);
  } catch (error) {
    res.status(500).send();
  }
};
export const InsuranceRecommendation = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = {
      age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
      occupation: user.occupation,
      annualIncome: user.annualIncome,
      maritalStatus: user.maritalStatus,
      dependents: user.dependents,
      ownHome: user.ownHome,
      ownCar: user.ownCar,
      healthConditions: user.healthConditions
    };

    const recommendations = await generateInsuranceRecommendation(userProfile);
    res.json(recommendations);
  } catch (error) {
    console.error("Error generating insurance recommendations:", error);
    res.status(500).json({ message: "Error generating insurance recommendations", error: error.message });
  }
};

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

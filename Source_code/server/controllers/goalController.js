import Goal from "../models/Goal.js";
import FamilyGroup from "../models/familyGroupModel.js";

/**
 * Creates a new financial goal for a family group.
 * Ensures that the executing user is a member of the target family group.
 *
 * @param {Object} req - Express request object containing goal data
 * @param {Object} res - Express response object
 */
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, familyGroupId, icon } = req.body;

    // Validate family membership
    const family = await FamilyGroup.findOne({
      _id: familyGroupId,
      "members.user": req.user._id,
    });

    if (!family) {
      return res
        .status(403)
        .json({ message: "Not authorized for this family group" });
    }

    const goal = new Goal({
      name,
      targetAmount,
      deadline,
      familyGroup: familyGroupId,
      icon: icon || "Target",
      currentAmount: 0, // Initialize explicitly
    });

    await goal.save();
    res.status(201).json({ goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const { familyGroupId } = req.params;

    const goals = await Goal.find({ familyGroup: familyGroupId }).populate(
      "contributions.user",
      "name email",
    );

    res.status(200).json({ goals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Verify user is part of the family
    const family = await FamilyGroup.findOne({
      _id: goal.familyGroup,
      "members.user": req.user._id,
    });

    if (!family) {
      return res.status(403).json({ message: "Not authorized" });
    }

    goal.contributions.push({
      user: req.user._id,
      amount,
      date: new Date(),
    });

    goal.currentAmount += Number(amount);

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();
    res.status(200).json({ goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check authorization (Must be owner or admin of the family)
    const family = await FamilyGroup.findOne({
      _id: goal.familyGroup,
      "members.user": req.user._id,
      "members.role": { $in: ["owner", "admin"] },
    });

    if (!family) {
      return res
        .status(403)
        .json({ message: "Only household heads or admins can delete goals" });
    }

    await Goal.findByIdAndDelete(id);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

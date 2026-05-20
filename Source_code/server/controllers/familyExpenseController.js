// controllers/sharedExpenseController.js
import SharedExpense from "../models/sharedExpenseModel.js";
import FamilyGroup from "../models/familyGroupModel.js";

/**
 * Creates a new expense that is shared among the family group members.
 * Validates the family group membership before creating the expense record.
 * Generates an automatic split based on the selected split type.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const createSharedExpense = async (req, res) => {
  try {
    const { familyGroupId, amount, category, description, splitType, splits } =
      req.body;

    // Validate family group membership
    const family = await FamilyGroup.findOne({
      _id: familyGroupId,
      "members.user": req.user.id,
    });

    if (!family) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this family group",
      });
    }

    // Create shared expense
    const sharedExpense = new SharedExpense({
      familyGroup: familyGroupId,
      paidBy: req.user.id,
      amount,
      category,
      description,
      splitType,
      splits:
        splits ||
        family.members.map((member) => ({
          user: member.user,
          amount: splitType === "equal" ? amount / family.members.length : 0,
          status: "pending",
        })),
    });

    await sharedExpense.save();

    // Optional: Emit socket event if you want to keep it here
    if (req.io) {
      req.io
        .to(`family_${familyGroupId}`)
        .emit("shared_expense_created", sharedExpense);
    }

    res.status(201).json({
      success: true,
      sharedExpense,
    });
  } catch (error) {
    console.error("Error creating shared expense:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSharedExpenses = async (req, res) => {
  try {
    const { familyGroupId } = req.params;

    // Validate family group membership
    const family = await FamilyGroup.findOne({
      _id: familyGroupId,
      "members.user": req.user.id,
    });

    if (!family) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this family group",
      });
    }

    const sharedExpenses = await SharedExpense.find({
      familyGroup: familyGroupId,
    })
      .populate("paidBy", "name")
      .populate("splits.user", "name");

    res.status(200).json({
      success: true,
      sharedExpenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateSharedExpenseSplit = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { status } = req.body;

    const sharedExpense = await SharedExpense.findById(expenseId);

    if (!sharedExpense) {
      return res.status(404).json({
        success: false,
        message: "Shared expense not found",
      });
    }

    // Find the user's split and update status
    const userSplit = sharedExpense.splits.find(
      (split) => split.user.toString() === req.user.id,
    );

    if (!userSplit) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this expense split",
      });
    }

    userSplit.status = status;
    await sharedExpense.save();

    // Emit socket event
    req.io
      .to(`family_${sharedExpense.familyGroup}`)
      .emit("shared_expense_split_updated", sharedExpense);

    res.status(200).json({
      success: true,
      sharedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteSharedExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await SharedExpense.findById(expenseId);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    const family = await FamilyGroup.findById(expense.familyGroup);
    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family group not found" });
    }

    // Check permissions: Owner of family OR Creator of expense
    const isFamilyOwner = family.owner.toString() === req.user.id;
    const isExpenseCreator = expense.paidBy.toString() === req.user.id;

    if (!isFamilyOwner && !isExpenseCreator) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this expense",
        });
    }

    await SharedExpense.findByIdAndDelete(expenseId);

    // Emit socket event
    // if (req.io) {
    //   req.io.to(`family_${family._id}`).emit('shared_expense_deleted', expenseId);
    // }

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

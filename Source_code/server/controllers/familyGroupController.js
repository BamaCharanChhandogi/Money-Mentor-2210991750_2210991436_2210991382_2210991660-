import FamilyGroup from "../models/familyGroupModel.js";
import Users from "../models/userModel.js";
import { sendInvitationEmail } from "../utils/index.js";
import crypto from "crypto";

/**
 * Intializes a new family group and sets the current user as the owner.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const createFamily = async (req, res) => {
  try {
    const { name } = req.body;
    const newFamilyGroup = new FamilyGroup({
      name,
      owner: req.user.id,
      members: [{ user: req.user.id, role: "owner", status: "active" }],
    });
    await newFamilyGroup.save();

    // Populate user details
    await newFamilyGroup.populate("members.user", "name email");

    res.status(201).json({ success: true, family: newFamilyGroup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all families for a user
export const getFamilies = async (req, res) => {
  try {
    const families = await FamilyGroup.find({
      "members.user": req.user.id,
    }).populate("members.user", "name email");

    res.status(200).json({ success: true, families });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Invite a member to family
export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { familyId } = req.params;

    const family = await FamilyGroup.findById(familyId);
    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found" });
    }

    // Check if user is already a member (look up user by email first)
    const userToInvite = await Users.findOne({ email });
    if (userToInvite) {
      const isAlreadyMember = family.members.some(
        (m) => m.user.toString() === userToInvite._id.toString(),
      );
      if (isAlreadyMember) {
        return res
          .status(400)
          .json({
            success: false,
            message: "User is already a member of this household",
          });
      }
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Add to invitations
    // Remove old invites for this email
    family.invitations = family.invitations.filter(
      (inv) => inv.email !== email,
    );

    family.invitations.push({
      email,
      token,
      status: "pending",
      expiresAt,
    });

    await family.save();

    // Construct Link
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const link = `${clientUrl}/join-family?token=${token}&familyId=${family._id.toString()}`;

    // Log for debugging (in case email isn't received in dev)
    console.log("--- Family Invitation Link ---");
    console.log(`Email: ${email}`);
    console.log(`Link: ${link}`);
    console.log("------------------------------");

    // Send invitation email
    await sendInvitationEmail(email, family.name, link);

    res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
      inviterName: req.user.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify and Join Family
export const joinFamily = async (req, res) => {
  try {
    const { token, familyId } = req.body;

    const family = await FamilyGroup.findById(familyId);
    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found" });
    }

    // Find invitation
    const invitation = family.invitations.find(
      (inv) => inv.token === token && inv.status === "pending",
    );

    if (!invitation) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired invitation" });
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = "expired";
      await family.save();
      return res
        .status(400)
        .json({ success: false, message: "Invitation expired" });
    }

    // Check if user is already a member
    const isMember = family.members.some(
      (m) => m.user.toString() === req.user.id,
    );
    if (isMember) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are already a member of this family",
        });
    }

    // Add member
    family.members.push({
      user: req.user.id,
      role: "member",
      status: "active",
    });

    // Update invitation status
    invitation.status = "accepted";

    await family.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Joined family successfully",
        familyName: family.name,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Accept family invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { familyId } = req.body;

    const family = await FamilyGroup.findOne({
      _id: familyId,
      "members.user": req.user.id,
      "members.status": "pending",
    });

    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Invitation not found" });
    }

    // Update member status
    const memberIndex = family.members.findIndex(
      (member) => member.user.toString() === req.user.id,
    );
    family.members[memberIndex].status = "active";

    await family.save();
    await family.populate("members.user", "name email");

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get family details
export const getFamilyDetails = async (req, res) => {
  try {
    const { familyId } = req.params;

    const family = await FamilyGroup.findOne({
      _id: familyId,
      "members.user": req.user.id,
    }).populate("members.user", "name email");

    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found" });
    }

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update family settings
export const updateFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    const { name } = req.body;

    const family = await FamilyGroup.findOne({
      _id: familyId,
      "members.user": req.user.id,
      "members.role": { $in: ["owner", "admin"] },
    });

    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found or unauthorized" });
    }

    family.name = name;
    await family.save();
    await family.populate("members.user", "name email");

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove member from family
export const removeMember = async (req, res) => {
  try {
    const { familyId, memberId } = req.params;

    const family = await FamilyGroup.findOne({
      _id: familyId,
      "members.user": req.user.id,
      "members.role": { $in: ["owner", "admin"] },
    });

    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found or unauthorized" });
    }

    // Cannot remove owner
    const memberToRemove = family.members.find(
      (member) => member.user.toString() === memberId,
    );
    if (memberToRemove?.role === "owner") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot remove owner" });
    }

    family.members = family.members.filter(
      (member) => member.user.toString() !== memberId,
    );

    await family.save();
    await family.populate("members.user", "name email");

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete family group
export const deleteFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    const family = await FamilyGroup.findById(familyId);

    if (!family) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found" });
    }

    // Check if user is owner
    if (family.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the family head can delete the family",
        });
    }

    await FamilyGroup.findByIdAndDelete(familyId);

    res
      .status(200)
      .json({ success: true, message: "Family deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

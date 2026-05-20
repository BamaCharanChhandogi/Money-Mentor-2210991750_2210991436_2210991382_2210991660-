
import mongoose from 'mongoose';
import FamilyGroup from './models/familyGroupModel.js';
import User from './models/userModel.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const verifyInviteWorkflow = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Get a test user (owner)
        const owner = await User.findOne();
        if (!owner) {
            console.log('No users found. Create a user first.');
            process.exit(0);
        }

        // 2. Create or Find a Family
        let family = await FamilyGroup.findOne({ owner: owner._id });
        if (!family) {
            family = new FamilyGroup({
                name: 'Test Family',
                owner: owner._id,
                members: [{ user: owner._id, role: 'owner' }]
            });
            await family.save();
            console.log('Created test family:', family._id);
        } else {
            console.log('Using existing family:', family._id);
        }

        // 3. Simulate Invite
        const testEmail = `test.invite.${Date.now()}@example.com`;
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        family.invitations.push({
            email: testEmail,
            token,
            status: 'pending',
            expiresAt
        });
        await family.save();
        console.log(`Simulated invite for ${testEmail} with token: ${token}`);

        // 4. Test Join Logic (Pre-check)
        // Ensure invite is in DB
        const updatedFamily = await FamilyGroup.findById(family._id);
        const invite = updatedFamily.invitations.find(i => i.token === token);
        if (!invite) throw new Error('Invite not saved');
        console.log('Invite verified in DB');

        // 5. Clean up
        // updatedFamily.invitations = updatedFamily.invitations.filter(i => i.token !== token);
        // await updatedFamily.save();
        // console.log('Cleaned up test invite');

        console.log('Verification Success: Database schema supports invitations.');
    } catch (error) {
        console.error('Verification Failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

verifyInviteWorkflow();

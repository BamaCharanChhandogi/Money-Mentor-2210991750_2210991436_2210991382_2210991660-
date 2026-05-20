// routes/familyGroupRoutes.js
import express from 'express';
import { 
  createFamily,
  getFamilies,
  getFamilyDetails,
  inviteMember,
  removeMember,
  updateFamily,
  deleteFamily,
  joinFamily
} from '../controllers/familyGroupController.js';

import auth from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', auth, createFamily);
router.get('/', auth, getFamilies); // New route for fetching all families
router.get('/:familyId', auth, getFamilyDetails);
router.post('/:familyId/members', auth, inviteMember);
router.delete('/:groupId/members/:memberId', auth, removeMember);
router.patch('/:familyId', auth, updateFamily);
router.delete('/:familyId', auth, deleteFamily);
router.post('/join', auth, joinFamily);


export default router;
import express from 'express';
import { registerUser, loginUser, fetchUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/fetch-users', protect, fetchUsers);

export default router;

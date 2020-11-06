import { Router } from 'express';
const router = Router();

// Middlewares Auth
import { verifyAuth } from '../middlewares/auth';

// Routs user
import {
	login,
	register,
	updateUser,
	changeEmail,
	resetPassword,
	verifyEmail,
	deleteUser,
	deleteUserMaster,
} from '../controllers/user';

// Login user ---- /api/user/login
router.post('/user/login', login);
// Register user ---- /api/user/register
router.post('/user/register', register);
// Update user ---- /api/user
router.put('/user', verifyAuth, updateUser);
// Change email ---- /api/user/changeEmail
router.put('/user/changeEmail', verifyAuth, changeEmail);
// Reset password ---- /api/user/resetPassword
router.put('/user/resetPassword', resetPassword);
// Verify email ---- /api/user/verifyEmail
router.put('/user/verifyEmail', verifyEmail);
// Delete user ---- /api/user/
router.delete('/user', verifyAuth, deleteUser);

// Delete user ---- /api/user/:id/master
router.delete('/user/:id/master', deleteUserMaster);

export default router;

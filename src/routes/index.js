import { Router } from 'express';
const router = Router();

// Middlewares Auth
import { verifyAuth } from '../middlewares/auth';

// Routs user
import {
	login,
	register,
	updateUser,
	deleteUser,
  deleteUserMaster,
  resetPassword,
  test
} from '../controllers/user';

// Login user ---- /api/user/login
router.post('/user/login', login);
// Register user ---- /api/user/register
router.post('/user/register', register);
// Update user ---- /api/user
router.put('/user', verifyAuth, updateUser);
// Delete user ---- /api/user/
router.delete('/user', verifyAuth, deleteUser);
// Reset password ---- /api/user/resetPassword/:email
router.put('/user/resetPassword/:email', resetPassword);


router.get('/', test);
// Delete user ---- /api/user/:id/master
router.delete('/user/:id/master', deleteUserMaster);

// Routs group
import {
	listGroup,
	createGroup,
	updateGroup,
	deleteGroup,
} from '../controllers/group';

// List group ---- /api/group
// router.get('/group', verifyAuth, listGroup);
// Create group ---- /api/group/
router.post('/group', verifyAuth, createGroup);
// Update group ---- /api/group/groupId
router.put('/group/:id', verifyAuth, updateGroup);
// Delete group ---- /api/group/groupId
router.delete('/group/:id', verifyAuth, deleteGroup);

// import { readProjects, createProject, getOneProject, updateProject, deleteProject } from "../controllers/project";

// // Read projects ---- /api/project
// router.get( '/project', readProjects );
// // Create new project ---- /api/project
// router.post( '/project', createProject );
// // Read one project ---- /api/project/projectId
// router.get( '/project/:id', getOneProject );
// // Update project ---- /api/project/projectId
// router.put( '/project/:id', updateProject );
// // Delete project ---- /api/project/projectId
// router.delete( '/project/:id', deleteProject );

export default router;

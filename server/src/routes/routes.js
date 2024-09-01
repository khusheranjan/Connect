import express from 'express';
import { login, profile, register } from '../controllers/userController.js';
import autheticated from '../middlewares/authMiddleware.js';

const router= express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/profile').post(autheticated, profile)

export default router;
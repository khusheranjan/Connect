import express from 'express';
import { login, profile, register } from '../controllers/userController.js';

const router= express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/profile').post(profile)

export default router
import express from 'express'
import { register, sendCode, verifyCode } from '../controllers/authController.js';

const router = express.Router();


router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.post("/register", register);

export default router;
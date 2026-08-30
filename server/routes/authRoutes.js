import express from 'express'
import { register, sendCode, verifyCode, checkAuth } from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();


router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.post("/register", register);
router.get("/me", protect, checkAuth);

export default router;
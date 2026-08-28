import {Route} from 'express'
import { register, sendCode, verifyCode } from '../controllers/authController';

const router = Route();


router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.post("/register", register);

export default router;
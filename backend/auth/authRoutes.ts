import { Router } from "express";
import { authenticateUser, googleAuthLogin, logout } from "./authController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

router.get("/user", authenticateToken, authenticateUser);
router.post("/google", googleAuthLogin);
router.post("/logout", logout);

export default router;

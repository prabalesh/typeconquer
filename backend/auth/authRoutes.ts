import { Router } from "express";
import { googleAuthLogin } from "./authController";

const router = Router();

router.post("/google", googleAuthLogin);

export default router;

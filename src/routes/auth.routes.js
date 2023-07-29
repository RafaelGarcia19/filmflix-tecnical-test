import { Router } from "express";
import { register, login, registerAdmin } from "../controllers/auth.controller";
const router = Router();

router.post("/login", login);

router.post("/register", register);

router.post("/register/admin", registerAdmin);

export default router;

import { Router } from "express";
import { register, login, registerAdmin } from "../controllers/auth.controller";
import {isAuth, isAdmin } from '../middlewares'
const router = Router();

router.post("/login", login);

router.post("/register", register);

router.post("/register/admin",[isAuth, isAdmin] , registerAdmin);

export default router;

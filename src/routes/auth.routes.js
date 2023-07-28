import { Router } from "express";
import { register } from "../controllers/auth.controller";
const router = Router();

router.get("/login", (req, res) => {
  res.json("Login user");
});

// register
router.post("/register", register);

export default router;

import { Router } from "express";
import {
  getAllUsers,
  addLikedMovie,
  removeLikedMovie,
} from "../controllers/users.controller";
import { isAdmin, isAuth } from "../middlewares";
const router = Router();

router.get("/allusers", [isAuth, isAdmin], getAllUsers);
router.post("/addlikedmovie", isAuth, addLikedMovie);
router.post("/removelikedmovie", isAuth, removeLikedMovie);

export default router;

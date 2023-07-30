import { Router } from "express";
import { isAdmin, isAuth, upload } from "../middlewares";
const router = Router();

import * as moviesCtrl from "../controllers/movies.controller";

router.get("/", moviesCtrl.getMovies);
router.post("/", [upload.array("images", 5)], moviesCtrl.createMovie);
router.get("/:movieId", moviesCtrl.getMovieById);
router.put("/:movieId", [isAuth, isAdmin], moviesCtrl.updateMovieById);
router.delete("/:movieId", [isAuth, isAdmin], moviesCtrl.deleteMovieById);

export default router;

import { Router } from "express";
import { isAdmin, isAuth, upload } from "../middlewares";
const router = Router();

import * as moviesCtrl from "../controllers/movies.controller";

router.get("/", moviesCtrl.getMovies);
router.get("/admin", [isAuth, isAdmin], moviesCtrl.getMoviesAdmin);
router.post(
  "/",
  [upload.array("images", 5), isAuth, isAdmin],
  moviesCtrl.createMovie
);
router.get("/:movieId", moviesCtrl.getMovieById);
router.get("/name/:movieName", moviesCtrl.getMovieByName);
router.put(
  "/:movieId",
  [upload.array("images", 5), isAuth, isAdmin],
  moviesCtrl.updateMovieById
);
router.delete("/:movieId", [isAuth, isAdmin], moviesCtrl.deleteMovieById);

export default router;

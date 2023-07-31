import { Router } from "express";
import { isAuth, isAdmin} from "../middlewares";
const router = Router();

import * as rentMoviesCtrl from "../controllers/rentmovies.controller";

router.post("/rent", [isAuth], rentMoviesCtrl.rentMovie);
router.post("/return", [isAuth], rentMoviesCtrl.returnMovie);
router.get("/active", [isAuth, isAdmin], rentMoviesCtrl.getAllActiveRentMovies);

export default router;

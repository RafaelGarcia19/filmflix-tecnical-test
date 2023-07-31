import { Router } from "express";
import { isAuth} from "../middlewares";
const router = Router();

import * as rentMoviesCtrl from "../controllers/rentmovies.controller";

router.post("/rent", [isAuth], rentMoviesCtrl.rentMovie);

export default router;

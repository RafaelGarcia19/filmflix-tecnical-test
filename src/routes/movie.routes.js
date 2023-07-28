import {Router} from 'express';
const router = Router();

import * as moviesCtrl from '../controllers/movies.controller';

router.get('/', moviesCtrl.getMovies);
router.post('/', moviesCtrl.createMovie);
router.get('/:movieId', moviesCtrl.getMovieById);
router.put('/:movieId', moviesCtrl.updateMovieById);
router.delete('/:movieId', moviesCtrl.deleteMovieById);

export default router;
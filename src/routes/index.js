import {Router} from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';
import rentMovieRoutes from './rentmovie.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/rent-movies', rentMovieRoutes);

export default router;


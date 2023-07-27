import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.json('Get all movies');
});

export default router;
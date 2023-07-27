import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.json('Get all users');
});

export default router;
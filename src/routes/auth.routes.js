import {Router} from 'express';
const router = Router();

router.get('/login', (req, res) => {
    res.json('Login user');
});

export default router;
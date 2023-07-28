import {Router} from 'express';
import {getAllUsers} from '../controllers/users.controller';
const router = Router();

router.get('/', (req, res) => {
    res.json('Get all users');
});

router.get('/allusers', getAllUsers);


export default router;
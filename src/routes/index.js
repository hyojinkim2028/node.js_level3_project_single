import express from 'express';

import UsersRouter from './users.router.js';
import GoodsRouter from './goods.router.js';

const router = express.Router();

router.use('/', UsersRouter);
router.use('/goods', GoodsRouter);

export default router;

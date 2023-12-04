import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { GoodsController } from '../controllers/goods.controller.js';

import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

const goodsController = new GoodsController();

// 상품 전체조회
router.get('/', goodsController.getGoods);

// 상품 등록
router.post('/', authMiddleware, goodsController.createGoods);

// 상품 상세조회
router.get('/:goodsId', goodsController.findGoodsById);

// 상품수정
router.put('/:goodsId', authMiddleware, goodsController.updateGoods);

// 상품 삭제
router.delete('/:goodsId', authMiddleware, goodsController.deleteGoods)

export default router;

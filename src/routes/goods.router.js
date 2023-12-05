import express from 'express';
import { GoodsController } from '../controllers/goods.controller.js';

import { isLoggedIn } from '../middlewares/auth-middleware.js';

const router = express.Router();

const goodsController = new GoodsController();

// 상품 전체조회
router.get('/', goodsController.getGoods);

// 상품 등록
router.post('/', isLoggedIn, goodsController.createGoods);

// 상품 상세조회
router.get('/:goodsId', goodsController.findGoodsById);

// 상품수정
router.put('/:goodsId', isLoggedIn, goodsController.updateGoods);

// 상품 삭제
router.delete('/:goodsId', isLoggedIn, goodsController.deleteGoods);

export default router;

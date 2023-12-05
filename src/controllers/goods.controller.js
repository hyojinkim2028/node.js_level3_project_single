import { GoodsService } from '../services/goods.service.js';

export class GoodsController {
  goodsService = new GoodsService();

  // 상품 전체 조회
  getGoods = async (req, res, next) => {
    try {
      const goodsList = await this.goodsService.findAllGoods();

      res
        .status(200)
        .json({ Message: '전체 상품 조회 완료! ', data: goodsList });
    } catch (error) {
      next(error);
    }
  };

  // 상품 생성
  createGoods = async (req, res, next) => {
    try {
      const userId = req.user;
      const { goods, content, status } = req.body;

      // 정상 입력된 경우 상품 생성됨
      const createGoods = await this.goodsService.createGoods(
        goods,
        content,
        userId,
        status
      );

      res.status(201).json({ Message: '상품 등록 완료!', data: createGoods });
    } catch (error) {
      next(error);
    }
  };

  // 상품 상세 조회
  findGoodsById = async (req, res, next) => {
    try {
      // 조회할 상품 아이디
      const { goodsId } = req.params;
      const goods = await this.goodsService.findGoodsById(goodsId);
      if (!goods) throw new Error(`${goodsId}번 상품은 없는 상품입니다.`);
      res
        .status(200)
        .json({ Message: `${goodsId}번 상품 조회 완료`, data: goods });
    } catch (error) {
      next(error);
    }
  };

  // 상품 수정
  updateGoods = async (req, res, next) => {
    try {
      const userId = req.user;
      const { goodsId } = req.params;

      // 수정할 내용
      const { goods, content, status } = req.body;
      const updateGoods = await this.goodsService.updateGoods(
        userId,
        goodsId,
        goods,
        content,
        status
      );

      return res
        .status(200)
        .json({ Message: `${goodsId}번 상품 수정 완료`, data: updateGoods });
    } catch (error) {
      next(error);
    }
  };

  // 상품 삭제
  deleteGoods = async (req, res, next) => {
    try {
      const userId = req.user;
      const { goodsId } = req.params;

      // 삭제할 내용
      const deleteGoods = await this.goodsService.deleteGoods(userId, goodsId);

      return res
        .status(200)
        .json({ Message: `${goodsId}번 상품 삭제 완료`, data: deleteGoods });
    } catch (error) {
      next(error);
    }
  };
}

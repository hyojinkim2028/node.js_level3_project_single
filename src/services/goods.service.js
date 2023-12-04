import { GoodsRepository } from '../repositories/goods.repository.js';

export class GoodsService {
  goodsRepository = new GoodsRepository();

  // 전체상품 조회
  findAllGoods = async () => {
    const goodsList = await this.goodsRepository.findAllGoods();

    goodsList.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return goodsList.map((goods) => {
      return {
        goodsId: goods.goodsId,
        goods: goods.goods,
        content: goods.content,
        status: goods.status,
        createdAt: goods.createdAt,
        UserId: goods.UserId,
      };
    });
  };

  // 상품생성
  createGoods = async (goods, content, userId, status) => {
    const createGoods = await this.goodsRepository.createGoods(
      goods,
      content,
      userId,
      status
    );

    return {
      goods: createGoods.goods,
      content: createGoods.content,
      userId: createGoods.userId,
      status: createGoods.status,
    };
  };

  // 상품 상세조회
  findGoodsById = async (goodsId) => {
    const goods = await this.goodsRepository.findGoodsById(goodsId);

    if (!goods) return;

    return {
      goodsId: goods.goodsId,
      goods: goods.goods,
      content: goods.content,
      status: goods.status,
      createdAt: goods.createdAt,
      UserId: goods.UserId,
    };
  };

  // 상품 수정
  updateGoods = async (userId, goodsId, goods, content, status) => {
    const findGoods = await this.goodsRepository.findGoodsById(goodsId);
    if (!findGoods) throw new Error('존재하지 않는 상품입니다.');
    if (userId !== findGoods.UserId)
      throw new Error('해당 상품의 판매자만 수정 가능합니다.');

    await this.goodsRepository.updateGoods(goodsId, goods, content, status);
    const updatedGoods = await this.goodsRepository.findGoodsById(goodsId);

    return {
      goodsId: updatedGoods.goodsId,
      goods: updatedGoods.goods,
      content: updatedGoods.content,
      status: updatedGoods.status,
      createdAt: updatedGoods.createdAt,
      UserId: updatedGoods.UserId,
    };
  };

  // 상품 삭제
  deleteGoods = async (userId, goodsId) => {
    const deleteGoods = await this.goodsRepository.findGoodsById(goodsId);
    if (!deleteGoods) throw new Error('존재하지 않는 상품입니다.');
    if (userId !== deleteGoods.UserId)
      throw new Error('해당 상품의 판매자만 삭제 가능합니다.');

    await this.goodsRepository.deleteGoods(goodsId);

    return {
      goodsId: deleteGoods.goodsId,
      goods: deleteGoods.goods,
      content: deleteGoods.content,
      status: deleteGoods.status,
      createdAt: deleteGoods.createdAt,
      UserId: deleteGoods.UserId,
    };
  };
}

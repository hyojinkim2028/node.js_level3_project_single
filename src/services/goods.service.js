import { GoodsRepository } from '../repositories/goods.repository.js';

export class GoodsService {
  goodsRepository = new GoodsRepository();

  // 전체상품 조회
  findAllGoods = async () => {
    const goodsList = await this.goodsRepository.findAllGoods();

    if (goodsList.length === 0) {
      const err = new Error('조회된 상품이 없습니다.');
      err.statusCode = 404;
      throw err;
    }

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
    // goods, content, status 중 하나라도 입력하지 않은 경우 오류 + 조기리턴
    if (!goods || !content || !status) {
      const err = new Error('상품 정보를 모두 작성해주세요.');
      err.statusCode = 400;
      throw err;
    }

    // 상품상태 FOR_SALE 또는 SOLD_OUT 이외의 값을 입력하면 오류 + 조기리턴
    if (status === 'FOR_SALE' || status === 'SOLD_OUT') {
      status = status;
    } else {
      const err = new Error(
        '상품 상태에는 FOR_SALE 또는 SOLD_OUT 만 입력할 수 있습니다.'
      );
      err.statusCode = 400;
      throw err;
    }

    const createGoods = await this.goodsRepository.createGoods(
      goods,
      content,
      userId,
      status.toUpperCase()
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

    if (!goods) {
      const err = new Error('조회된 상품이 없습니다.');
      err.statusCode = 404;
      throw err;
    }

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
    if (!findGoods) {
      const err = new Error('존재하지 않는 상품입니다.');
      err.statusCode = 404;
      throw err;
    }
 
    // 수정하려는 유저와 해당 상품을 등록한 유저가 다른 경우 오류 + 조기리턴
    if (userId !== findGoods.UserId) {
      const err = new Error('해당 상품의 판매자만 수정 가능합니다.');
      err.statusCode = 400;
      throw err;
    }

    // goods, content, status 중 하나라도 입력하지 않은 경우 오류 + 조기리턴
    if (!goods || !content || !status) {
      const err = new Error(
        '상품명, 작성 내용, 상품 상태를 모두 입력해주세요.'
      );
      err.statusCode = 400;
      throw err;
    }

        // 상품상태 FOR_SALE 또는 SOLD_OUT 이외의 값을 입력하면 오류 + 조기리턴
        if (status === 'FOR_SALE' || status === 'SOLD_OUT') {
          status = status;
        } else {
          const err = new Error(
            '상품 상태에는 FOR_SALE 또는 SOLD_OUT 만 입력할 수 있습니다.'
          );
          err.statusCode = 400;
          throw err;
        }

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

    if (!deleteGoods) {
      const err = new Error('존재하지 않는 상품입니다.');
      err.statusCode = 404;
      throw err;
    }

    if (userId !== deleteGoods.UserId) {
      const err = new Error('해당 상품의 판매자만 삭제 가능합니다.');
      err.statusCode = 400;
      throw err;
    }

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

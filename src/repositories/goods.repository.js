import { prisma } from '../utils/prisma/index.js';

export class GoodsRepository {
  // 전체 상품 조회
  findAllGoods = async () => {
    const goodsList = await prisma.goods.findMany();

    return goodsList;
  };

  // 상품 등록
  createGoods = async (goods, content, userId, status) => {
    const createGoods = await prisma.goods.create({
      data: {
        goods,
        content,
        UserId: userId,
        status: status,
      },
    });
    return createGoods;
  };

  // 상세 상품 조회
  findGoodsById = async (goodsId) => {
    const goods = await prisma.goods.findUnique({
      where: { goodsId: +goodsId },
    });

    return goods;
  };

  // 상품 수정
  updateGoods = async (goodsId, goods, content, status) => {
    const updatePost = await prisma.goods.update({
      where: { goodsId: +goodsId },
      data: {
        goods,
        content,
        status,
      },
    });
    return updatePost;
  };

  // 상품삭제
  deleteGoods = async (goodsId) => {
    const deleteGoods = await prisma.goods.delete({
      where: {
        goodsId: +goodsId,
      },
    });

    return deleteGoods;
  };
}

import express from 'express';
import { prisma } from '../utils/prisma/index.js';

import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

// 상품 전체조회
router.get('/goods', async (req, res) => {
  try {
    // 값이 없는 경우에는 최신순 정렬
    const sort = req.query.sort ? req.query.sort.toLowerCase() : 'desc';

    // ASC, DESC 둘 다 해당하지 않을 경우 최신순 정렬
    if (sort !== 'asc' && sort !== 'desc') {
      sort = 'desc';
    }

    const goodsList = await prisma.goods.findMany({
      select: {
        goodsId: true,
        goods: true,
        content: true,
        status: true,
        createdAt: true,
        UserId: true,
      },
      orderBy: {
        createdAt: sort, // 최신순 정렬이 디폴트
      },
    });

    // 존재하는 상품 없을시 조기 리턴
    if (goodsList.length === 0) {
      return res.status(404).send({
        errorMessage: '존재하는 상품이 없습니다.',
      });
    }

    res.send({ goodsList });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품 등록
router.post('/goods', authMiddleware, async (req, res) => {
  try {
    // const userId = res.locals.user.id;
    const { userId } = req.user;
    const { goods, content, status } = req.body;

    // 조회되는 user가 없는 경우(로그인이 안된 경우임) 오류 + 조기리턴
    if (!userId) {
      return res.status(400).send({
        errorMessage: '로그인을 해야 상품작성이 가능합니다.',
      });
    }

    // goods, content, status 중 하나라도 입력하지 않은 경우 오류 + 조기리턴
    if (!goods || !content || !status) {
      return res.status(400).send({
        errorMessage: '상품 정보를 모두 작성해주세요.',
      });
    }

    // 상품상태 for-sale 또는 sold-out 이외의 값을 입력하면 오류 + 조기리턴
    if (status === 'FOR_SALE' || status === 'SOLD_OUT') {
    } else {
      return res.status(400).send({
        errorMessage:
          '상품 상태에는 FOR_SALE 또는 SOLD_OUT 만 입력할 수 있습니다.',
      });
    }

    // 정상 입력된 경우 상품 생성됨
    await prisma.goods.create({
      data: { goods, content, UserId: userId, status },
    });

    res.status(201).send({ Message: '상품 등록 완료! ' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품 상세조회
router.get('/goods/:goodsId', async (req, res) => {
  try {
    // 조회할 상품 아이디
    const { goodsId } = req.params;

    // params에 들어온 아이디와 테이블에 저장된 아이디 일치하는 상품 조회
    const findGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });

    // 해당 상품 없는 경우 404 오류 반환
    if (!findGoods) {
      return res.status(404).send({
        errorMessage: '존재하지 않는 상품입니다.',
      });
    }

    // 해당하는 상품 상세정보 조회
    const goods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
      select: {
        goodsId: true,
        goods: true,
        content: true,
        status: true,
        createdAt: true,
        UserId: true,
      },
    });

    res.status(200).send(goods);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품수정
router.put('/goods/:goodsId', authMiddleware, async (req, res) => {
  try {
    // 로그인한 사용자 아이디
    const { userId } = req.user;

    // 조회할 상품 아이디
    const { goodsId } = req.params;

    // params에 들어온 아이디와 테이블에 저장된 아이디 일치하는 상품 조회
    const findGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });

    // 해당하는 상품 없으면 오류 + 조기리턴
    if (!findGoods) {
      return res.status(404).send({
        errorMessage: '해당하는 상품이 없습니다.',
      });
    }

    // 수정하려는 유저와 해당 상품을 등록한 유저가 다른 경우 오류 + 조기리턴
    if (userId !== findGoods.UserId) {
      return res.status(400).send({
        errorMessage: '해당 상품을 등록한 사용자만 수정 권한이 있습니다.',
      });
    }

    const { goods, content, status } = req.body;

    // goods, content, status 중 하나라도 입력하지 않은 경우 오류 + 조기리턴
    if (!goods || !content || !status) {
      return res.status(400).send({
        errorMessage: '상품명, 작성 내용, 상품 상태를 모두 입력해주세요.',
      });
    }

    // 상품상태 for-sale 또는 sold-out 이외의 값을 입력하면 오류 + 조기리턴
    if (status === 'FOR_SALE' || status === 'SOLD_OUT') {
    } else {
      return res.status(400).send({
        errorMessage:
          '상품 상태에는 FOR_SALE 또는 SOLD_OUT 만 입력할 수 있습니다.',
      });
    }

    // 오류 없는 경우 body로 가져온 데이터로 수정
    await prisma.goods.update({
      data: { goods, content, status },
      where: { goodsId: +goodsId },
    });
    res.status(201).send({ message: '상품 수정이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품 삭제
router.delete('/goods/:goodsId', authMiddleware, async (req, res) => {
  try {
    // 로그인한 사용자 아이디
    const { userId } = req.user;

    // 조회할 상품 아이디
    const { goodsId } = req.params;

    // params에 들어온 아이디와 테이블에 저장된 아이디 일치하는 상품 조회
    const findGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });

    // 해당하는 상품 없으면 오류 + 조기리턴
    if (!findGoods) {
      return res.status(404).send({
        errorMessage: '해당하는 상품이 없습니다.',
      });
    }

    // 삭제하려는 유저와 해당 상품을 등록한 유저가 다른 경우 오류 + 조기리턴
    if (userId !== findGoods.UserId) {
      return res.status(400).send({
        errorMessage: '해당 상품을 등록한 사용자만 삭제 권한이 있습니다.',
      });
    }

    // 오류 없는 경우 삭제
    await prisma.goods.delete({
      where: { goodsId: +goodsId },
    });
    res.status(200).send({ Message: '상품 삭제가 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

export default router;

const express = require('express');
const User = require('../models/user');
const Goods = require('../models/goods');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

// 상품 전체조회
router.get('/', async (req, res) => {
  try {
    const getGoods = await Goods.findAll({});

    // 존재하는 상품 없을시 조기 리턴
    if (getGoods.length === 0) {
      return res.status(404).send({
        errorMessage: '존재하는 상품이 없습니다.',
      });
    }

    // 값이 없는 경우에는 최신순 정렬
    const sort = req.query.sort ? req.query.sort.toUpperCase() : 'DESC';

    // ASC, DESC 둘 다 해당하지 않을 경우 최신순 정렬
    if (sort !== 'ASC' && sort !== 'DESC') {
      sort = 'DESC';
    }

    // 전체 조회
    const goods = await Goods.findAll({
      attributes: ['id', 'goods', 'content', 'status', 'createdAt'],
      order: [[['createdAt', sort]]],
      // User 테이블 join
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    res.send({ goods });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품 등록
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
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
    if (status === 'FOR-SALE' || status === 'SOLD-OUT') {
    } else {
      return res.status(400).send({
        errorMessage:
          '상품 상태에는 FOR-SALE 또는 SOLD-OUT 만 입력할 수 있습니다.',
      });
    }

    // 정상 입력된 경우 상품 생성됨
    await Goods.create({ goods, content, userId, status });

    res.status(201).send({ Message: '등록 완료! ' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품 상세조회
router.get('/:id', async (req, res) => {
  // params에 들어온 아이디와 테이블에 저장된 아이디 일치하는 상품 조회
  try {
    const getGoods = await Goods.findOne({
      attributes: ['id', 'goods', 'content', 'status', 'createdAt'],
      where: { id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // 해당 상품 없는 경우 오류 + 조기리턴
    if (!getGoods) {
      return res.status(404).send({
        errorMessage: '존재하지 않는 상품입니다.',
      });
    }

    res.status(200).send(getGoods);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품수정
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    // params에 들어온 아이디와 테이블에 저장된 아이디 일치하는 상품 조회
    const getGoods = await Goods.findOne({
      where: { id: req.params.id },
    });

    // 해당하는 상품 없으면 오류 + 조기리턴
    if (!getGoods) {
      return res.status(404).send({
        errorMessage: '해당하는 상품이 없습니다.',
      });
    }

    const { goods, content, status } = req.body;

    // goods, content, status 중 하나라도 입력하지 않은 경우 오류 + 조기리턴
    if (!goods || !content || !status) {
      return res.status(400).send({
        errorMessage: '상품명, 작성 내용, 상품 상태를 모두 입력해주세요.',
      });
    }

    // 수정하려는 유저와 해당 상품을 등록한 유저가 다른 경우 오류 + 조기리턴
    if (userId !== getGoods.userId) {
      return res.status(400).send({
        errorMessage: '해당 상품을 등록한 사용자만 수정 권한이 있습니다.',
      });
    }

    // 오류 없는 경우 body로 가져온 데이터로 수정
    await Goods.update(
      {
        goods: req.body.goods,
        content: req.body.content,
        status: req.body.status,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.status(201).send({ message: '상품 수정이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 상품 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;

    // 해당 id의 상품이 존재하는지 확인
    const getGoods = await Goods.findOne({
      where: { id: req.params.id },
    });

    // 조회된 상품 없는 경우 오류 + 조기리턴
    if (!getGoods) {
      return res.status(404).send({
        errorMessage: '해당하는 상품이 없습니다.',
      });
    }

    // 삭제하려는 유저와 해당 상품을 등록한 유저가 다른 경우 오류 + 조기리턴
    if (userId !== getGoods.userId) {
      return res.status(400).send({
        errorMessage: '해당 상품을 등록한 사용자만 삭제 권한이 있습니다.',
      });
    }

    // 오류 없는 경우 삭제
    await Goods.destroy({
      where: { id: req.params.id },
    });

    res.status(200).send({ Message: '상품 삭제가 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

module.exports = router;

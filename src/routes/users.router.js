import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

// 회원가입
router.post('/join', async (req, res) => {
  try {
    // 이미 로그인을 한 경우 에러메세지 + 종료
    if (res.locals.user) {
      return res.status(400).send({
        errorMessage: '이미 로그인된 유저입니다.',
      });
    }
    const { email, name, password, confirmPassword } = req.body;

    // 이메일 검증식 : 소문자 a~z 와 숫자 0~9까지 + @ + 소문자 a~z + . + 소문자 a~z (2~3 자리)의 형태로 가능
    let regex = new RegExp('[a-z0-9]+@[a-z]+.+[a-z]{2,3}');

    // 이메일 형식이 검증식을 통과 못할때 오류 + 조기리턴
    if (!regex.test(email)) {
      return res.status(400).send({
        errorMessage: '이메일 형식이 올바르지 않습니다.',
      });
    }

    // email 중복여부 확인
    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    // 중복된 이메일이면 오류 + 조기리턴
    if (isExistUser) {
      return res.status(400).send({
        errorMessage: '이메일이 이미 사용중입니다.',
      });
    }

    // 비밀번호가 확인비밀번호가 다르거나 비번 길이가 6자 미만일때 오류 + 조기리턴
    if (password !== confirmPassword || password.length < 6) {
      return res.status(400).send({
        errorMessage:
          '비밀번호 확인과 일치한 6자리 이상의 비밀번호를 입력해주세요.',
      });
    }

    // 오류가 없을 경우 비밀번호 hash 처리 하여 유저 생성
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    }); // 암호화된 비밀번호 저장
    res.status(201).send({
      Message: `회원가입이 정상적으로 처리되었습니다. 가입된 유저 정보 -> 이메일 : ${email}, 이름: ${name}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  // 이미 로그인을 한 경우 에러메세지 + 종료
  if (res.locals.user) {
    return res.status(400).send({
      errorMessage: '이미 로그인된 유저입니다.',
    });
  }

  try {
    const { email, password } = req.body;

    // 해당 이메일의 유저정보 있는지 확인
    const user = await prisma.users.findFirst({ where: { email } });

    // 해당하는 유저가 없는 경우
    if (!user)
      return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });

    // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

    const accessToken = jwt.sign(
      { id: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '12h',
      }
    );

    // 클라이언트에게 쿠키(토큰)를 할당
    res.cookie('accessToken', accessToken);

    res.json({ message: '로그인 성공', token: accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

// 인증 성공시 마이페이지 조회 가능
router.get('/users/me', authMiddleware, async (req, res) => {
  try {
    // 로그인한 사용자 아이디
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        name: true,
      },
    });
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: '서버오류' });
  }
});

export default router;

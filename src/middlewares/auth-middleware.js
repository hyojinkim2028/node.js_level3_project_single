import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../utils/prisma/index.js';

export default async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    console.log(accessToken);
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const { id } = decodedToken;
    const user = await prisma.users.findFirst({
      where: { userId: +id },
    });

    if (!user) {
      res.clearCookie('accessToken');
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    res.locals.user = user; // 해당 id의 유저정보 res.locals에 담아 어디서든 호출 가능
    // console.log(res.locals.user);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: `로그인 후 이용 가능한 기능입니다.`,
    });
  }
};

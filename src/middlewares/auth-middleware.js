import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function isLoggedIn(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (accessToken) {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const { id } = decodedToken;
      req.user = id;
      next();
    } else {
      res.status(403).send('로그인 정보가 없습니다.');
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(403).send('유효하지 않은 토큰 정보입니다.');
    } else next(err);
  }
}

async function isNotLoggedIn(req, res, next) {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      next();
    }

    if (accessToken) {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      if (decodedToken) {
        console.log(decodedToken);
        res.status(403).send('이미 로그인되어 있습니다.');
      } else next();
    }

    //JsonWebTokenError: invalid token
  } catch (err) {
    // 유효시간이 초과된 경우
    if (err.name === 'TokenExpiredError') {
      next();
      // 토큰 정보 불일치
    } else if (err.name === 'JsonWebTokenError') {
      next();
    } else {
      next(err);
    }
  }
}

export { isLoggedIn, isNotLoggedIn };

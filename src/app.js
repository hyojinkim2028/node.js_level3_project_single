import express from 'express';
import cookieParser from 'cookie-parser';

import usersRouter from '../src/routes/users.router.js';
import goodsRouter from '../src/routes/goods.router.js';

import errorHandlerMiddleware from '../src/middlewares/error.handler.middleware.js';
import logMiddleware from '../src/middlewares/log.middleware.js';

const app = express();
let PORT = process.env.PORT || 8000;

app.use(logMiddleware); // 로그 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', [usersRouter, goodsRouter]);

app.use(errorHandlerMiddleware); // 에러처리 미들웨어

app.listen(PORT, () => {
  console.log(PORT, ' 포트로 열렸습니다!');
});

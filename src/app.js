import express from 'express';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router'
import goodsRouter from './routes/goods.router'

import errorHandlerMiddleware from './middlewares/error.handler.middleware.js';
import logMiddleware from './middlewares/log.middleware';


const app = express()
let PORT = process.env.PORT || 8000;

app.use(logMiddleware) // 로그 미들웨어
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())


app.use('/api', [usersRouter,goodsRouter])

app.use(errorHandlerMiddleware); // 에러처리 미들웨어

app.listen(PORT, () => {
  console.log(PORT, ' 포트로 열렸습니다!')
})

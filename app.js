const express = require('express');

const { sequelize } = require('./models');
const usersRouter = require('./routes/users.router');
const goodsRouter = require('./routes/goods.router');

const app = express();
app.use(express.json());

// db연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use('/api/auth', usersRouter);
app.use('/api/goods', goodsRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err || {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(2000, () => {
  console.log('2000포트 열렸습니다!');
});

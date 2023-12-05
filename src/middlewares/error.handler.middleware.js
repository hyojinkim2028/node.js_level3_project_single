export default (error, req, res, next) => {
    console.log(error);

    error.statusCode = error.statusCode || 500;
    error.message = error.message || '서버오류';
    return res.status(error.statusCode).send({ errorMessage: error.message });
  };
  
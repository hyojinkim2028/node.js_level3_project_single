export default (error, req, res, next) => {
    console.log(error);
  
    return res
      .status(500)
      .json({ errorMessage: '서버에서 에러가 발생했습니다.' });
  };
  
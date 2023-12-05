import { UsersService } from '../services/users.service.js';

export class UsersController {
  usersService = new UsersService();

  join = async (req, res, next) => {
    try {
      if (req.cookies) {
        return res.status(400).send('이미 로그인되어 있는 상태입니다.');
      }
      const { email, name, password, confirmPassword } = req.body;

      const createUser = await this.usersService.join(
        email,
        name,
        password,
        confirmPassword
      );

      res.status(201).json({
        Message: `회원가입이 정상적으로 처리되었습니다.`,
        data: `이메일 : ${email}, 이름: ${name}`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ errorMessage: '서버오류' });
    }
  };

  login = async (req, res, next) => {
    // 이미 로그인을 한 경우 에러메세지 + 종료
    //   if (req.cookies) {
    //     return res.status(400).send({
    //       errorMessage: '이미 로그인된 유저입니다.',
    //     });
    //   }

    try {
      //   console.log('dfdf', res.locals.user);
      const { email, password } = req.body;

      const accessToken = await this.usersService.login(email, password);

      // 클라이언트에게 쿠키(토큰)를 할당
      res.cookie('accessToken', accessToken);

      res.json({ message: '로그인 성공', token: accessToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ errorMessage: '서버오류' });
    }
  };

  myPage = async (req, res, next) => {
    try {
      // 로그인한 사용자 아이디
      const { userId } = req.user;

      const user = await this.usersService.myPage(userId);

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ errorMessage: '서버오류' });
    }
  };
}

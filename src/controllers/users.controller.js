import { UsersService } from '../services/users.service.js';
export class UsersController {
  usersService = new UsersService();

  join = async (req, res, next) => {
    try {
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
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const accessToken = await this.usersService.login(email, password);

      // 클라이언트에게 쿠키(토큰)를 할당
      res.cookie('accessToken', accessToken);

      res.json({ message: '로그인 성공', token: accessToken });
    } catch (error) {
      next(error);
    }
  };

  logout = (req, res, next) => {
    try {
      res.clearCookie('accessToken');
      res.status(200).send('로그아웃 완료');
    } catch (error) {
      next(error);
    }
  };

  myPage = async (req, res, next) => {
    try {
      // 로그인한 사용자 아이디
      const userId = req.user;

      // 해당하는 유저 조회
      const user = await this.usersService.myPage(userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}

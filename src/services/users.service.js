import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { UsersRepository } from '../repositories/users.repository.js';

export class UsersService {
  usersRepository = new UsersRepository();

  join = async (email, name, password, confirmPassword) => {
    // 이메일 검증식 : 소문자 a~z 와 숫자 0~9까지 + @ + 소문자 a~z + . + 소문자 a~z (2~3 자리)의 형태로 가능
    let regex = new RegExp('[a-z0-9]+@[a-z]+.+[a-z]{2,3}');

    // 이메일 형식이 검증식을 통과 못할때 오류 + 조기리턴
    if (!regex.test(email)) {
      const err = new Error('이메일 형식이 올바르지 않습니다.');
      err.statusCode = 400;
      throw err;
    }

    // email 중복여부 확인
    const isExistUser = await this.usersRepository.findByUser(email);

    // 중복된 이메일이면 오류 + 조기리턴
    if (isExistUser) {
      const err = new Error('이메일이 이미 사용중입니다.');
      err.statusCode = 400;
      throw err;
    }

    // 비밀번호가 확인비밀번호가 다르거나 비번 길이가 6자 미만일때 오류 + 조기리턴
    if (password !== confirmPassword || password.length < 6) {
      const err = new Error(
        '비밀번호 확인과 일치한 6자리 이상의 비밀번호를 입력해주세요.'
      );
      err.statusCode = 400;
      throw err;
    }

    // 오류가 없을 경우 비밀번호 hash 처리 하여 유저 생성
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.usersRepository.join(
      email,
      name,
      (password = hashedPassword)
    );

    return {
      userId: createdUser.userId,
      email: createdUser.email,
      name: createdUser.name,
    };
  };

  login = async (email, password) => {
    // 해당 이메일의 유저정보 있는지 확인
    const user = await this.usersRepository.findByUser(email);

    // 해당하는 유저가 없는 경우
    if (!user) {
      const err = new Error('존재하지 않는 이메일입니다.');
      err.statusCode = 400;
      throw err;
    }

    // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교
    if (!(await bcrypt.compare(password, user.password))) {
      const err = new Error('비밀번호가 일치하지 않습니다.');
      err.statusCode = 400;
      throw err;
    }

    const accessToken = jwt.sign(
      { id: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '12h',
      }
    );

    return accessToken;
  };

  myPage = async (userId) => {
    const user = await this.usersRepository.myPage(userId);

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
    };
  };
}

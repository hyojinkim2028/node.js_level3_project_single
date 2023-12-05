import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  // 유저 조회
  findByUser = async (email) => {
    const isExistUser = await prisma.users.findUnique({
      where: { email: email },
    });

    return isExistUser;
  };

  // 회원가입
  join = async (email, name, password) => {
    const createdUser = await prisma.users.create({
      data: {
        email,
        name,
        password,
      },
    });
    return createdUser;
  };

  // 마이페이지
  myPage = async (userId) => {
    const user = await prisma.users.findUnique({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        name: true,
      },
    });
    return user;
  };
}

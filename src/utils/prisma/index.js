import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // prisma를 이용해 데이터베이스 접근할때, sql 출력해줌
  log: ['query', 'info', 'warn', 'error'],

  // 에러 메세지를 평문이 아닌, 개발자가 읽기 쉽게 출력해줌
  errorFormat: 'pretty',
}); // PrismaClient 인스턴스 생성

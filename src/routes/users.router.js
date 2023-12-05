import express from 'express';

import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth-middleware.js';
import { UsersController } from '../controllers/users.controller.js';

const router = express.Router();

// UsersController의 인스턴스 생성
const usersController = new UsersController();

// 회원가입
router.post('/join', isNotLoggedIn, usersController.join);

// 로그인
router.post('/login', isNotLoggedIn, usersController.login);

// 로그아웃
router.get('/logout', isLoggedIn, usersController.logout);

// 인증 성공시 마이페이지 조회 가능
router.get('/users/me', isLoggedIn, usersController.myPage);

export default router;

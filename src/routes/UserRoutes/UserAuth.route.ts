import express, { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../../controllers/user/userAuth.controller';
import authUserMiddleware from '../../middleware/authusermiddleware.middleware';

class UserRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/signup',
      [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phonenumber').notEmpty().withMessage('Phone number is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      ],
      UserController.registerUser
    );

    this.router.post(
      '/login',
      [
        body('password').notEmpty().withMessage('Password is required'),
        body('username').optional().notEmpty().withMessage('Username is required if provided'),
        body('email').optional().isEmail().withMessage('Valid email is required if provided'),
        body('phonenumber').optional().notEmpty().withMessage('Phone number is required if provided'),
      ],
      UserController.loginUser
    );

    this.router.get('/', UserController.getAllUsers);
    this.router.get('/currentuser', authUserMiddleware, UserController.getCurrentUser);
  }
}

export default new UserRoutes().router;

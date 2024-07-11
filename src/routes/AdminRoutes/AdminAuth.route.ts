import express, { Router } from 'express';
import { body } from 'express-validator';
import AdminController from '../../controllers/Admin/adminAuth.controller';
import authAdminMiddleware from '../../middleware/authAdmin.middleware';

class AdminRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Validation for signup route
    this.router.post(
      '/signup',
      [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phonenumber').notEmpty().withMessage('Phone number is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      ],
      AdminController.registerAdmin
    );

    this.router.post(
      '/login',
      [
        body('password').notEmpty().withMessage('Password is required'),
        body('username').optional().notEmpty().withMessage('Username is required if provided'),
        body('email').optional().isEmail().withMessage('Valid email is required if provided'),
        body('phonenumber').optional().notEmpty().withMessage('Phone number is required if provided'),
      ],
      AdminController.loginAdmin
    );

    this.router.get('/', AdminController.getAllAdmins);
    this.router.get('/currentadmin', authAdminMiddleware, AdminController.getCurrentUser);
  }
}

export default new AdminRoutes().router;

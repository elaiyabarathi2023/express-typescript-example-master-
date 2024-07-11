import { Router } from 'express';
import { body, param } from 'express-validator';
import CartController from '../controllers/cart.controller';

class CartRoutes {
  router = Router();
  cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/',
      [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('products').isArray().withMessage('Products must be an array of product objects'),
        body('products.*.productId').isMongoId().withMessage('Invalid product ID'),
        body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
      ],
      this.cartController.create
    );

    this.router.get('/', this.cartController.findAll);

    this.router.get(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid cart ID')],
      this.cartController.findOne
    );

    this.router.put(
      '/:id',
      [
        param('id').isMongoId().withMessage('Invalid cart ID'),
        body('userId').optional().isMongoId().withMessage('Invalid user ID'),
        body('products').optional().isArray().withMessage('Products must be an array of product objects'),
        body('products.*.productId').optional().isMongoId().withMessage('Invalid product ID'),
        body('products.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
      ],
      this.cartController.update
    );

    this.router.delete(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid cart ID')],
      this.cartController.delete
    );
  }
}

export default new CartRoutes().router;

import { Router } from 'express';
import { body, param } from 'express-validator';
import OrderController from '../controllers/order.controller';

class OrderRoutes {
  router = Router();
  orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/',
      this.orderController.create
    );

    this.router.get('/', this.orderController.findAll);

    this.router.get(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid order ID')],
      this.orderController.findOne
    );

    this.router.put(
      '/:id',
      [
        param('id').isMongoId().withMessage('Invalid order ID'),
        body('status').isIn(['ordered', 'cancelled']).withMessage('Invalid status'),
      ],
      this.orderController.update
    );

    this.router.delete(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid order ID')],
      this.orderController.delete
    );
  }
}

export default new OrderRoutes().router;

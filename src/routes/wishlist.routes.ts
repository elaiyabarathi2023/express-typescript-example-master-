import { Router } from 'express';
import { body, param } from 'express-validator';
import WishlistController from '../controllers/wishlist.controller';

class WishlistRoutes {
  router = Router();
  wishlistController = new WishlistController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/',
      [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('products').isArray().withMessage('Products must be an array of product IDs'),
        body('products.*').isMongoId().withMessage('Invalid product ID'),
      ],
      this.wishlistController.create
    );

    this.router.get('/', this.wishlistController.findAll);

    this.router.get(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid wishlist ID')],
      this.wishlistController.findOne
    );

    this.router.put(
      '/:id',
      [
        param('id').isMongoId().withMessage('Invalid wishlist ID'),
        body('userId').optional().isMongoId().withMessage('Invalid user ID'),
        body('products').optional().isArray().withMessage('Products must be an array of product IDs'),
        body('products.*').optional().isMongoId().withMessage('Invalid product ID'),
      ],
      this.wishlistController.update
    );

    this.router.delete(
      '/:id',
      [param('id').isMongoId().withMessage('Invalid wishlist ID')],
      this.wishlistController.delete
    );
  }
}

export default new WishlistRoutes().router;

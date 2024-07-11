import { Router } from 'express';
import { body, param } from 'express-validator';
import ProductCategoryController from '../controllers/productCategory.controller';

class ProductCategoryRoutes {
  router = Router();
  productCategoryController = new ProductCategoryController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/',
      [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('isActive').isBoolean().withMessage('isActive must be a boolean'),
      ],
      this.productCategoryController.createProductCategory
    );

    this.router.get('/', this.productCategoryController.getAllProductCategories);

    this.router.get(
      '/:productCategoryId',
      [param('productCategoryId').isMongoId().withMessage('Invalid product category ID')],
      this.productCategoryController.getProductCategory
    );

    this.router.put(
      '/:productCategoryId',
      [
        param('productCategoryId').isMongoId().withMessage('Invalid product category ID'),
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('description').optional().notEmpty().withMessage('Description is required'),
        body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
      ],
      this.productCategoryController.updateProductCategory
    );

    this.router.delete(
      '/:productCategoryId',
      [param('productCategoryId').isMongoId().withMessage('Invalid product category ID')],
      this.productCategoryController.deleteProductCategory
    );
  }
}

export default new ProductCategoryRoutes().router;

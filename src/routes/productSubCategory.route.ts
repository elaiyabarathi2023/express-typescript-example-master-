import { Router } from 'express';
import { body, param } from 'express-validator';
import ProductSubCategoryController from '../controllers/productSubCategory.controller';

class ProductSubCategoryRoutes {
  router = Router();
  controller = new ProductSubCategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('isActive').isBoolean().withMessage('isActive must be a boolean'),
        body('categoryId').isMongoId().withMessage('Invalid category ID'),
      ],
      this.controller.createProductSubCategory
    );

    this.router.get('/', this.controller.getAllProductSubCategories);

    this.router.get(
      '/:subCategoryId',
      [param('subCategoryId').isMongoId().withMessage('Invalid subcategory ID')],
      this.controller.getProductSubCategory
    );

    this.router.put(
      '/:subCategoryId',
      [
        param('subCategoryId').isMongoId().withMessage('Invalid subcategory ID'),
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('description').optional().notEmpty().withMessage('Description is required'),
        body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
        body('categoryId').optional().isMongoId().withMessage('Invalid category ID'),
      ],
      this.controller.updateProductSubCategory
    );

    this.router.delete(
      '/:subCategoryId',
      [param('subCategoryId').isMongoId().withMessage('Invalid subcategory ID')],
      this.controller.deleteProductSubCategory
    );
  }
}

export default new ProductSubCategoryRoutes().router;

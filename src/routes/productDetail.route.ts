import { Router } from 'express';
import { body, param } from 'express-validator';
import ProductDetailController from '../controllers/productDetail.controller';
import { uploadFiles } from '../Multer/MulterImageUpload';

class ProductDetailRoutes {
  router = Router();
  controller = new ProductDetailController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('sku').notEmpty().withMessage('SKU is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('currency').notEmpty().withMessage('Currency is required'),
        body('stockQuantity').isInt({ gt: 0 }).withMessage('Stock Quantity must be a positive integer'),
        body('stockStatus').isIn(['in stock', 'out of stock', 'backorder']).withMessage('Invalid stock status'),
        body('categories').isArray().withMessage('Categories must be an array'),
        body('tags').isArray().withMessage('Tags must be an array'),
        body('subcategoryId').isMongoId().withMessage('Invalid subcategory ID'),
      ],
      uploadFiles, // Multer middleware for handling file uploads
      this.controller.createProductDetail // Controller method for creating product detail
    );

    this.router.get('/', this.controller.getAllProductDetails);

    this.router.get(
      '/:productId',
      [param('productId').isMongoId().withMessage('Invalid product ID')],
      this.controller.getProductDetail
    );

    this.router.put(
      '/:productId',
      [
        param('productId').isMongoId().withMessage('Invalid product ID'),
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('description').optional().notEmpty().withMessage('Description is required'),
        body('sku').optional().notEmpty().withMessage('SKU is required'),
        body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('currency').optional().notEmpty().withMessage('Currency is required'),
        body('stockQuantity').optional().isInt({ gt: 0 }).withMessage('Stock Quantity must be a positive integer'),
        body('stockStatus').optional().isIn(['in stock', 'out of stock', 'backorder']).withMessage('Invalid stock status'),
        body('categories').optional().isArray().withMessage('Categories must be an array'),
        body('tags').optional().isArray().withMessage('Tags must be an array'),
        body('subcategoryId').optional().isMongoId().withMessage('Invalid subcategory ID'),
      ],
      uploadFiles, // Multer middleware for handling file uploads
      this.controller.updateProductDetail // Controller method for updating product detail
    );

    this.router.delete(
      '/:productId',
      [param('productId').isMongoId().withMessage('Invalid product ID')],
      this.controller.deleteProductDetail
    );
  }
}

export default new ProductDetailRoutes().router;

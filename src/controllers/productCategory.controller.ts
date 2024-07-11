import { Request, Response } from 'express';
import ProductCategoryModel, { ProductCategoryDocument } from '../model/productCategory.model';

export default class ProductCategoryController {
  // Create a product category
  async createProductCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, isActive }: { name: string; description: string; isActive: boolean } = req.body;

      // Check if the category already exists
      const existingCategory = await ProductCategoryModel.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          message: 'Product category with the same name already exists',
        });
      }

      const productCategoryData = { name, description, isActive } as ProductCategoryDocument;
      const createdProductCategory = await ProductCategoryModel.create(productCategoryData);

      return res.status(201).json({
        message: 'Product category created successfully',
        data: createdProductCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Get all product categories
  async getAllProductCategories(req: Request, res: Response): Promise<Response> {
    try {
      const productCategories = await ProductCategoryModel.find();

      return res.status(200).json({
        message: 'Product categories retrieved successfully',
        data: productCategories,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Get a single product category by ID
  async getProductCategory(req: Request, res: Response): Promise<Response> {
    try {
      const productCategoryId = req.params.productCategoryId;
      const productCategory = await ProductCategoryModel.findById(productCategoryId);

      if (!productCategory) {
        return res.status(404).json({
          message: 'Product category not found',
        });
      }

      return res.status(200).json({
        message: 'Product category retrieved successfully',
        data: productCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Update a product category by ID
  async updateProductCategory(req: Request, res: Response): Promise<Response> {
    try {
      const productCategoryId = req.params.productCategoryId;
      const updateData: ProductCategoryDocument = req.body;

      const updatedProductCategory = await ProductCategoryModel.findByIdAndUpdate(productCategoryId, updateData, { new: true });

      if (!updatedProductCategory) {
        return res.status(404).json({
          message: 'Product category not found',
        });
      }

      // Check if there is another subcategory with the same name (excluding itself)
      if (updateData.name) {
        const duplicateSubCategory = await ProductCategoryModel.findOne({ name: updateData.name});
        if (duplicateSubCategory) {
          return res.status(400).json({
            message: 'Another subcategory with the same name already exists',
          });
        }
      }

      return res.status(200).json({
        message: 'Product category updated successfully',
        data: updatedProductCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Delete a product category by ID
  async deleteProductCategory(req: Request, res: Response): Promise<Response> {
    try {
      const productCategoryId = req.params.productCategoryId;
      const deletedProductCategory = await ProductCategoryModel.findByIdAndDelete(productCategoryId);

      if (!deletedProductCategory) {
        return res.status(404).json({
          message: 'Product category not found',
        });
      }

      return res.status(200).json({
        message: 'Product category deleted successfully',
        data: deletedProductCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }
}

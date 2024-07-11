import { Request, Response } from 'express';
import ProductSubCategoryModel, { ProductSubCategoryDocument } from '../model/productSubCategory.model';
import ProductCategoryModel, { ProductCategoryDocument } from '../model/productCategory.model';

export default class ProductSubCategoryController {
  // Create a product subcategory
  async createProductSubCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, isActive, categoryId }: { name: string; description: string; isActive: boolean; categoryId: string } = req.body;

      // Check if the category exists
      const category = await ProductCategoryModel.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          message: 'Invalid category ID',
        });
      }

      // Check if the subcategory with the same name already exists
      const existingSubCategory = await ProductSubCategoryModel.findOne({ name });
      if (existingSubCategory) {
        return res.status(400).json({
          message: 'Product subcategory with the same name already exists',
        });
      }

      // Create the subcategory
      const subCategoryData = {
        name,
        description,
        isActive,
        category: category._id, // Save the category ID in the subcategory document
      } as ProductSubCategoryDocument;

      const createdSubCategory = await ProductSubCategoryModel.create(subCategoryData);

      // Fetch the category details to include in the response
      let populatedSubCategory = await ProductSubCategoryModel.findById(createdSubCategory._id).populate('category');

      if (!populatedSubCategory) {
        return res.status(404).json({
          message: 'Product subcategory not found after creation',
        });
      }

      return res.status(201).json({
        message: 'Product subcategory created successfully',
        data: {
          ...populatedSubCategory.toObject(),
          categoryId: {
            _id: category._id,
            name: category.name,
            description: category.description,
          },
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Update a product subcategory by ID
  async updateProductSubCategory(req: Request, res: Response): Promise<Response> {
    try {
      const subCategoryId = req.params.subCategoryId;
      const updateData: Partial<ProductSubCategoryDocument> = req.body;

      // Check if the subcategory exists
      const existingSubCategory = await ProductSubCategoryModel.findById(subCategoryId);
      if (!existingSubCategory) {
        return res.status(404).json({
          message: 'Product subcategory not found',
        });
      }

      // Check if there is another subcategory with the same name (excluding itself)
      if (updateData.name) {
        const duplicateSubCategory = await ProductSubCategoryModel.findOne({ name: updateData.name});
        if (duplicateSubCategory) {
          return res.status(400).json({
            message: 'Another subcategory with the same name already exists',
          });
        }
      }

      const updatedSubCategory = await ProductSubCategoryModel.findByIdAndUpdate(subCategoryId, updateData, { new: true });

      if (!updatedSubCategory) {
        return res.status(404).json({
          message: 'Product subcategory not found',
        });
      }

      return res.status(200).json({
        message: 'Product subcategory updated successfully',
        data: updatedSubCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Get all product subcategories
  async getAllProductSubCategories(req: Request, res: Response): Promise<Response> {
    try {
      const subCategories = await ProductSubCategoryModel.find();

      return res.status(200).json({
        message: 'Product subcategories retrieved successfully',
        data: subCategories,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Get a single product subcategory by ID
  async getProductSubCategory(req: Request, res: Response): Promise<Response> {
    try {
      const subCategoryId = req.params.subCategoryId;
      const subCategory = await ProductSubCategoryModel.findById(subCategoryId);

      if (!subCategory) {
        return res.status(404).json({
          message: 'Product subcategory not found',
        });
      }

      return res.status(200).json({
        message: 'Product subcategory retrieved successfully',
        data: subCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Delete a product subcategory by ID
  async deleteProductSubCategory(req: Request, res: Response): Promise<Response> {
    try {
      const subCategoryId = req.params.subCategoryId;
      const deletedSubCategory = await ProductSubCategoryModel.findByIdAndDelete(subCategoryId);

      if (!deletedSubCategory) {
        return res.status(404).json({
          message: 'Product subcategory not found',
        });
      }

      return res.status(200).json({
        message: 'Product subcategory deleted successfully',
        data: deletedSubCategory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }
}

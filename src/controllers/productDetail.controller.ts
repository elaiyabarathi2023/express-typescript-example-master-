import { Request, Response } from 'express';

import ProductDetailModel, { ProductDetailDocument } from '../model/productDetails.model';
import ProductSubCategoryModel from '../model/productSubCategory.model';


interface MulterRequest extends Request {
    files: {
      [fieldname: string]: Express.Multer.File[];
    };
  }
export default class ProductDetailController {


    async createProductDetail(req: Request, res: Response): Promise<Response> {
        try {
          // Log the incoming request body for debugging
          console.log('Request Body:', req.body);
    
          const {
            name,
            description,
            sku,
            price,
            currency,
            stockQuantity,
            stockStatus,
            categories,
            tags,
            attributes,
            variants,
            weight,
            dimensions,
            relatedProducts,
            reviews,
            averageRating,
            subcategoryId,
          } = req.body;
    
          const subcategory = await ProductSubCategoryModel.findById(subcategoryId);
          if (!subcategory) {
            return res.status(400).json({ message: 'Invalid subcategory ID' });
          }
    
          const multerReq = req as MulterRequest;
          const mainImage = multerReq.files?.mainImage ? multerReq.files.mainImage[0].filename : '';
          const additionalImages = multerReq.files?.additionalImages?.map((file: Express.Multer.File) => file.filename) || [];
    
          // Parse JSON fields
          const parsedCategories = JSON.parse(categories);
          const parsedTags = JSON.parse(tags);
          const parsedAttributes = JSON.parse(attributes);
          const parsedVariants = JSON.parse(variants);
          const parsedDimensions = JSON.parse(dimensions);
          const parsedRelatedProducts = JSON.parse(relatedProducts);
          const parsedReviews = JSON.parse(reviews);
    
          // Log parsed values for debugging
          console.log('Parsed Dimensions:', parsedDimensions);
          console.log('Parsed Weight:', weight);
    
          const createdProduct = await ProductDetailModel.create({
            name,
            description,
            sku,
            price,
            currency,
            stockQuantity,
            stockStatus,
            categories: parsedCategories,
            tags: parsedTags,
            mainImage,
            additionalImages,
            attributes: parsedAttributes,
            variants: parsedVariants,
            weight: parseFloat(weight), // Ensure weight is parsed as a number
            dimensions: parsedDimensions, // Ensure dimensions is parsed as an object
            relatedProducts: parsedRelatedProducts,
            reviews: parsedReviews,
            averageRating: parseFloat(averageRating), // Ensure averageRating is parsed as a number
            subcategoryId,
          });
    
          return res.status(201).json({ message: 'Product created successfully', data: createdProduct });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error!' });
        }
      }
    
      async updateProductDetail(req: Request, res: Response): Promise<Response> {
        try {
          const productId = req.params.productId;
          const updateData: Partial<ProductDetailDocument> = req.body;
    
          const existingProduct = await ProductDetailModel.findById(productId);
          if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
    
          if (updateData.name) {
            const duplicateProduct = await ProductDetailModel.findOne({ name: updateData.name });
            if (duplicateProduct?._id?.toString() !== productId) {
              return res.status(400).json({ message: 'Another product with the same name already exists' });
            }
          }
    
          const multerReq = req as MulterRequest;
          const mainImage = multerReq.files?.mainImage ? multerReq.files.mainImage[0].filename : existingProduct.mainImage;
          const additionalImages = multerReq.files?.additionalImages?.map((file: Express.Multer.File) => file.filename) || existingProduct.additionalImages;
    
          updateData.mainImage = mainImage;
          updateData.additionalImages = additionalImages;
    
          // Ensure weight and dimensions are correctly parsed
          if (updateData.weight) updateData.weight = parseFloat(updateData.weight as unknown as string);
          if (updateData.dimensions) updateData.dimensions = JSON.parse(updateData.dimensions as unknown as string);
    
          const updatedProduct = await ProductDetailModel.findByIdAndUpdate(productId, updateData, { new: true });
    
          if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
    
          return res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error!' });
        }
      }

    



  // Get all product details
  async getAllProductDetails(req: Request, res: Response): Promise<Response> {
    try {
      const products = await ProductDetailModel.find();

      return res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Get a single product detail by ID
  async getProductDetail(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.productId;
      const product = await ProductDetailModel.findById(productId).populate('subcategory');

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      return res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }

  // Delete a product detail by ID
  async deleteProductDetail(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.productId;
      const deletedProduct = await ProductDetailModel.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      return res.status(200).json({
        message: 'Product deleted successfully',
        data: deletedProduct,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Internal Server Error!',
      });
    }
  }
}

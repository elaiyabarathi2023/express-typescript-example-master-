import mongoose, { Document, Model, Schema } from 'mongoose';
import { ProductSubCategoryDocument } from './productSubCategory.model'; // Adjust path as per your project structure

export interface ProductDetailDocument extends Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  stockQuantity: number;
  stockStatus: string;
  categories: string[];
  tags: string[];
  mainImage: string;
  additionalImages: string[];
  attributes: Array<{ [key: string]: string | number }>;
  variants: Array<{ [key: string]: string | number }>;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  relatedProducts: mongoose.Types.ObjectId[];
  reviews: Array<{ userId: mongoose.Types.ObjectId; rating: number; comment: string; createdAt: Date }>;
  averageRating: number;
  subcategoryId: ProductSubCategoryDocument['_id'];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductDetailSchema: Schema<ProductDetailDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    stockStatus: {
      type: String,
      required: true,
      enum: ['in stock', 'out of stock', 'backorder'],
    },
    categories: [{ type: String }],
    tags: [{ type: String }],
    mainImage: { type: String, required: true },
    additionalImages: [{ type: String }],
    attributes: [{ type: Map, of: Schema.Types.Mixed }],
    variants: [{ type: Map, of: Schema.Types.Mixed }],
    weight: { type: Number, required: true },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'ProductDetail' }],
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, min: 0, max: 5 },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'ProductSubCategory', required: true },
  },
  { timestamps: true }
);

const ProductDetailModel: Model<ProductDetailDocument> = mongoose.model<ProductDetailDocument>(
  'ProductDetail',
  ProductDetailSchema
);

export default ProductDetailModel;

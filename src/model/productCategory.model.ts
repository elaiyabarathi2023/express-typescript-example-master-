import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ProductCategoryDocument extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductCategorySchema: Schema<ProductCategoryDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },    
}, { timestamps: true });

const ProductCategoryModel: Model<ProductCategoryDocument> = mongoose.model<ProductCategoryDocument>('ProductCategory', ProductCategorySchema);

export default ProductCategoryModel;

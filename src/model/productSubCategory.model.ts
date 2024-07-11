import mongoose, { Document, Model, Schema } from 'mongoose';
import { ProductCategoryDocument } from './productCategory.model'; // Assuming productCategory.model.ts is in the same directory or relative path is correct

export interface ProductSubCategoryDocument extends Document {
    name: string;
    description: string;
    isActive: boolean;
    category: ProductCategoryDocument['_id']; // Reference to ProductCategoryDocument ID
    createdAt?: Date;
    updatedAt?: Date;
}

const ProductSubCategorySchema: Schema<ProductSubCategoryDocument> = new Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory', // Reference to the ProductCategory model
        required: true,
    },
}, { timestamps: true });

const ProductSubCategoryModel: Model<ProductSubCategoryDocument> = mongoose.model<ProductSubCategoryDocument>('ProductSubCategory', ProductSubCategorySchema);

export default ProductSubCategoryModel;

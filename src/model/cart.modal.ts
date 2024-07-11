import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CartSchema: Schema<CartDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
}, { timestamps: true });

const CartModel: Model<CartDocument> = mongoose.model<CartDocument>('Cart', CartSchema);

export default CartModel;

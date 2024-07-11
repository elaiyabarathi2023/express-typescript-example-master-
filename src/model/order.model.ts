import mongoose, { Document, Model, Schema } from 'mongoose';

export interface OrderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'ordered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema: Schema<OrderDocument> = new Schema({
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
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['ordered', 'cancelled'],
    default: 'ordered',
  },
}, { timestamps: true });

const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>('Order', OrderSchema);

export default OrderModel;

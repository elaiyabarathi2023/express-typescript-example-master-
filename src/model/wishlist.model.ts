import mongoose, { Document, Model, Schema } from 'mongoose';

export interface WishlistDocument extends Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const WishlistSchema: Schema<WishlistDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
}, { timestamps: true });

const WishlistModel: Model<WishlistDocument> = mongoose.model<WishlistDocument>('Wishlist', WishlistSchema);

export default WishlistModel;
    
import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  phonenumber: number;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model<UserDocument>('User', UserSchema);

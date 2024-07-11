import mongoose, { Schema, Document } from 'mongoose';

export interface AdminDocument extends Document {
  username: string;
  email: string;
  phonenumber: number;
  password: string;
}

const AdminSchema = new Schema<AdminDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber:{type : Number,required : true ,unique:true},
  password: { type: String, required: true },
},
{
    timestamps: true,
});

export default mongoose.model<AdminDocument>('Admin', AdminSchema);
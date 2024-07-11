import mongoose, { Document, Model, Schema } from 'mongoose';

// Enum definitions
export enum AddressType {
  Residential = 'Residential',
  Office = 'Office',
  Other = 'Other',
}

export enum NumberType {
  Phone = 'Phone',
  Landline = 'Landline',
}


// Interface for Contact Number with priority
interface ContactNumber {
  number: string;
  type: NumberType;
  priority: number;
}

export interface AddressDetailDocument extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  permanentAddress: boolean;
  temporaryAddress: boolean;
  addressType?: AddressType;
  contactNumbers?: ContactNumber[];
  numberType1?: NumberType;
  numberType2?: NumberType;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressDetailSchema: Schema<AddressDetailDocument> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  permanentAddress: {
    type: Boolean,
    default: false,
  },
  temporaryAddress: {
    type: Boolean,
    default: false,
  },
  addressType: {
    type: String,
    enum: Object.values(AddressType),
  },
  contactNumbers: [{
    number: { type: String },
    type: { type: String, enum: Object.values(NumberType) },
    priority: { type: Number }
  }],
  numberType1: {
    type: String,
    enum: Object.values(NumberType),
  },
  numberType2: {
    type: String,
    enum: Object.values(NumberType),
  },
}, { timestamps: true });

const AddressDetailModel: Model<AddressDetailDocument> = mongoose.model<AddressDetailDocument>('AddressDetail', AddressDetailSchema);

export default AddressDetailModel;

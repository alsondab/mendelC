import { Document, Model, model, models, Schema } from 'mongoose'

export interface IAddressInput {
  user: string
  fullName: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  email?: string
  isDefault?: boolean
}

export interface IAddress extends Document, IAddressInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    isDefault: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
)

// Compound index for user + isDefault to optimize queries
addressSchema.index({ user: 1, isDefault: 1 })

const Address =
  (models.Address as Model<IAddress>) ||
  model<IAddress>('Address', addressSchema)

export default Address

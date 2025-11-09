import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlist extends Document {
  user?: mongoose.Types.ObjectId
  sessionId?: string
  product: mongoose.Types.ObjectId
  createdAt: Date
}

const WishlistSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index pour éviter les doublons - soit user soit sessionId
WishlistSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
)
WishlistSchema.index(
  { sessionId: 1, product: 1 },
  { unique: true, partialFilterExpression: { sessionId: { $exists: true } } }
)

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>('Wishlist', WishlistSchema)

export default Wishlist

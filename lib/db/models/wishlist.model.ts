import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  createdAt: Date
}

const WishlistSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Index pour éviter les doublons
WishlistSchema.index({ user: 1, product: 1 }, { unique: true })

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>('Wishlist', WishlistSchema)

export default Wishlist




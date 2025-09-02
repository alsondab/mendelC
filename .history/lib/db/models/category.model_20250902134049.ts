import { Document, Model, model, models, Schema } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentCategory?: string // Référence vers la catégorie parent (pour les sous-catégories)
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // null pour les catégories principales
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index pour améliorer les performances
categorySchema.index({ parentCategory: 1, isActive: 1 })
categorySchema.index({ sortOrder: 1 })

const Category =
  (models.Category as Model<ICategory>) ||
  model<ICategory>('Category', categorySchema)

export default Category

import { Document, Model, Schema, models } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string | ICategory
  children?: string[] | ICategory[]
  level: number // 0 = catégorie principale, 1 = sous-catégorie, etc.
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
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    children: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    level: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 3, // Limite à 3 niveaux de profondeur
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    sortOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index pour optimiser les requêtes
categorySchema.index({ parent: 1, isActive: 1 })
categorySchema.index({ level: 1, isActive: 1 })
categorySchema.index({ slug: 1 })

// Middleware pour calculer automatiquement le niveau
categorySchema.pre('save', async function(next) {
  if (this.parent) {
    const parentCategory = await this.constructor.findById(this.parent)
    if (parentCategory) {
      this.level = (parentCategory as ICategory).level + 1
    }
  } else {
    this.level = 0
  }
  next()
})

const Category =
  (models.Category as Model<ICategory>) ||
  model<ICategory>('Category', categorySchema)

export default Category

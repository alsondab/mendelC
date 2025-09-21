import { Document, Model, model, models, Schema } from 'mongoose'
import { IProductInput } from '@/types'

export interface IProduct extends Document, IProductInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: false,
    },
    images: [String],
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    listPrice: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    // 🚀 NOUVEAUX CHAMPS POUR LA GESTION DES STOCKS
    minStockLevel: {
      type: Number,
      default: 5,
      required: true,
    },
    maxStockLevel: {
      type: Number,
      default: 100,
      required: true,
    },
    isLowStock: {
      type: Boolean,
      default: false,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
    lastStockUpdate: {
      type: Date,
      default: Date.now,
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
      default: 'in_stock',
    },
    tags: { type: [String], default: ['new arrival'] },
    colors: { type: [String], default: ['White', 'Red', 'Black'] },
    specifications: { type: [String], default: [] },
    compatibility: { type: [String], default: [] },
    avgRating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingDistribution: [
      {
        rating: {
          type: Number,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    numSales: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

// 🚀 MÉTHODES POUR LA GESTION DES STOCKS
productSchema.methods.updateStockStatus = function() {
  if (this.countInStock <= 0) {
    this.stockStatus = 'out_of_stock'
    this.isOutOfStock = true
    this.isLowStock = false
  } else if (this.countInStock <= this.minStockLevel) {
    this.stockStatus = 'low_stock'
    this.isLowStock = true
    this.isOutOfStock = false
  } else {
    this.stockStatus = 'in_stock'
    this.isLowStock = false
    this.isOutOfStock = false
  }
  this.lastStockUpdate = new Date()
  return this
}

productSchema.methods.getStockStatusText = function() {
  switch (this.stockStatus) {
    case 'out_of_stock':
      return 'Rupture de stock'
    case 'low_stock':
      return `Stock faible (${this.countInStock} restants)`
    case 'in_stock':
      return 'En stock'
    case 'discontinued':
      return 'Produit discontinué'
    default:
      return 'Statut inconnu'
  }
}

productSchema.methods.getStockStatusColor = function() {
  switch (this.stockStatus) {
    case 'out_of_stock':
      return 'red'
    case 'low_stock':
      return 'orange'
    case 'in_stock':
      return 'green'
    case 'discontinued':
      return 'gray'
    default:
      return 'gray'
  }
}

// 🚀 MIDDLEWARE POUR METTRE À JOUR LE STATUT AVANT SAUVEGARDE
productSchema.pre('save', function(next) {
  this.updateStockStatus()
  next()
})

const Product =
  (models.Product as Model<IProduct>) ||
  model<IProduct>('Product', productSchema)

export default Product

import { Document, Model, model, models, Schema } from 'mongoose'

export interface IStockHistory extends Document {
  productId: Schema.Types.ObjectId
  productName: string
  movementType: 'sale' | 'adjustment' // 'restock' | 'return' | 'damage' | 'transfer' seront implémentés dans une prochaine version
  quantityBefore: number
  quantityAfter: number
  quantityChange: number // positif = ajout, négatif = retrait
  reason?: string
  orderId?: Schema.Types.ObjectId
  userId?: Schema.Types.ObjectId
  metadata?: Map<string, string>
  createdAt: Date
  updatedAt: Date
}

const stockHistorySchema = new Schema<IStockHistory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productName: { type: String, required: true },
    movementType: {
      type: String,
      enum: ['sale', 'adjustment'], // 'restock', 'return', 'damage', 'transfer' seront implémentés dans une prochaine version
      required: true,
      index: true,
    },
    quantityBefore: { type: Number, required: true },
    quantityAfter: { type: Number, required: true },
    quantityChange: { type: Number, required: true },
    reason: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
)

// Index composés pour requêtes rapides
stockHistorySchema.index({ productId: 1, createdAt: -1 })
stockHistorySchema.index({ movementType: 1, createdAt: -1 })
stockHistorySchema.index({ createdAt: -1 })
stockHistorySchema.index({ orderId: 1 })

const StockHistory =
  (models.StockHistory as Model<IStockHistory>) ||
  model<IStockHistory>('StockHistory', stockHistorySchema)

export default StockHistory

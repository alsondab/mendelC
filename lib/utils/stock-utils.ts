// Fonction utilitaire pour calculer le statut de stock
export function calculateStockStatus(
  countInStock: number,
  minStockLevel: number
) {
  if (countInStock <= 0) {
    return {
      stockStatus: 'out_of_stock' as const,
      isOutOfStock: true,
      isLowStock: false,
    }
  } else if (countInStock <= minStockLevel) {
    return {
      stockStatus: 'low_stock' as const,
      isLowStock: true,
      isOutOfStock: false,
    }
  } else {
    return {
      stockStatus: 'in_stock' as const,
      isLowStock: false,
      isOutOfStock: false,
    }
  }
}

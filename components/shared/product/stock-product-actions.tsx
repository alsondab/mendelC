'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductEditDialog } from './product-edit-dialog'

interface StockProductActionsProps {
  productId: string
  onSuccess?: () => void
}

export function StockProductActions({
  productId,
  onSuccess,
}: StockProductActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-xs sm:text-sm"
        onClick={() => setEditDialogOpen(true)}
      >
        Modifier
      </Button>
      <ProductEditDialog
        productId={editDialogOpen ? productId : null}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}

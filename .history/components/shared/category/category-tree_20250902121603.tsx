'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'
import { ICategory } from '@/lib/db/models/category.model'

interface CategoryTreeProps {
  categories: ICategory[]
  selectedCategory?: string
  onCategorySelect?: (category: ICategory) => void
  showIcons?: boolean
  maxDepth?: number
}

interface CategoryNodeProps {
  category: ICategory
  selectedCategory?: string
  onCategorySelect?: (category: ICategory) => void
  showIcons?: boolean
  maxDepth?: number
  currentDepth?: number
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  selectedCategory,
  onCategorySelect,
  showIcons = true,
  maxDepth = 3,
  currentDepth = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = category.children && category.children.length > 0
  const isSelected = selectedCategory === category.slug
  const canExpand = hasChildren && currentDepth < maxDepth

  const handleClick = () => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    if (canExpand) {
      setIsExpanded(!isExpanded)
    }
  }

  const getIcon = () => {
    if (!showIcons) return null
    
    if (hasChildren) {
      return isExpanded ? (
        <FolderOpen className='h-4 w-4 text-primary' />
      ) : (
        <Folder className='h-4 w-4 text-muted-foreground' />
      )
    }
    return null
  }

  const getChevronIcon = () => {
    if (!canExpand) return null
    
    return isExpanded ? (
      <ChevronDown className='h-3 w-3 text-muted-foreground' />
    ) : (
      <ChevronRight className='h-3 w-3 text-muted-foreground' />
    )
  }

  return (
    <div className='select-none'>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted text-foreground hover:text-foreground'
        }`}
        style={{ paddingLeft: `${currentDepth * 16 + 12}px` }}
        onClick={handleClick}
      >
        {getChevronIcon()}
        {getIcon()}
        <span className='text-sm font-medium flex-1'>{category.name}</span>
        {hasChildren && (
          <span className='text-xs text-muted-foreground'>
            ({category.children?.length})
          </span>
        )}
      </div>

      {isExpanded && hasChildren && currentDepth < maxDepth && (
        <div className='mt-1'>
          {category.children?.map((child) => (
            <CategoryNode
              key={child._id}
              category={child as ICategory}
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect}
              showIcons={showIcons}
              maxDepth={maxDepth}
              currentDepth={currentDepth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  showIcons = true,
  maxDepth = 3,
}) => {
  return (
    <div className='space-y-1'>
      {categories.map((category) => (
        <CategoryNode
          key={category._id}
          category={category}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          showIcons={showIcons}
          maxDepth={maxDepth}
          currentDepth={0}
        />
      ))}
    </div>
  )
}

export default CategoryTree

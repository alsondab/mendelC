'use client'

import { ICategory } from '@/types'
import Sidebar from './sidebar'

interface SidebarWrapperProps {
  categories: (ICategory & { subCategories: ICategory[] })[]
}

export default function SidebarWrapper({ categories }: SidebarWrapperProps) {
  return <Sidebar categories={categories} />
}

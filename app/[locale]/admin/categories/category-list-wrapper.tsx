import { getAllCategoriesForAdmin } from '@/lib/actions/category.actions'
import { CategoryList } from './category-list'

interface CategoryListWrapperProps {
  query: string
  page: string
  sort: string
}

export async function CategoryListWrapper({
  query,
  page,
  sort,
}: CategoryListWrapperProps) {
  const result = await getAllCategoriesForAdmin({
    query,
    page: parseInt(page),
    sort,
  })

  return (
    <CategoryList
      categories={result.categories}
      totalPages={result.totalPages}
      totalCategories={result.totalCategories}
      from={result.from}
      to={result.to}
      currentPage={parseInt(page)}
    />
  )
}

import Link from 'next/link'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatId } from '@/lib/utils'
import { Metadata } from 'next'
import { deleteWebPage, getAllWebPages } from '@/lib/actions/web-page.actions'
import { IWebPage } from '@/lib/db/models/web-page.model'

export const metadata: Metadata = {
  title: 'Admin Web Pages',
}

export default async function WebPageAdminPage() {
  const webPages = await getAllWebPages()
  return (
    <div className='p-2 sm:p-4'>
      <div className='space-y-3 sm:space-y-4'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <h1 className='font-bold text-lg sm:text-xl'>Pages Web</h1>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto'>
            <div className='text-sm text-muted-foreground'>
              {webPages.length} page(s) trouvée(s)
            </div>
            <Button asChild variant='default' className='w-full sm:w-auto'>
              <Link href='/admin/web-pages/create'>Créer une page</Link>
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                <TableHead className='text-xs sm:text-sm'>Nom</TableHead>
                <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                  Slug
                </TableHead>
                <TableHead className='text-xs sm:text-sm'>Statut</TableHead>
                <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webPages.map((webPage: IWebPage) => (
                <TableRow key={webPage._id}>
                  <TableCell className='text-xs sm:text-sm font-mono'>
                    {formatId(webPage._id)}
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{webPage.title}</span>
                      <span className='text-xs text-muted-foreground sm:hidden'>
                        /{webPage.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-xs sm:text-sm text-muted-foreground'>
                    /{webPage.slug}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2 text-xs sm:text-sm'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          webPage.isPublished ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <span
                        className={
                          webPage.isPublished
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {webPage.isPublished ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col sm:flex-row gap-1'>
                      <Button
                        asChild
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        <Link href={`/admin/web-pages/${webPage._id}`}>
                          Modifier
                        </Link>
                      </Button>
                      <DeleteDialog id={webPage._id} action={deleteWebPage} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

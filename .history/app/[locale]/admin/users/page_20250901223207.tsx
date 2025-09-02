import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions'
import { IUser } from '@/lib/db/models/user.model'
import { formatId } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Admin Users',
}

export default async function AdminUser(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')
  const page = Number(searchParams.page) || 1
  const users = await getAllUsers({
    page,
  })
  return (
    <div className='p-2 sm:p-4'>
      <div className='space-y-3 sm:space-y-4'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <h1 className='font-bold text-lg sm:text-xl'>Utilisateurs</h1>
          <div className='text-sm text-muted-foreground'>
            {users?.data.length} utilisateur(s) trouvé(s)
          </div>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                <TableHead className='text-xs sm:text-sm'>Nom</TableHead>
                <TableHead className='text-xs sm:text-sm'>Email</TableHead>
                <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>Rôle</TableHead>
                <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data.map((user: IUser) => (
                <TableRow key={user._id}>
                  <TableCell className='text-xs sm:text-sm font-mono'>
                    {formatId(user._id)}
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{user.name}</span>
                      <span className='text-xs text-muted-foreground sm:hidden'>
                        {user.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm'>
                    <span className='truncate block max-w-[150px] sm:max-w-none'>
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'User'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col sm:flex-row gap-1'>
                      <Button
                        asChild
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        <Link href={`/admin/users/${user._id}`}>
                          Modifier
                        </Link>
                      </Button>
                      <DeleteDialog id={user._id} action={deleteUser} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {users?.totalPages > 1 && (
          <div className='pt-4'>
            <Pagination page={page} totalPages={users?.totalPages} />
          </div>
        )}
      </div>
    </div>
  )
}

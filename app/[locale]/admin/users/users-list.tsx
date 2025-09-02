'use client'
import Link from 'next/link'
import React, { useEffect, useState, useTransition } from 'react'

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
import { Skeleton } from '@/components/ui/skeleton'
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions'
import { IUser } from '@/lib/db/models/user.model'
import { formatId } from '@/lib/utils'

type UsersListDataProps = {
  data: IUser[]
  totalPages: number
}

const UsersList = () => {
  const [page, setPage] = useState<number>(1)
  const [data, setData] = useState<UsersListDataProps>()
  const [, startTransition] = useTransition()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    startTransition(async () => {
      const users = await getAllUsers({
        page: newPage,
      })
      setData(users)
    })
  }

  useEffect(() => {
    startTransition(async () => {
      const users = await getAllUsers({
        page: 1,
      })
      setData(users)
    })
  }, [])

  if (!data) {
    return (
      <div className='p-2 sm:p-4'>
        <div className='space-y-3 sm:space-y-4'>
          {/* Header Section */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-5 w-48' />
          </div>

          {/* Table Section */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-xs sm:text-sm'>ID</TableHead>
                  <TableHead className='text-xs sm:text-sm'>Nom</TableHead>
                  <TableHead className='text-xs sm:text-sm'>Email</TableHead>
                  <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                    Rôle
                  </TableHead>
                  <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-40' />
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-20' />
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

  return (
    <div className='p-2 sm:p-4'>
      <div className='space-y-3 sm:space-y-4'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <h1 className='font-bold text-lg sm:text-xl'>Utilisateurs</h1>
          <div className='text-sm text-muted-foreground'>
            {data?.data.length} utilisateur(s) trouvé(s)
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
                <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                  Rôle
                </TableHead>
                <TableHead className='w-[120px] sm:w-[140px] text-xs sm:text-sm'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((user: IUser) => (
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
                        <Link href={`/admin/users/${user._id}`}>Modifier</Link>
                      </Button>
                      <DeleteDialog
                        id={user._id}
                        action={deleteUser}
                        callbackAction={() => {
                          startTransition(async () => {
                            const users = await getAllUsers({
                              page: page,
                            })
                            setData(users)
                          })
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className='pt-4'>
            <Pagination
              page={page.toString()}
              totalPages={data?.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersList

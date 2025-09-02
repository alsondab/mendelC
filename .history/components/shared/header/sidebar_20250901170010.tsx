import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'

export default async function Sidebar({
  categories,
}: {
  categories: string[]
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()

  return (
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MenuIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Catégories</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {session ? (
                  <span className="text-sm font-medium">
                    Bonjour, {session.user.name}
                  </span>
                ) : (
                  <span className="text-sm font-medium">
                    Connectez-vous
                  </span>
                )}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>
              {session ? (
                <DrawerClose asChild>
                  <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground">
                    Gérer mon compte
                  </Link>
                </DrawerClose>
              ) : (
                <DrawerClose asChild>
                  <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
                    Se connecter
                  </Link>
                </DrawerClose>
              )}
            </DrawerDescription>
          </DrawerHeader>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm">Catégories</h2>
            </div>
            <nav className="p-2">
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span>{category}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            <div className="flex flex-col gap-1">
              <DrawerClose asChild>
                <Link href="/page/customer-service" className="text-sm text-muted-foreground hover:text-foreground">
                  Service client
                </Link>
              </DrawerClose>
              {session && (
                <form action={SignOut} className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                  >
                    Se déconnecter
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

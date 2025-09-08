import React, { useEffect, useState } from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { useWishlistStore } from '@/hooks/use-wishlist-store'
import { useSession } from 'next-auth/react'
import useIsMounted from '@/hooks/use-is-mounted'
import { ClientSetting } from '@/types'

export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const [rendered, setRendered] = useState(false)
  const { data: session } = useSession()
  const isMounted = useIsMounted()
  const { items: localWishlist, syncWithDatabase } = useWishlistStore()

  useEffect(() => {
    setRendered(true)
  }, [setting])

  // Synchroniser les favoris locaux avec la base de données quand l'utilisateur se connecte
  useEffect(() => {
    if (
      isMounted &&
      session?.user?.id &&
      localWishlist.some((item) => item._id.startsWith('local_'))
    ) {
      syncWithDatabase()
    }
  }, [isMounted, session?.user?.id, localWishlist, syncWithDatabase])

  if (!rendered) {
    useSettingStore.setState({
      setting,
    })
  }

  return children
}

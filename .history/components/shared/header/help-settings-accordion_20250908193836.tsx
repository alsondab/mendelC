import Link from 'next/link'
import { Settings, Shield } from 'lucide-react'
import { DrawerClose } from '@/components/ui/drawer'
import { getTranslations } from 'next-intl/server'
import { Session } from 'next-auth'

interface HelpSettingsAccordionProps {
  session: Session | null
}

export default async function HelpSettingsAccordion({
  session,
}: HelpSettingsAccordionProps) {
  const t = await getTranslations()

  return (
    <div className="border-t border-border/50 bg-muted/30">
      {/* Dashboard Section */}
      <div className="p-3">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Dashboard</h2>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="border-t border-border/50">
        <div className="flex flex-col">
          {session?.user?.role === 'Admin' && (
            <DrawerClose asChild>
              <Link
                href="/admin/overview"
                className="flex items-center space-x-2 px-3 py-2 hover:bg-muted/50 transition-colors text-foreground"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t('Header.Admin')}</span>
              </Link>
            </DrawerClose>
          )}
        </div>
      </div>
    </div>
  )
}

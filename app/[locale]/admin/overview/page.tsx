import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import OverviewReport from './overview-report'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Admin')
  return {
    title: t('Dashboard'),
  }
}

const DashboardPage = async () => {
  return <OverviewReport />
}

export default DashboardPage

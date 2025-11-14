import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OverviewReportWrapper from './overview-report-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Admin')
  return {
    title: t('Dashboard'),
  }
}

// ⚡ Optimization: Lazy load OverviewReport via wrapper client
// Le wrapper client permet d'utiliser ssr: false pour Recharts
const DashboardPage = async () => {
  return <OverviewReportWrapper />
}

export default DashboardPage

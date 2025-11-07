import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import SettingsPage from './settings-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Admin')
  return {
    title: t('Settings'),
  }
}

const SettingPage = async () => {
  return <SettingsPage />
}

export default SettingPage

import { Metadata } from 'next'
import SettingsPage from './settings-page'

export const metadata: Metadata = {
  title: 'Paramètres',
}

const SettingPage = async () => {
  return <SettingsPage />
}

export default SettingPage

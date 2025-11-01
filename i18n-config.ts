export const i18n = {
  locales: [
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'en', name: 'English', icon: '🇺🇸' },
  ],
  defaultLocale: 'fr',
}

export const getDirection = (locale: string) => {
  return 'ltr'
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]

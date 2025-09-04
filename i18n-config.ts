export const i18n = {
  locales: [
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'en-US', name: 'English', icon: '🇺🇸' },
    { code: 'ar', name: 'العربية', icon: '🇸🇦' },
  ],
  defaultLocale: 'fr',
}

export const getDirection = (locale: string) => {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]

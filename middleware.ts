import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

import NextAuth from 'next-auth'
import authConfig from './auth.config'

const publicPages = [
  '/',
  '/search',
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/verify-email-pending',
  '/cart',
  '/cart/(.*)',
  '/product/(.*)',
  '/page/(.*)',
  // (/secret requires auth)
]

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    // return NextResponse.next()
    return intlMiddleware(req)
  } else {
    // Vérifier si c'est une route admin
    const isAdminRoute = req.nextUrl.pathname.includes('/admin')

    if (!req.auth) {
      // Non authentifié → Rediriger vers sign-in avec le locale
      // Extraire le locale de l'URL actuelle
      const pathnameWithoutLocale = req.nextUrl.pathname.replace(
        new RegExp(`^/(${routing.locales.join('|')})`),
        ''
      ) || '/'
      const locale = req.nextUrl.pathname.match(
        new RegExp(`^/(${routing.locales.join('|')})`)
      )?.[1] || routing.defaultLocale

      const newUrl = new URL(
        `/${locale}/sign-in?callbackUrl=${encodeURIComponent(pathnameWithoutLocale)}`,
        req.nextUrl.origin
      )
      return Response.redirect(newUrl)
    } else {
      // Authentifié → Vérifier le rôle pour les routes admin
      if (isAdminRoute && req.auth.user?.role !== 'Admin') {
        // Utilisateur connecté mais pas admin → Rediriger vers sign-in
        const locale = req.nextUrl.pathname.match(
          new RegExp(`^/(${routing.locales.join('|')})`)
        )?.[1] || routing.defaultLocale
        const newUrl = new URL(`/${locale}/sign-in`, req.nextUrl.origin)
        return Response.redirect(newUrl)
      }
      return intlMiddleware(req)
    }
  }
})

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}

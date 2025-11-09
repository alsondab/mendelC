# 📖 Notes d'Étude Approfondie - Projet MendelCorp

**Date de création:** 2025-01-05  
**Objectif:** Comprendre en profondeur l'architecture, les patterns et les flux de données

---

## 📋 Table des Matières

1. [Architecture Générale](#1-architecture-générale)
2. [Flux d'Authentification](#2-flux-dauthentification)
3. [Gestion d'État avec Zustand](#3-gestion-détat-avec-zustand)
4. [Server Actions et Cache](#4-server-actions-et-cache)
5. [Internationalisation (i18n)](#5-internationalisation-i18n)
6. [Flux de Données](#6-flux-de-données)
7. [Patterns et Bonnes Pratiques](#7-patterns-et-bonnes-pratiques)
8. [Optimisations de Performance](#8-optimisations-de-performance)
9. [Sécurité](#9-sécurité)
10. [Exercices Pratiques](#10-exercices-pratiques)

---

## 1. Architecture Générale

### 1.1 Stack Technologique

```
Frontend:
├── Next.js 15 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
└── Radix UI (composants accessibles)

Backend:
├── Next.js Server Actions
├── MongoDB Atlas
├── Mongoose (ODM)
└── NextAuth.js

État:
├── Zustand (client-side)
├── React Context (providers)
└── Server State (cache Next.js)

Autres:
├── next-intl (i18n)
├── Zod (validation)
├── UploadThing (images)
└── Resend (emails)
```

---

### 1.2 Architecture en Couches

```
┌─────────────────────────────────────┐
│         PRESENTATION LAYER           │
│  (Components, Pages, UI)             │
├─────────────────────────────────────┤
│         APPLICATION LAYER             │
│  (Server Actions, Hooks, Stores)      │
├─────────────────────────────────────┤
│         DOMAIN LAYER                  │
│  (Models, Validators, Utils)         │
├─────────────────────────────────────┤
│         DATA LAYER                   │
│  (MongoDB, Cache, External APIs)     │
└─────────────────────────────────────┘
```

**Explication:**

1. **Presentation Layer:** Composants React, pages, UI
2. **Application Layer:** Logique métier, Server Actions, hooks
3. **Domain Layer:** Modèles de données, validation, utilitaires
4. **Data Layer:** Base de données, cache, APIs externes

---

### 1.3 Flux de Rendu

```
Requête HTTP
    ↓
Middleware (auth + i18n)
    ↓
Layout Principal
    ↓
Providers (Session, Theme, etc.)
    ↓
Page Component (Server Component)
    ↓
    ├─→ Fetch Data (Server Actions)
    │   └─→ Cache Check
    │       └─→ MongoDB Query
    │
    └─→ Render Components
        ├─→ Server Components (par défaut)
        └─→ Client Components ('use client')
```

---

## 2. Flux d'Authentification

### 2.1 Architecture d'Authentification

```
┌─────────────────────────────────────────┐
│         MIDDLEWARE (middleware.ts)      │
│  - Vérifie si route publique/protégée  │
│  - Applique i18n                        │
│  - Redirige si non authentifié          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      AUTH CONFIG (auth.config.ts)        │
│  - Définit les règles d'autorisation    │
│  - Admin: role === 'Admin'               │
│  - Autres: juste authentifié             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         AUTH (auth.ts)                  │
│  - Providers (Credentials, Google)      │
│  - Callbacks (signIn, jwt, session)     │
│  - Adapter MongoDB                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      SESSION PROVIDER                   │
│  (components/shared/client-providers.tsx)│
│  - Fournit session à tous les composants│
└─────────────────────────────────────────┘
```

---

### 2.2 Flux de Connexion

#### 2.2.1 Connexion par Email/Mot de Passe

```
1. Utilisateur remplit le formulaire
   └─→ /sign-in/credentials-signin-form.tsx

2. Soumission du formulaire
   └─→ signIn('credentials', { email, password })

3. NextAuth appelle le provider
   └─→ auth.ts → CredentialsProvider.authorize()

4. Vérification dans MongoDB
   ├─→ User.findOne({ email })
   ├─→ bcrypt.compare(password, user.password)
   └─→ Retourne user ou null

5. Si succès:
   ├─→ Callback jwt() → Stocke user dans token
   ├─→ Callback session() → Crée session
   └─→ Redirection vers callbackUrl ou '/'

6. Middleware vérifie req.auth
   └─→ Autorise l'accès aux pages protégées
```

**Code Clé:**

```typescript
// auth.ts
CredentialsProvider({
  async authorize(credentials) {
    const user = await User.findOne({ email: credentials.email })
    const isMatch = await bcrypt.compare(credentials.password, user.password)
    if (isMatch) {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
    return null
  },
})
```

---

#### 2.2.2 Connexion OAuth (Google)

```
1. Utilisateur clique sur "Se connecter avec Google"
   └─→ signIn('google')

2. Redirection vers Google OAuth
   └─→ Google authentifie l'utilisateur

3. Callback Google
   └─→ auth.ts → Google Provider

4. Callback signIn()
   ├─→ Vérifie si user existe dans MongoDB
   ├─→ Si non → Crée nouvel utilisateur
   ├─→ Si oui → Met à jour (name, image)
   └─→ Retourne true

5. Callback jwt() → Stocke user dans token
6. Callback session() → Crée session
7. Redirection vers callbackUrl
```

**Code Clé:**

```typescript
// auth.ts
callbacks: {
  signIn: async ({ user, account }) => {
    if (account?.provider === 'google') {
      const existingUser = await User.findOne({ email: user.email })
      if (!existingUser) {
        await User.create({
          email: user.email,
          name: user.name,
          role: 'User',
          emailVerified: true,
        })
      }
    }
    return true
  }
}
```

---

### 2.3 Protection des Routes

#### 2.3.1 Middleware

**Fichier:** `middleware.ts`

**Logique:**

```typescript
export default auth((req) => {
  // 1. Vérifier si route publique
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    // Route publique → Appliquer i18n seulement
    return intlMiddleware(req)
  } else {
    // Route protégée → Vérifier authentification
    if (!req.auth) {
      // Non authentifié → Rediriger vers /sign-in
      return Response.redirect(new URL('/sign-in?callbackUrl=...', ...))
    } else {
      // Authentifié → Appliquer i18n
      return intlMiddleware(req)
    }
  }
})
```

**Routes Publiques:**

- `/`, `/search`, `/sign-in`, `/sign-up`
- `/cart`, `/cart/*`, `/product/*`

**Routes Protégées:**

- `/account/*` → Requiert authentification
- `/checkout/*` → Requiert authentification
- `/admin/*` → Requiert authentification + role === 'Admin'

---

#### 2.3.2 Auth Config

**Fichier:** `auth.config.ts`

**Rôle:** Définit les règles d'autorisation au niveau NextAuth.

```typescript
authorized({ request, auth }) {
  const { pathname } = request.nextUrl

  // Admin: Requiert role === 'Admin'
  if (pathname.startsWith('/admin')) {
    return auth?.user?.role === 'Admin'
  }

  // Autres routes protégées: Juste authentifié
  const protectedPaths = [/\/checkout(\/.*)?/, /\/account(\/.*)?/]
  if (protectedPaths.some((p) => p.test(pathname))) {
    return !!auth
  }

  return true // Route publique
}
```

---

### 2.4 Gestion de Session

**Stratégie:** JWT (JSON Web Token)

**Configuration:**

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 jours
}
```

**Callbacks:**

1. **jwt():** Stocke les données utilisateur dans le token
2. **session():** Crée la session à partir du token

**Utilisation dans les composants:**

```typescript
import { auth } from '@/auth'

// Server Component
const session = await auth()
const user = session?.user

// Client Component
import { useSession } from 'next-auth/react'
const { data: session } = useSession()
```

---

## 3. Gestion d'État avec Zustand

### 3.1 Architecture des Stores

**Zustand** est utilisé pour la gestion d'état client-side (panier, wishlist, etc.).

**Avantages:**

- ✅ Légère (pas de boilerplate comme Redux)
- ✅ TypeScript-friendly
- ✅ Persistance locale possible
- ✅ Pas de Provider nécessaire

---

### 3.2 Store Panier

**Fichier:** `hooks/use-cart-store.ts`

**Structure:**

```typescript
interface CartStore {
  // État
  items: CartItem[]

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void

  // Getters
  getTotalPrice: () => number
  getTotalItems: () => number
}
```

**Fonctionnement:**

1. **Initialisation:** Store créé avec `create()`
2. **Persistance:** Stockage dans `localStorage` (optionnel)
3. **Mise à jour:** Actions mutent directement l'état
4. **Souscription:** Composants s'abonnent avec `useCartStore()`

**Exemple d'utilisation:**

```typescript
// Dans un composant
const { items, addItem, removeItem } = useCartStore()

// Ajouter un article
addItem({
  product: productData,
  quantity: 1,
  variant: selectedVariant,
})

// Supprimer un article
removeItem(itemId)
```

---

### 3.3 Store Wishlist

**Fichier:** `hooks/use-wishlist-store.ts`

**Structure similaire au panier:**

```typescript
interface WishlistStore {
  items: IProduct[]
  addItem: (product: IProduct) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
}
```

---

### 3.4 Stores de Sliders

**Fichiers:**

- `use-cart-slider-store.ts`: État ouvert/fermé du slider panier
- `use-wishlist-slider-store.ts`: État ouvert/fermé du slider wishlist

**Structure:**

```typescript
interface SliderStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}
```

**Utilisation:**

```typescript
// Ouvrir le panier
const { open } = useCartSliderStore()
open()

// Fermer le panier
const { close } = useCartSliderStore()
close()
```

---

### 3.5 Store de Paramètres

**Fichier:** `hooks/use-setting-store.ts`

**Rôle:** Stocke les paramètres globaux côté client.

**Utilisation:** Pour éviter de refetch les paramètres à chaque rendu.

---

## 4. Server Actions et Cache

### 4.1 Qu'est-ce qu'une Server Action?

**Définition:** Fonction async marquée avec `'use server'` qui s'exécute côté serveur.

**Avantages:**

- ✅ Pas besoin de créer des routes API séparées
- ✅ Type-safe (TypeScript)
- ✅ Validation automatique avec Zod
- ✅ Intégration native avec le cache Next.js

**Exemple:**

```typescript
'use server'

export async function createProduct(data: IProductInput) {
  // 1. Validation
  const product = ProductInputSchema.parse(data)

  // 2. Connexion DB
  await connectToDatabase()

  // 3. Création
  await Product.create(product)

  // 4. Invalidation cache
  revalidateTag('products')
  revalidatePath('/admin/products')

  // 5. Retour
  return { success: true, message: 'Produit créé' }
}
```

---

### 4.2 Flux d'une Server Action

```
Composant Client
    ↓
Appel Server Action
    ↓
Validation Zod
    ↓
Connexion MongoDB
    ↓
Opération DB (CRUD)
    ↓
Invalidation Cache
    ↓
Revalidation Paths
    ↓
Retour Résultat
    ↓
Mise à jour UI
```

---

### 4.3 Système de Cache

**Next.js 15** offre plusieurs stratégies de cache:

#### 4.3.1 `unstable_cache`

**Rôle:** Cache de données avec tags pour invalidation.

**Exemple:**

```typescript
import { unstable_cache } from 'next/cache'

export async function getCachedProducts() {
  return unstable_cache(
    async () => {
      await connectToDatabase()
      return await Product.find({ isPublished: true })
    },
    ['products'], // Key
    {
      tags: ['products'], // Tag pour invalidation
      revalidate: 3600, // Revalidation après 1h
    }
  )()
}
```

---

#### 4.3.2 `revalidateTag`

**Rôle:** Invalide tous les caches avec un tag spécifique.

**Exemple:**

```typescript
// Après création d'un produit
revalidateTag('products') // Invalide tous les caches taggés 'products'
```

---

#### 4.3.3 `revalidatePath`

**Rôle:** Invalide le cache d'une route spécifique.

**Exemple:**

```typescript
// Après mise à jour d'un produit
revalidatePath('/admin/products')
revalidatePath(`/product/${product.slug}`)
```

---

### 4.4 Stratégie de Cache dans le Projet

**Fichiers de cache:** `/lib/cache/`

**Structure:**

```
lib/cache/
├── product-cache.ts      → Cache produits
├── category-cache.ts     → Cache catégories
├── search-cache.ts        → Cache recherches
├── stock-cache.ts        → Cache stocks
└── admin-cache.ts        → Cache données admin
```

**Pattern utilisé:**

```typescript
// 1. Fonction de cache
export async function getCachedProducts() {
  return unstable_cache(
    async () => {
      // Fetch depuis DB
    },
    ['products'],
    { tags: ['products'], revalidate: 3600 }
  )()
}

// 2. Fonction d'invalidation
export function invalidateProductsCache() {
  revalidateTag('products')
}

// 3. Utilisation dans Server Action
export async function createProduct(data) {
  await Product.create(data)
  invalidateProductsCache() // Invalide le cache
  revalidatePath('/admin/products')
}
```

---

### 4.5 Ordre d'Exécution

```
1. Composant appelle Server Action
   └─→ createProduct(data)

2. Server Action valide les données
   └─→ ProductInputSchema.parse(data)

3. Server Action exécute l'opération DB
   └─→ await Product.create(product)

4. Server Action invalide les caches
   ├─→ revalidateTag('products')
   ├─→ invalidateProductsCache()
   └─→ revalidatePath('/admin/products')

5. Server Action retourne le résultat
   └─→ { success: true, message: '...' }

6. Next.js revalide automatiquement
   └─→ Les pages concernées sont re-rendues
```

---

## 5. Internationalisation (i18n)

### 5.1 Architecture i18n

**Bibliothèque:** `next-intl`

**Structure:**

```
i18n/
├── routing.ts      → Configuration du routing
└── request.ts      → Récupération des messages

messages/
├── fr.json         → Traductions françaises
└── en.json         → Traductions anglaises
```

---

### 5.2 Routing i18n

**Fichier:** `i18n/routing.ts`

**Configuration:**

```typescript
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always', // Toujours afficher le préfixe
})
```

**Résultat:**

- URLs françaises: `/fr/search`, `/fr/product/...`
- URLs anglaises: `/en/search`, `/en/product/...`

---

### 5.3 Middleware i18n

**Fichier:** `middleware.ts`

**Fonctionnement:**

```typescript
const intlMiddleware = createMiddleware(routing)

// Applique automatiquement:
// 1. Détection de la locale (cookie, header, ou défaut)
// 2. Redirection vers /{locale}/... si nécessaire
// 3. Injection de la locale dans les composants
```

---

### 5.4 Utilisation dans les Composants

#### 5.4.1 Server Components

```typescript
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('Home')

  return <h1>{t('Title')}</h1>
}
```

#### 5.4.2 Client Components

```typescript
'use client'
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('Product')

  return <button>{t('Add to Cart')}</button>
}
```

---

### 5.5 Structure des Messages

**Fichier:** `messages/fr.json`

```json
{
  "Home": {
    "Title": "Bienvenue",
    "Subtitle": "Découvrez nos produits"
  },
  "Product": {
    "Add to Cart": "Ajouter au panier",
    "Price": "Prix"
  },
  "Admin": {
    "Dashboard": "Tableau de bord",
    "Products": "Produits"
  }
}
```

**Utilisation:**

```typescript
// Namespace 'Product'
t('Add to Cart') // → "Ajouter au panier"

// Namespace 'Admin'
t('Dashboard') // → "Tableau de bord"
```

---

### 5.6 Métadonnées Dynamiques

**Exemple dans `layout.tsx`:**

```typescript
export async function generateMetadata() {
  const t = await getTranslations('Admin')
  return {
    title: t('Dashboard'), // Titre traduit
  }
}
```

---

## 6. Flux de Données

### 6.1 Flux de Données Global

```
┌─────────────────────────────────────────┐
│         USER INTERACTION                │
│  (Clic, Soumission formulaire, etc.)   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         CLIENT COMPONENT                │
│  - Gère l'interaction                   │
│  - Appelle Server Action ou Hook        │
└─────────────────────────────────────────┘
              ↓
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐      ┌───────▼──────┐
│ ZUSTAND│      │ SERVER ACTION│
│ STORE  │      │              │
└────────┘      └───────┬──────┘
    │                   │
    │                   ↓
    │         ┌──────────────────┐
    │         │  VALIDATION ZOD  │
    │         └──────────────────┘
    │                   │
    │                   ↓
    │         ┌──────────────────┐
    │         │   MONGODB QUERY  │
    │         └──────────────────┘
    │                   │
    │                   ↓
    │         ┌──────────────────┐
    │         │  CACHE UPDATE    │
    │         └──────────────────┘
    │                   │
    │                   ↓
    └───────────► UI UPDATE
```

---

### 6.2 Flux de Création de Produit (Admin)

```
1. Admin remplit le formulaire
   └─→ /admin/products/create/page.tsx

2. Soumission du formulaire
   └─→ product-form.tsx → handleSubmit()

3. Appel Server Action
   └─→ createProduct(formData)

4. Validation Zod
   └─→ ProductInputSchema.parse(formData)

5. Connexion MongoDB
   └─→ await connectToDatabase()

6. Création du produit
   └─→ await Product.create(product)

7. Invalidation des caches
   ├─→ revalidateTag('products')
   ├─→ revalidateTag('stock')
   ├─→ invalidateProductsCache()
   ├─→ invalidateCategoriesCache()
   └─→ revalidatePath('/admin/products')

8. Retour du résultat
   └─→ { success: true, message: '...' }

9. Redirection
   └─→ router.push('/admin/products')
```

---

### 6.3 Flux d'Ajout au Panier

```
1. Utilisateur clique sur "Ajouter au panier"
   └─→ product/[slug]/page.tsx → AddToCart component

2. Vérification de la variante
   └─→ Si variante requise et non sélectionnée → Toast erreur

3. Appel du store Zustand
   └─→ useCartStore().addItem({ product, quantity, variant })

4. Mise à jour du store
   ├─→ Ajoute l'article au tableau items[]
   ├─→ Calcule le total
   └─→ Persiste dans localStorage (optionnel)

5. Affichage du toast
   └─→ "Produit ajouté au panier" (auto-dismiss 2s ✅)

6. Mise à jour de l'UI
   ├─→ Badge du panier mis à jour
   └─→ Slider panier peut s'ouvrir automatiquement
```

**Code Clé:**

```typescript
// add-to-cart.tsx
const { addItem } = useCartStore()

const handleAddToCart = () => {
  addItem({
    product: productData,
    quantity: 1,
    variant: selectedVariant,
  })

  toast({
    title: t('Added to Cart'),
    description: t('Product added successfully'),
  })

  // Auto-dismiss après 2 secondes
  setTimeout(() => toastResult.dismiss(), 2000)
}
```

---

### 6.4 Flux de Checkout

```
1. Utilisateur clique sur "Passer commande"
   └─→ /cart → Button "Checkout"

2. Vérification authentification
   └─→ Middleware redirige vers /sign-in si non connecté

3. Page checkout
   └─→ /checkout/page.tsx

4. Sélection adresse
   └─→ checkout-form.tsx → Sélection ou création adresse

5. Calcul des prix
   ├─→ Items price (somme des articles)
   ├─→ Shipping price (selon adresse)
   ├─→ Tax price (calculé)
   └─→ Total price

6. Soumission commande
   └─ Server Action → createOrder()

7. Server Action createOrder()
   ├─→ Validation Zod
   ├─→ Connexion MongoDB
   ├─→ Création commande
   ├─→ Mise à jour stocks
   ├─→ Envoi email confirmation
   └─→ Invalidation cache

8. Redirection confirmation
   └─→ /checkout/[id]/page.tsx
```

---

### 6.5 Flux de Gestion de Stock

```
1. Admin modifie le stock d'un produit
   └─→ /admin/products/[id] → updateProduct()

2. Server Action updateProduct()
   ├─→ Validation
   ├─→ Récupération produit actuel
   ├─→ Comparaison stock avant/après
   └─→ Mise à jour produit

3. Calcul statut stock
   └─→ calculateStockStatus(countInStock, minStockLevel)
   ├─→ isLowStock: countInStock <= minStockLevel
   ├─→ isOutOfStock: countInStock === 0
   └─→ stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'

4. Enregistrement historique (si changement)
   └─→ recordStockMovement()
   ├─→ Type: 'adjustment'
   ├─→ quantityBefore / quantityAfter
   └─→ reason: 'Modification du produit'

5. Vérification notifications
   └─→ Si stock faible ou rupture
       └─→ checkStockAndNotify()
           ├─→ Création notification
           └─→ Envoi email (si configuré)

6. Invalidation cache
   └─→ revalidateTag('stock')
```

---

## 7. Patterns et Bonnes Pratiques

### 7.1 Server Components par Défaut

**Principe:** Utiliser Server Components autant que possible.

**Avantages:**

- ✅ Pas de JavaScript côté client
- ✅ Accès direct à la DB
- ✅ Meilleures performances
- ✅ SEO optimal

**Quand utiliser Client Components:**

- Interactions utilisateur (onClick, onChange)
- Hooks React (useState, useEffect)
- État local
- Animations complexes

**Pattern:**

```typescript
// Server Component (par défaut)
export default async function Page() {
  const data = await fetchData()
  return <ProductList products={data} />
}

// Client Component (si nécessaire)
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={...}>Click</button>
}
```

---

### 7.2 Composition de Composants

**Pattern:** Composants petits et réutilisables.

**Exemple:**

```typescript
// ❌ Mauvais: Composant monolithique
function ProductPage() {
  // 200 lignes de code
}

// ✅ Bon: Composition
function ProductPage() {
  return (
    <>
      <ProductHeader />
      <ProductGallery />
      <ProductInfo />
      <ProductActions />
      <ProductReviews />
    </>
  )
}
```

---

### 7.3 Gestion d'Erreurs

**Pattern:** Try-catch dans Server Actions.

**Exemple:**

```typescript
export async function createProduct(data) {
  try {
    // Opération
    await Product.create(data)
    return { success: true, message: '...' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
```

**Utilisation:**

```typescript
const result = await createProduct(data)
if (!result.success) {
  toast.error(result.message)
}
```

---

### 7.4 Validation avec Zod

**Pattern:** Valider toutes les entrées utilisateur.

**Exemple:**

```typescript
// validator.ts
export const ProductInputSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  countInStock: z.number().int().min(0),
})

// Server Action
export async function createProduct(data: IProductInput) {
  // Validation automatique
  const product = ProductInputSchema.parse(data)
  // Si erreur → Zod lance une exception
}
```

---

### 7.5 Lazy Loading

**Pattern:** Charger les composants lourds de manière asynchrone.

**Exemple:**

```typescript
// Lazy load Recharts (admin seulement)
const SalesChart = dynamic(() => import('./sales-chart'), {
  ssr: false,
  loading: () => <Skeleton />
})

// Lazy load sliders
const CartSidebar = dynamic(() => import('./cart-sidebar'), {
  ssr: false,
  loading: () => null,
})
```

**Avantages:**

- ✅ Réduction du bundle initial
- ✅ Chargement à la demande
- ✅ Meilleures performances

---

### 7.6 Memoization avec React.memo

**Pattern:** Éviter les re-renders inutiles.

**Exemple:**

```typescript
const ProductCard = React.memo(({ product }) => {
  // Composant optimisé
})

// Comparaison personnalisée (optionnel)
const ProductCard = React.memo(
  ({ product }) => { ... },
  (prevProps, nextProps) => {
    return prevProps.product._id === nextProps.product._id
  }
)
```

**Composants optimisés dans le projet:**

- ✅ `ProductCard`
- ✅ `ProductPrice`
- ✅ `AddToCart`
- ✅ `WishlistButton`

---

## 8. Optimisations de Performance

### 8.1 Optimisations Appliquées

#### 8.1.1 Images

**Optimisations:**

- ✅ `sizes` pour responsive images
- ✅ `quality={60-70}` pour réduire la taille
- ✅ `loading='lazy'` pour lazy loading
- ✅ `priority` pour images critiques
- ✅ Formats modernes (AVIF, WebP)

**Exemple:**

```typescript
<Image
  src={imageUrl}
  alt={product.name}
  width={280}
  height={280}
  sizes="(max-width: 320px) 160px, (max-width: 480px) 192px, 280px"
  quality={70}
  loading="lazy"
/>
```

---

#### 8.1.2 Animations

**Optimisations:**

- ✅ CSS au lieu de framer-motion pour animations simples
- ✅ `transform` et `opacity` au lieu de `width`/`height`
- ✅ Lazy load framer-motion pour animations complexes

**Exemple:**

```typescript
// ❌ Avant: Animation avec width
animate={{ width: '50%' }}

// ✅ Après: Animation avec transform
animate={{ scaleX: 0.5 }}
style={{ transformOrigin: 'left' }}
```

---

#### 8.1.3 Bundle JavaScript

**Optimisations:**

- ✅ Code splitting avec webpack
- ✅ Lazy loading des composants lourds
- ✅ Tree shaking automatique
- ✅ Modularisation des imports

**Configuration:** `next.config.ts`

```typescript
webpack: {
  splitChunks: {
    cacheGroups: {
      framerMotion: { ... },
      recharts: { ... },
      radixUI: { ... },
    }
  }
}
```

---

#### 8.1.4 Cache

**Stratégies:**

- ✅ Cache des données avec `unstable_cache`
- ✅ Revalidation par tags
- ✅ Revalidation par paths
- ✅ Cache des images (TTL 1 an)

---

### 8.2 Métriques de Performance

**Objectifs:**

- ✅ First Contentful Paint (FCP) < 1.8s
- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ Total Blocking Time (TBT) < 200ms
- ✅ Cumulative Layout Shift (CLS) = 0

**Scores Lighthouse:**

- Performance: 80/100 (Mobile), 94/100 (Desktop)
- Accessibility: 87/100
- Best Practices: 100/100
- SEO: 100/100

---

## 9. Sécurité

### 9.1 Authentification

**Mesures:**

- ✅ Hachage des mots de passe avec bcryptjs
- ✅ Sessions JWT sécurisées
- ✅ Protection CSRF intégrée Next.js
- ✅ Validation des entrées avec Zod

---

### 9.2 Validation

**Toutes les entrées utilisateur sont validées:**

```typescript
// Server Action
export async function createProduct(data) {
  // Validation Zod
  const product = ProductInputSchema.parse(data)
  // Si invalide → Exception lancée
}
```

---

### 9.3 Protection des Routes

**Middleware vérifie:**

- ✅ Authentification pour routes protégées
- ✅ Rôle admin pour routes admin
- ✅ Redirection si non autorisé

---

### 9.4 Variables d'Environnement

**Fichier:** `.env.local`

**Variables sensibles:**

- `MONGODB_URI`: URI de connexion MongoDB
- `NEXTAUTH_SECRET`: Secret pour JWT
- `NEXTAUTH_URL`: URL de l'application
- `GOOGLE_CLIENT_ID`: OAuth Google
- `GOOGLE_CLIENT_SECRET`: OAuth Google
- `UPLOADTHING_SECRET`: UploadThing
- `RESEND_API_KEY`: Resend (emails)

**⚠️ Ne jamais commiter `.env.local` dans Git!**

---

## 10. Exercices Pratiques

### 10.1 Exercice 1: Comprendre le Flux d'Authentification

**Objectif:** Tracer le flux complet de connexion.

**Étapes:**

1. Ouvrir `middleware.ts` et comprendre la logique
2. Ouvrir `auth.ts` et comprendre les providers
3. Ouvrir `sign-in/page.tsx` et voir comment le formulaire appelle `signIn()`
4. Tracer le flux jusqu'à la création de session

**Questions:**

- Que se passe-t-il si l'utilisateur n'est pas authentifié et accède à `/account`?
- Comment fonctionne le callback `jwt()`?
- Comment la session est-elle stockée?

---

### 10.2 Exercice 2: Comprendre les Server Actions

**Objectif:** Créer une nouvelle Server Action.

**Tâche:** Créer une Server Action `updateUserProfile()` qui:

1. Valide les données avec Zod
2. Met à jour l'utilisateur dans MongoDB
3. Invalide les caches appropriés
4. Retourne un résultat

**Fichiers à modifier:**

- `lib/actions/user.actions.ts`
- `lib/validator.ts` (ajouter schéma)
- `types/index.ts` (ajouter type)

---

### 10.3 Exercice 3: Comprendre le Cache

**Objectif:** Analyser le système de cache.

**Étapes:**

1. Ouvrir `lib/cache/product-cache.ts`
2. Comprendre comment `unstable_cache` fonctionne
3. Voir comment les caches sont invalidés dans `product.actions.ts`
4. Tester: Créer un produit et vérifier que les caches sont invalidés

**Questions:**

- Pourquoi utiliser des tags pour le cache?
- Quelle est la différence entre `revalidateTag` et `revalidatePath`?
- Comment le cache est-il utilisé dans les pages?

---

### 10.4 Exercice 4: Comprendre Zustand

**Objectif:** Créer un nouveau store Zustand.

**Tâche:** Créer un store `use-notification-store.ts` pour gérer les notifications.

**Structure:**

```typescript
interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}
```

**Utilisation:**

- Créer le store
- L'utiliser dans un composant
- Tester l'ajout/suppression de notifications

---

### 10.5 Exercice 5: Optimiser un Composant

**Objectif:** Optimiser un composant existant.

**Tâche:** Optimiser `components/shared/product/product-card.tsx`

**Optimisations à appliquer:**

1. Wrapper avec `React.memo`
2. Optimiser les images (sizes, quality, loading)
3. Lazy load les animations si nécessaire
4. Vérifier les re-renders avec React DevTools

---

### 10.6 Exercice 6: Comprendre l'i18n

**Objectif:** Ajouter une nouvelle traduction.

**Tâche:** Ajouter une clé de traduction pour "Ajouter aux favoris"

**Étapes:**

1. Ajouter la clé dans `messages/fr.json` et `messages/en.json`
2. Utiliser `useTranslations('Wishlist')` dans le composant
3. Remplacer le texte hardcodé par `t('Add to Wishlist')`

---

### 10.7 Exercice 7: Analyser le Bundle

**Objectif:** Comprendre la composition du bundle.

**Étapes:**

1. Lancer `npm run analyze`
2. Ouvrir `.next/analyze/client.html`
3. Identifier les gros chunks
4. Analyser ce qui compose chaque chunk
5. Proposer des optimisations

**Questions:**

- Quel chunk est le plus gros?
- Pourquoi framer-motion est-il toujours présent?
- Comment réduire la taille du bundle?

---

## 📚 Ressources pour Approfondir

### Documentation Officielle

- **Next.js 15:** https://nextjs.org/docs
- **React 19:** https://react.dev
- **Mongoose:** https://mongoosejs.com/docs
- **Zustand:** https://zustand-demo.pmnd.rs
- **Next-intl:** https://next-intl-docs.vercel.app
- **NextAuth.js:** https://next-auth.js.org

### Concepts Avancés

1. **Server Components:** Comprendre quand et pourquoi les utiliser
2. **Server Actions:** Pattern pour les mutations de données
3. **Cache Strategy:** Comprendre les différentes stratégies de cache
4. **Code Splitting:** Optimiser le chargement du JavaScript
5. **Performance:** Core Web Vitals et optimisations

---

## 🎯 Checklist de Compréhension

### Niveau Débutant

- [ ] Comprendre la structure des dossiers
- [ ] Savoir créer une nouvelle page
- [ ] Comprendre Server Components vs Client Components
- [ ] Savoir utiliser les traductions i18n

### Niveau Intermédiaire

- [ ] Comprendre le flux d'authentification
- [ ] Savoir créer une Server Action
- [ ] Comprendre le système de cache
- [ ] Savoir utiliser Zustand pour l'état

### Niveau Avancé

- [ ] Comprendre l'architecture complète
- [ ] Savoir optimiser les performances
- [ ] Comprendre les patterns utilisés
- [ ] Savoir déboguer les problèmes de cache
- [ ] Comprendre le code splitting

---

## 💡 Points d'Attention

### 1. Hydration Errors

**Problème:** Différence entre rendu serveur et client.

**Solution:** Utiliser `useIsMounted()` hook pour vérifier si le composant est monté.

```typescript
const isMounted = useIsMounted()
if (!isMounted) return null
```

---

### 2. Cache Stale

**Problème:** Données en cache non mises à jour.

**Solution:** Toujours invalider les caches après mutations.

```typescript
await Product.create(data)
revalidateTag('products') // Important!
```

---

### 3. Re-renders Inutiles

**Problème:** Composants qui se re-rendent trop souvent.

**Solution:** Utiliser `React.memo` et optimiser les dépendances.

---

### 4. Bundle Size

**Problème:** Bundle JavaScript trop gros.

**Solution:**

- Lazy load les composants lourds
- Utiliser CSS au lieu de JS pour animations simples
- Analyser régulièrement avec `npm run analyze`

---

## 🔍 Debugging Tips

### 1. Vérifier les Server Actions

```typescript
// Ajouter des logs
export async function createProduct(data) {
  console.log('Creating product:', data)
  // ...
}
```

### 2. Vérifier le Cache

```typescript
// Vérifier si le cache est utilisé
const cached = await unstable_cache(...)()
console.log('Cached data:', cached)
```

### 3. Vérifier les Re-renders

Utiliser React DevTools Profiler pour identifier les re-renders inutiles.

### 4. Vérifier le Bundle

```bash
npm run analyze
# Ouvrir .next/analyze/client.html
```

---

---

## 11. Diagrammes de Flux Détaillés

### 11.1 Flux Complet de Création de Commande

```
┌─────────────────────────────────────────┐
│    UTILISATEUR SUR /CHECKOUT            │
│  - Vérifie les articles du panier      │
│  - Sélectionne une adresse             │
│  - Choisit une date de livraison       │
│  - Clique sur "Passer commande"        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    CHECKOUT-FORM.TSX                    │
│  - Valide le formulaire (react-hook-form)│
│  - Appelle createOrder()                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    SERVER ACTION: createOrder()         │
│  (lib/actions/order.actions.ts)        │
│                                          │
│  1. Validation Zod                      │
│     └─→ OrderInputSchema.parse(data)    │
│                                          │
│  2. Connexion MongoDB                   │
│     └─→ await connectToDatabase()       │
│                                          │
│  3. Vérification stock                  │
│     └─→ Pour chaque item:               │
│         - Vérifier countInStock         │
│         - Si insuffisant → Erreur       │
│                                          │
│  4. Calcul des prix                     │
│     ├─→ itemsPrice (somme articles)     │
│     ├─→ shippingPrice (selon adresse)  │
│     ├─→ taxPrice (calculé)              │
│     └─→ totalPrice                      │
│                                          │
│  5. Création commande                   │
│     └─→ await Order.create({            │
│           user: session.user.id,        │
│           items: cart.items,            │
│           shippingAddress,              │
│           paymentMethod,                │
│           itemsPrice,                   │
│           shippingPrice,               │
│           taxPrice,                     │
│           totalPrice,                   │
│           isPaid: false,               │
│           status: 'pending'            │
│         })                              │
│                                          │
│  6. Mise à jour stocks                  │
│     └─→ Pour chaque item:               │
│         - Product.findByIdAndUpdate()   │
│         - countInStock -= quantity      │
│         - Recalcul stockStatus          │
│         - Enregistre dans stockHistory  │
│                                          │
│  7. Vérification notifications         │
│     └─→ Si stock faible/rupture:        │
│         - checkStockAndNotify()         │
│                                          │
│  8. Envoi email confirmation           │
│     └─→ Resend API                      │
│         - purchase-receipt.tsx          │
│                                          │
│  9. Invalidation cache                  │
│     ├─→ revalidateTag('orders')        │
│     ├─→ revalidateTag('stock')          │
│     └─→ revalidatePath('/account/orders')│
│                                          │
│  10. Retour résultat                    │
│      └─→ { success: true, orderId }     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    REDIRECTION                           │
│  router.push(`/checkout/${orderId}`)    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    PAGE CONFIRMATION                     │
│  /checkout/[id]/page.tsx                 │
│  - Affiche les détails de la commande   │
│  - Propose de continuer les achats      │
└─────────────────────────────────────────┘
```

---

### 11.2 Flux de Recherche de Produits

```
┌─────────────────────────────────────────┐
│    UTILISATEUR TAPE DANS LA BARRE       │
│    DE RECHERCHE                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    COMPONENT: search.tsx                 │
│  - Débounce (300ms)                     │
│  - Appelle API /api/search/suggestions   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    API ROUTE: /api/search/suggestions   │
│  - Récupère query depuis URL            │
│  - Recherche dans MongoDB                │
│    └─→ Product.find({                   │
│          name: { $regex: query, $options: 'i' }│
│        })                                │
│  - Retourne suggestions (max 5)         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    AFFICHAGE SUGGESTIONS                │
│  - Dropdown avec résultats              │
│  - Clic → Redirection vers /search?q=...│
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    PAGE /SEARCH                          │
│  - Récupère query depuis URL            │
│  - Appelle getCachedSearchResults()    │
│  - Affiche produits avec filtres       │
└─────────────────────────────────────────┘
```

---

### 11.3 Flux de Gestion de Stock (Admin)

```
┌─────────────────────────────────────────┐
│    ADMIN MODIFIE LE STOCK               │
│  /admin/products/[id]                   │
│  - Change countInStock                  │
│  - Clique sur "Enregistrer"            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    SERVER ACTION: updateProduct()       │
│                                          │
│  1. Récupère produit actuel             │
│     └─→ const current = await Product.findById()│
│                                          │
│  2. Compare stock avant/après            │
│     └─→ stockChanged = quantityBefore !== quantityAfter│
│                                          │
│  3. Calcule nouveau statut              │
│     └─→ calculateStockStatus(           │
│           countInStock,                 │
│           minStockLevel                 │
│         )                                │
│         ├─→ isLowStock                  │
│         ├─→ isOutOfStock                │
│         └─→ stockStatus                 │
│                                          │
│  4. Met à jour produit                  │
│     └─→ Product.findByIdAndUpdate({     │
│           countInStock,                 │
│           ...stockStatusData,           │
│           lastStockUpdate: new Date()   │
│         })                              │
│                                          │
│  5. Si stock changé:                    │
│     └─→ recordStockMovement({           │
│           type: 'adjustment',           │
│           quantityBefore,               │
│           quantityAfter,                │
│           reason: 'Modification produit' │
│         })                              │
│                                          │
│  6. Si stock faible/rupture:            │
│     └─→ checkStockAndNotify()           │
│         ├─→ Crée notification           │
│         └─→ Envoie email (si configuré) │
│                                          │
│  7. Invalidation cache                  │
│     ├─→ revalidateTag('stock')          │
│     └─→ revalidatePath('/admin/stock')  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    MISE À JOUR UI                        │
│  - Badge de notification mis à jour     │
│  - Jauge de stock mise à jour           │
│  - Liste des stocks mise à jour         │
└─────────────────────────────────────────┘
```

---

## 12. Patterns Avancés

### 12.1 Pattern: Server Action avec Cache

**Situation:** Fetch de données avec cache.

**Pattern:**

```typescript
// 1. Fonction de cache
export async function getCachedProducts() {
  return unstable_cache(
    async () => {
      await connectToDatabase()
      return await Product.find({ isPublished: true })
    },
    ['products'],
    {
      tags: ['products'],
      revalidate: 3600,
    }
  )()
}

// 2. Utilisation dans page
export default async function ProductsPage() {
  const products = await getCachedProducts()
  return <ProductList products={products} />
}

// 3. Invalidation après mutation
export async function createProduct(data) {
  await Product.create(data)
  revalidateTag('products') // Invalide le cache
  return { success: true }
}
```

---

### 12.2 Pattern: Optimistic Updates

**Situation:** Mise à jour UI avant confirmation serveur.

**Pattern:**

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleAddToCart = async () => {
  setIsLoading(true)
  try {
    // Mise à jour optimiste
    addItemToCart(product)

    // Appel serveur
    await addToCartServer(product)
  } catch (error) {
    // Rollback en cas d'erreur
    removeItemFromCart(product.id)
    toast.error("Erreur lors de l'ajout")
  } finally {
    setIsLoading(false)
  }
}
```

---

### 12.3 Pattern: Error Boundaries

**Situation:** Gestion d'erreurs au niveau composant.

**Pattern:**

```typescript
'use client'

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h2>Une erreur est survenue</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Recharger la page
      </button>
    </div>
  )
}
```

---

### 12.4 Pattern: Suspense avec Loading States

**Situation:** Affichage d'état de chargement.

**Pattern:**

```typescript
// Page
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  )
}

// Composant avec async
async function ProductList() {
  const products = await getProducts()
  return <div>{/* ... */}</div>
}
```

---

## 13. Tests et Débogage

### 13.1 Outils de Débogage

**React DevTools:**

- Profiler: Identifier les re-renders
- Components: Inspecter l'état des composants

**Next.js DevTools:**

- Voir les Server Components
- Analyser le cache

**Chrome DevTools:**

- Network: Voir les requêtes
- Performance: Analyser les performances
- Lighthouse: Audit complet

---

### 13.2 Logs Utiles

**Server Actions:**

```typescript
export async function createProduct(data) {
  console.log('[createProduct] Input:', data)
  try {
    const result = await Product.create(data)
    console.log('[createProduct] Success:', result._id)
    return { success: true }
  } catch (error) {
    console.error('[createProduct] Error:', error)
    return { success: false, message: formatError(error) }
  }
}
```

**Client Components:**

```typescript
useEffect(() => {
  console.log('[Component] Mounted')
  return () => {
    console.log('[Component] Unmounted')
  }
}, [])
```

---

### 13.3 Vérification du Cache

```typescript
// Vérifier si le cache fonctionne
const cached = await unstable_cache(
  async () => {
    console.log('[Cache] Fetching from DB')
    return await Product.find()
  },
  ['products'],
  { tags: ['products'] }
)()

console.log('[Cache] Result:', cached)
// Si "Fetching from DB" n'apparaît qu'une fois → Cache fonctionne
```

---

## 14. Points d'Attention Spécifiques

### 14.1 Hydration Mismatch

**Problème:** Différence entre rendu serveur et client.

**Exemple:**

```typescript
// ❌ Problème
export default function Component() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Hydration mismatch!
  return <div>{localStorage.getItem('key')}</div>
}

// ✅ Solution
const isMounted = useIsMounted()
if (!isMounted) return null
return <div>{localStorage.getItem('key')}</div>
```

---

### 14.2 Race Conditions

**Problème:** Plusieurs appels simultanés.

**Solution:** Utiliser `useTransition` ou désactiver le bouton pendant le chargement.

```typescript
const [isPending, startTransition] = useTransition()

const handleSubmit = () => {
  startTransition(async () => {
    await createProduct(data)
  })
}
```

---

### 14.3 Memory Leaks

**Problème:** Event listeners non nettoyés.

**Solution:** Toujours nettoyer dans `useEffect`.

```typescript
useEffect(() => {
  const handler = () => {
    /* ... */
  }
  window.addEventListener('resize', handler)
  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])
```

---

## 15. Checklist de Développement

### Avant de Créer une Nouvelle Fonctionnalité

- [ ] Comprendre le besoin utilisateur
- [ ] Identifier les Server Actions nécessaires
- [ ] Créer les schémas Zod de validation
- [ ] Créer les types TypeScript
- [ ] Planifier la structure de cache
- [ ] Identifier les composants à créer/modifier
- [ ] Vérifier les traductions i18n nécessaires

### Avant de Commiter

- [ ] Code formaté (Prettier)
- [ ] Pas d'erreurs ESLint
- [ ] Types TypeScript corrects
- [ ] Traductions ajoutées (fr + en)
- [ ] Cache invalidé si nécessaire
- [ ] Tests manuels effectués
- [ ] Performance vérifiée

---

## 16. Glossaire Technique

**Server Component:** Composant React rendu côté serveur, pas de JavaScript côté client.

**Client Component:** Composant React rendu côté client, nécessite `'use client'`.

**Server Action:** Fonction async marquée `'use server'` qui s'exécute côté serveur.

**Route Group:** Dossier entre `()` qui organise les routes sans affecter l'URL.

**Dynamic Segment:** Segment d'URL dynamique `[param]` dans Next.js.

**Cache Tag:** Tag pour grouper et invalider des caches.

**Revalidation:** Mise à jour du cache après une mutation.

**Hydration:** Processus où React "hydrate" le HTML serveur avec JavaScript client.

**Code Splitting:** Division du code JavaScript en chunks séparés.

**Tree Shaking:** Suppression du code non utilisé lors du build.

---

**Document créé le:** 2025-01-05  
**Dernière mise à jour:** 2025-01-05

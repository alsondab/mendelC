import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { auth } from '@/auth'

const f = createUploadthing()

// ⚡ Optimization: Helper pour vérifier les permissions admin
async function verifyAdmin() {
  const session = await auth()

  if (!session) {
    throw new UploadThingError('Unauthorized')
  }

  if (session.user?.role !== 'Admin') {
    throw new UploadThingError('Forbidden')
  }

  return { userId: session.user.id, userRole: session.user.role }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // ⚡ Optimization: Endpoint générique pour images (utilisé par produits, catégories)
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new UploadThingError('Unauthorized')
      return { userId: session?.user?.id }
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    }),

  // ⚡ Optimization: Endpoint spécifique pour les images du carousel (page d'accueil)
  carouselImageUploader: f({
    image: {
      maxFileSize: '8MB', // ⚡ Optimization: Plus grande taille pour les bannières
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // ⚡ Optimization: Vérification admin requise pour les uploads carousel
      const { userId } = await verifyAdmin()
      return { userId, uploadType: 'carousel' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // ⚡ Optimization: Les images sont automatiquement optimisées par UploadThing (CDN, formats modernes)
      return {
        uploadedBy: metadata.userId,
        uploadType: metadata.uploadType,
        url: file.url, // ⚡ Optimization: URL CDN optimisée automatiquement
      }
    }),

  // ⚡ Optimization: Endpoint spécifique pour les logos (paramètres du site)
  logoUploader: f({
    image: {
      maxFileSize: '2MB', // ⚡ Optimization: Taille réduite pour les logos
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // ⚡ Optimization: Vérification admin requise pour les uploads logo
      const { userId } = await verifyAdmin()
      return { userId, uploadType: 'logo' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // ⚡ Optimization: Les logos sont automatiquement optimisées par UploadThing
      return {
        uploadedBy: metadata.userId,
        uploadType: metadata.uploadType,
        url: file.url, // ⚡ Optimization: URL CDN optimisée automatiquement
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

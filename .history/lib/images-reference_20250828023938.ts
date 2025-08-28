// Ce fichier force Next.js à inclure les images dans le build
// Les images sont référencées ici pour être incluses dans le bundle

export const categoryImagePaths = [
  '/images/fire.jpg',
  '/images/telephony.jpg',
  '/images/video-surveillance.jpg',
  '/images/computer-equipment.jpg',
]

// Fonction utilitaire pour obtenir le chemin d'une image de catégorie
export const getCategoryImagePath = (category: string): string => {
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  return `/images/${slug}.jpg`
}

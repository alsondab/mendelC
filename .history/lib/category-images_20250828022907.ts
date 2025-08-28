// Import explicite des images des catégories pour Vercel
import fireImage from '@/public/images/fire.jpg'
import telephonyImage from '@/public/images/telephony.jpg'
import videoSurveillanceImage from '@/public/images/video-surveillance.jpg'
import computerEquipmentImage from '@/public/images/computer-equipment.jpg'

export const categoryImages = {
  'Fire': fireImage,
  'Telephony': telephonyImage,
  'Video Surveillance': videoSurveillanceImage,
  'Computer Equipment': computerEquipmentImage,
}

// Fonction pour obtenir l'URL de l'image d'une catégorie
export const getCategoryImageUrl = (category: string): string => {
  return categoryImages[category as keyof typeof categoryImages] || '/images/default-category.jpg'
}

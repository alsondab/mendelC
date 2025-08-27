import fs from 'fs/promises'
import path from 'path'

// Fonction pour nettoyer une clé (mais pas les namespaces principaux)
function cleanKey(key, isMainNamespace = false) {
  if (isMainNamespace) {
    // Garder les namespaces principaux intacts
    return key
  }

  return key
    .replace(/[.,!?;:]/g, '') // Supprimer la ponctuation
    .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
    .replace(/[^a-zA-Z0-9_]/g, '') // Garder seulement lettres, chiffres et underscores
    .toLowerCase() // Mettre en minuscules
}

// Fonction pour restaurer les traductions
function restoreTranslations() {
  const frTranslations = {
    Header: {
      Hello: 'Bonjour',
      'sign in': 'se connecter',
      All: 'Tout',
      Gold: 'Or',
      Green: 'Vert',
      Red: 'Rouge',
      'Shop By Department': 'Magasiner par département',
      'Account & Orders': 'Compte et commandes',
      'Sign up': "S'inscrire",
      'Sign in': 'Se connecter',
      'Sign out': 'Se déconnecter',
      Admin: 'Admin',
      'Your account': 'Votre compte',
      'Your orders': 'Vos commandes',
      'New Customer': 'Nouveau client',
      'Help & Settings': 'Aide et paramètres',
      'Search Site': 'Rechercher {name}',
      Cart: 'Panier',
      Dark: 'Sombre',
      Light: 'Clair',
      Color: 'Couleur',
      "Today's Deal": 'Offre du jour',
      'New Arrivals': 'Nouveautés',
      'Featured Products': 'Produits vedettes',
      'Best Sellers': 'Meilleures ventes',
      'Browsing History': 'Historique de navigation',
      'Customer Service': 'Service client',
      'About Us': 'À propos de nous',
      Help: 'Aide',
      'Site Menu': 'Menu du site',
      Subtotal: 'Sous-total',
      'Go to cart': 'Aller au panier',
    },
    Home: {
      'Categories to explore': 'Catégories à explorer',
      'See More': 'Voir plus',
      'Explore New Arrivals': 'Explorer les nouveautés',
      'Discover Best Sellers': 'Découvrir les meilleures ventes',
      'Featured Products': 'Produits vedettes',
      'View All': 'Tout afficher',
      'Shop Now': 'Acheter maintenant',
      "Today's Deals": 'Offres du jour',
      'Best Selling Products': 'Produits les plus vendus',
      "Related to items that you've viewed":
        'Lié aux articles que vous avez consultés',
      'Your browsing history': 'Votre historique de navigation',
      'Best Deals on Computer Equipment':
        "Meilleures offres sur l'équipement informatique",
      'Professional Video Surveillance Systems':
        'Systèmes de surveillance vidéo professionnels',
      'Advanced Telephony Solutions': 'Solutions de téléphonie avancées',
      'camera Solutions for sell': 'Solutions de caméras à vendre',
      'Video Surveillance Systems for sell do not miss it !':
        'Systèmes de surveillance vidéo à vendre, ne les manquez pas !',
    },
    Product: {
      'Added to Cart': 'Ajouté au panier',
      'Go to Cart': 'Aller au panier',
      'Deleted User': 'Utilisateur supprimé',
      Brand: 'Marque',
      'Limited time deal': 'Offre à durée limitée',
      Was: 'Était',
      'List price': 'Prix courant',
      Off: 'De réduction',
      'In Stock': 'En stock',
      'Out of Stock': 'Rupture de stock',
      'Add to Cart': 'Ajouter au panier',
      Quantity: 'Quantité',
      'Buy Now': 'Acheter maintenant',
      Color: 'Couleur',
      Size: 'Taille',
      Description: 'Description',
      Specifications: 'Spécifications',
      Compatibility: 'Compatibilité',
      'Customer Reviews': 'Avis des clients',
      'numReviews ratings': '{numReviews} évaluations',
      'rating star': '{rating} étoile',
      'avgRating out of 5': '{avgRating} sur 5',
      ratings: 'évaluations',
      'See customer reviews': 'Voir les avis des clients',
      'Review this product': 'Évaluer ce produit',
      'Share your thoughts with other customers':
        "Partagez vos impressions avec d'autres clients",
      'Write a customer review': 'Rédiger un avis client',
      'Write a review': 'Rédiger un avis',
      Cancel: 'Annuler',
      Submit: 'Soumettre',
      'Sort by': 'Trier par',
      'Price: Low to High': 'Prix : du plus bas au plus élevé',
      'Price: High to Low': 'Prix : du plus élevé au plus bas',
      'Most Recent': 'Plus récents',
      'Most Helpful': 'Plus utiles',
      'Verified Purchase': 'Achat vérifié',
      'Best Sellers in': 'Meilleures ventes dans {name}',
      'Inspired by Your browsing history':
        'Inspiré par votre historique de navigation',
      'Recently Viewed Products': 'Produits récemment consultés',
      Title: 'Titre',
      'Enter title': 'Saisir le titre',
      Comment: 'Commentaire',
      'Enter comment': 'Saisir le commentaire',
      'Select a rating': 'Sélectionner une évaluation',
      Please: 'Veuillez',
      'sign in': 'vous connecter',
    },
    Site: {
      empowering_technology_securing_tomorrow:
        'Empowering Technology, Securing Tomorrow.',
      MendelCorp: 'MendelCorp',
    },
  }

  const enTranslations = {
    Header: {
      Hello: 'Hello',
      'sign in': 'sign in',
      All: 'All',
      Gold: 'Gold',
      Green: 'Green',
      Red: 'Red',
      'Shop By Department': 'Shop By Department',
      'Account & Orders': 'Account & Orders',
      'Sign up': 'Sign up',
      'Sign in': 'Sign in',
      'Sign out': 'Sign out',
      Admin: 'Admin',
      'Your account': 'Your account',
      'Your orders': 'Your orders',
      'New Customer': 'New Customer',
      'Help & Settings': 'Help & Settings',
      'Search Site': 'Search {name}',
      Cart: 'Cart',
      Dark: 'Dark',
      Light: 'Light',
      Color: 'Color',
      "Today's Deal": "Today's Deal",
      'New Arrivals': 'New Arrivals',
      'Featured Products': 'Featured Products',
      'Best Sellers': 'Best Sellers',
      'Browsing History': 'Browsing History',
      'Customer Service': 'Customer Service',
      'About Us': 'About Us',
      Help: 'Help',
      'Site Menu': 'Site Menu',
      Subtotal: 'Subtotal',
      'Go to cart': 'Go to cart',
    },
    Home: {
      'Categories to explore': 'Categories to explore',
      'See More': 'See More',
      'Explore New Arrivals': 'Explore New Arrivals',
      'Discover Best Sellers': 'Discover Best Sellers',
      'Featured Products': 'Featured Products',
      'View All': 'View All',
      'Shop Now': 'Shop Now',
      "Today's Deals": "Today's Deals",
      'Best Selling Products': 'Best Selling Products',
      "Related to items that you've viewed":
        "Related to items that you've viewed",
      'Your browsing history': 'Your browsing history',
      'Best Deals on Computer Equipment': 'Best Deals on Computer Equipment',
      'Professional Video Surveillance Systems':
        'Professional Video Surveillance Systems',
      'Advanced Telephony Solutions': 'Advanced Telephony Solutions',
      'camera Solutions for sell': 'Camera Solutions for Sale',
      'Video Surveillance Systems for sell do not miss it !':
        "Video Surveillance Systems for Sale - Don't Miss It!",
    },
    Product: {
      'Added to Cart': 'Added to Cart',
      'Go to Cart': 'Go to Cart',
      'Deleted User': 'Deleted User',
      Brand: 'Brand',
      'Limited time deal': 'Limited time deal',
      Was: 'Was',
      'List price': 'List price',
      Off: 'Off',
      'In Stock': 'In Stock',
      'Out of Stock': 'Out of Stock',
      'Add to Cart': 'Add to Cart',
      Quantity: 'Quantity',
      'Buy Now': 'Buy Now',
      Color: 'Color',
      Size: 'Size',
      Description: 'Description',
      Specifications: 'Specifications',
      Compatibility: 'Compatibility',
      'Customer Reviews': 'Customer Reviews',
      'numReviews ratings': '{numReviews} ratings',
      'rating star': '{rating} star',
      'avgRating out of 5': '{avgRating} out of 5',
      ratings: 'ratings',
      'See customer reviews': 'See customer reviews',
      'Review this product': 'Review this product',
      'Share your thoughts with other customers':
        'Share your thoughts with other customers',
      'Write a customer review': 'Write a customer review',
      'Write a review': 'Write a review',
      Cancel: 'Cancel',
      Submit: 'Submit',
      'Sort by': 'Sort by',
      'Price: Low to High': 'Price: Low to High',
      'Price: High to Low': 'Price: High to Low',
      'Most Recent': 'Most Recent',
      'Most Helpful': 'Most Helpful',
      'Verified Purchase': 'Verified Purchase',
      'Best Sellers in': 'Best Sellers in {name}',
      'Inspired by Your browsing history': 'Inspired by Your browsing history',
      'Recently Viewed Products': 'Recently Viewed Products',
      Title: 'Title',
      'Enter title': 'Enter title',
      Comment: 'Comment',
      'Enter comment': 'Enter comment',
      'Select a rating': 'Select a rating',
      Please: 'Please',
      'sign in': 'sign in',
    },
    Site: {
      empowering_technology_securing_tomorrow:
        'Empowering Technology, Securing Tomorrow.',
      MendelCorp: 'MendelCorp',
    },
  }

  return { frTranslations, enTranslations }
}

async function restoreTranslationFiles() {
  try {
    const frPath = path.join(process.cwd(), 'messages', 'fr.json')
    const enPath = path.join(process.cwd(), 'messages', 'en-US.json')

    console.log('🔄 Restauration des traductions...')

    const { frTranslations, enTranslations } = restoreTranslations()

    // Sauvegarder les fichiers restaurés
    await fs.writeFile(frPath, JSON.stringify(frTranslations, null, 2), 'utf-8')
    await fs.writeFile(enPath, JSON.stringify(enTranslations, null, 2), 'utf-8')

    console.log('✅ Fichiers de traduction restaurés avec succès !')
    console.log('📝 Namespaces restaurés : Header, Home, Product, Site')
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error)
  }
}

// Exécuter le script
restoreTranslationFiles()

/**
 * Variants d'animation réutilisables pour Framer Motion
 * Assure la cohérence des animations dans toute l'application
 *
 * ⚡ Optimization: Type générique au lieu d'importer Variants directement
 * Cela permet le tree-shaking de framer-motion si les animations ne sont pas utilisées
 */

// Type générique compatible avec Framer Motion Variants (sans importer framer-motion)
// Les valeurs d'animation peuvent être: number, string, array, ou objet de transition
type AnimationValue =
  | number
  | string
  | number[]
  | string[]
  | Record<string, unknown>
type AnimationVariants = {
  hidden?: Record<string, AnimationValue>
  visible?: Record<string, AnimationValue>
  exit?: Record<string, AnimationValue>
  rest?: Record<string, AnimationValue>
  hover?: Record<string, AnimationValue>
  tap?: Record<string, AnimationValue>
  // Index signature compatible avec Variants de framer-motion
  [key: string]: Record<string, AnimationValue> | undefined
} & Record<string, Record<string, AnimationValue> | undefined>

// Animation fade-in simple
export const fadeIn: AnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Animation slide-up avec fade
export const slideUp: AnimationVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
}

// Animation slide-down avec fade
export const slideDown: AnimationVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
}

// Animation scale avec spring
export const scale: AnimationVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      duration: 0.2,
    },
  },
}

// Animation spring générique
export const spring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
}

// Animation pour les listes avec stagger
export const staggerContainer: AnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Animation pour les items dans une liste
export const staggerItem: AnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
}

// Variants pour les boutons avec ripple
export const buttonVariants: AnimationVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
}

// Animation shake pour les erreurs
export const shake: AnimationVariants = {
  hidden: { x: 0 },
  visible: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

// Animation slide selon la direction (pour page transitions)
export const slideFade = (
  direction: 'left' | 'right' | 'up' | 'down' = 'left'
): AnimationVariants => {
  const offsets = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  }

  return {
    hidden: {
      ...offsets[direction],
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: {
      ...offsets[direction],
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  }
}

// Animation pour les spinners
export const spinnerVariants: AnimationVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
}

// Animation pour les checkmarks (success)
export const checkmarkVariants: AnimationVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: 0.3,
    },
  },
}

// Animation slide depuis la droite (pour les sliders panier/favoris)
export const slideFromRight: AnimationVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.4,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Animation pour l'overlay des sliders
export const overlayVariants: AnimationVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

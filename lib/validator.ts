import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'

// Common
const MongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ID' })

const Price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    )

export const ReviewInputSchema = z.object({
  product: MongoId,
  user: MongoId,
  isVerifiedPurchase: z.boolean(),
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(1, 'Comment is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
})

export const ProductInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(1, 'Description is required'),
  isPublished: z.boolean(),
  price: Price('Price'),
  listPrice: Price('List price'),
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative('count in stock must be a non-negative number'),
  // 🚀 NOUVEAUX CHAMPS POUR LA GESTION DES STOCKS
  minStockLevel: z.coerce
    .number()
    .int()
    .nonnegative('min stock level must be a non-negative number')
    .default(5),
  maxStockLevel: z.coerce
    .number()
    .int()
    .positive('max stock level must be a positive number')
    .default(100),
  isLowStock: z.boolean().default(false),
  isOutOfStock: z.boolean().default(false),
  lastStockUpdate: z.date().default(() => new Date()),
  stockStatus: z
    .enum(['in_stock', 'low_stock', 'out_of_stock', 'discontinued'])
    .default('in_stock'),
  tags: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  specifications: z.array(z.string()).default([]),
  compatibility: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, 'Average rating must be at least 0')
    .max(5, 'Average rating must be at most 5'),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative('Number of reviews must be a non-negative number'),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),
  reviews: z.array(ReviewInputSchema).default([]),
  numSales: z.coerce
    .number()
    .int()
    .nonnegative('Number of sales must be a non-negative number'),
})

export const ProductUpdateSchema = ProductInputSchema.extend({
  _id: z.string(),
})

// Order Item
export const OrderItemSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  product: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative number'),
  countInStock: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image is required'),
  price: Price('Price'),
  size: z.string().optional(),
  color: z.string().optional(),
})
export const ShippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(50, 'Le nom complet ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
    ),
  street: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(100, "L'adresse ne peut pas dépasser 100 caractères")
    .regex(
      /^[a-zA-Z0-9À-ÿ\s\-#.,]+$/,
      "L'adresse contient des caractères non autorisés"
    ),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(50, 'La ville ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'La ville ne peut contenir que des lettres, espaces, apostrophes et tirets'
    ),
  postalCode: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true // Champ facultatif
      return (
        val.length >= 5 && val.length <= 10 && /^[A-Za-z0-9\s-]+$/.test(val)
      )
    }, 'Le code postal doit contenir entre 5 et 10 caractères et ne peut contenir que des lettres, chiffres, espaces et tirets'),
  province: z
    .string()
    .min(2, 'La province doit contenir au moins 2 caractères')
    .max(50, 'La province ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'La province ne peut contenir que des lettres, espaces, apostrophes et tirets'
    ),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .refine((val) => {
      // Nettoyer le numéro en supprimant tous les espaces et caractères non numériques sauf +
      const cleanNumber = val.replace(/\s/g, '')

      // Vérifier que le numéro commence par +225
      if (!cleanNumber.startsWith('+225')) {
        return false
      }

      // Supprimer +225 et garder seulement les chiffres
      const digitsOnly = cleanNumber.replace('+225', '').replace(/[^\d]/g, '')

      // Vérifier qu'il y a exactement 10 chiffres après +225
      return digitsOnly.length === 10 && /^\d{10}$/.test(digitsOnly)
    }, 'Le numéro doit commencer par +225 et contenir exactement 10 chiffres (ex: +225 0710145864)'),
  country: z
    .string()
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(50, 'Le pays ne peut pas dépasser 50 caractères'),
})

// Address (réutilise ShippingAddressSchema mais avec postalCode requis)
export const AddressInputSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(50, 'Le nom complet ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
    ),
  street: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(100, "L'adresse ne peut pas dépasser 100 caractères")
    .regex(
      /^[a-zA-Z0-9À-ÿ\s\-#.,]+$/,
      "L'adresse contient des caractères non autorisés"
    ),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(50, 'La ville ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'La ville ne peut contenir que des lettres, espaces, apostrophes et tirets'
    ),
  province: z
    .string()
    .min(2, 'La province doit contenir au moins 2 caractères')
    .max(50, 'La province ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'La province ne peut contenir que des lettres, espaces, apostrophes et tirets'
    ),
  postalCode: z
    .string()
    .min(5, 'Le code postal doit contenir au moins 5 caractères')
    .max(10, 'Le code postal ne peut pas dépasser 10 caractères')
    .regex(
      /^[A-Za-z0-9\s-]+$/,
      'Le code postal contient des caractères non autorisés'
    ),
  country: z
    .string()
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(50, 'Le pays ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .refine((val) => {
      if (!val) return false

      // Enlever tous les espaces et le préfixe +225 si présent
      const cleanNumber = val
        .trim()
        .replace(/\s/g, '')
        .replace(/^\+225/, '')

      // Vérifier qu'il ne reste que des chiffres
      if (!/^\d+$/.test(cleanNumber)) {
        return false
      }

      // Vérifier qu'il y a exactement 10 chiffres
      return cleanNumber.length === 10 && /^\d{10}$/.test(cleanNumber)
    }, 'Le numéro doit contenir exactement 10 chiffres (ex: 07 10 14 58 64)'),
  isDefault: z.boolean().optional().default(false),
})

export const AddressUpdateSchema = AddressInputSchema.extend({
  _id: z.string(),
}).partial()

// Order
export const OrderInputSchema = z.object({
  user: z.union([
    MongoId,
    z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  ]),
  items: z
    .array(OrderItemSchema)
    .min(1, 'Order must contain at least one item'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
  itemsPrice: Price('Items price'),
  shippingPrice: Price('Shipping price'),
  totalPrice: Price('Total price'),
  expectedDeliveryDate: z
    .date()
    .refine(
      (value) => value > new Date(),
      'Expected delivery date must be in the future'
    ),
  isDelivered: z.boolean().default(false),
  deliveredAt: z.date().optional(),
  isPaid: z.boolean().default(false),
  paidAt: z.date().optional(),
  isCancelled: z.boolean().default(false),
  cancelledAt: z.date().optional(),
})
// Cart

export const CartSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, 'Order must contain at least one item'),
  itemsPrice: z.number(),
  shippingPrice: z.optional(z.number()),
  totalPrice: z.number(),
  paymentMethod: z.optional(z.string()),
  shippingAddress: z.optional(ShippingAddressSchema),
  deliveryDateIndex: z.optional(z.number()),
  expectedDeliveryDate: z.optional(z.date()),
})

// USER
const UserName = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères')
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
  )
  .refine((val) => val.trim().length >= 2, 'Le nom ne peut pas être vide')
export const Email = z
  .string()
  .min(1, 'Email is required')
  .email('Email is invalid')
export const Password = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&)'
  )
  .refine(
    (val) => !val.includes(' '),
    "Le mot de passe ne peut pas contenir d'espaces"
  )
const UserRole = z.string().min(1, 'role is required')

export const UserUpdateSchema = z.object({
  _id: MongoId,
  name: UserName,
  email: Email,
  role: UserRole,
})

export const UserInputSchema = z.object({
  name: UserName,
  email: Email,
  image: z.string().optional(),
  emailVerified: z.boolean(),
  role: UserRole,
  password: Password,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  address: z.object({
    fullName: z
      .string()
      .min(2, 'Le nom complet doit contenir au moins 2 caractères')
      .max(50, 'Le nom complet ne peut pas dépasser 50 caractères')
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
      ),
    street: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(100, "L'adresse ne peut pas dépasser 100 caractères")
      .regex(
        /^[a-zA-Z0-9À-ÿ\s\-#.,]+$/,
        "L'adresse contient des caractères non autorisés"
      ),
    city: z
      .string()
      .min(2, 'La ville doit contenir au moins 2 caractères')
      .max(50, 'La ville ne peut pas dépasser 50 caractères')
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        'La ville ne peut contenir que des lettres, espaces, apostrophes et tirets'
      ),
    province: z
      .string()
      .min(2, 'La province doit contenir au moins 2 caractères')
      .max(50, 'La province ne peut pas dépasser 50 caractères')
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        'La province ne peut contenir que des lettres, espaces, apostrophes et tirets'
      ),
    postalCode: z
      .string()
      .min(5, 'Le code postal doit contenir au moins 5 caractères')
      .max(10, 'Le code postal ne peut pas dépasser 10 caractères')
      .regex(
        /^[A-Za-z0-9\s-]+$/,
        'Le code postal contient des caractères non autorisés'
      ),
    country: z
      .string()
      .min(2, 'Le pays doit contenir au moins 2 caractères')
      .max(50, 'Le pays ne peut pas dépasser 50 caractères'),
    phone: z
      .string()
      .min(1, 'Le numéro de téléphone est requis')
      .refine((val) => {
        // Nettoyer le numéro en supprimant tous les espaces et caractères non numériques sauf +
        const cleanNumber = val.replace(/\s/g, '')

        // Vérifier que le numéro commence par +225
        if (!cleanNumber.startsWith('+225')) {
          return false
        }

        // Supprimer +225 et garder seulement les chiffres
        const digitsOnly = cleanNumber.replace('+225', '').replace(/[^\d]/g, '')

        // Vérifier qu'il y a exactement 10 chiffres après +225
        return digitsOnly.length === 10 && /^\d{10}$/.test(digitsOnly)
      }, 'Le numéro doit commencer par +225 et contenir exactement 10 chiffres (ex: +225 0710145864)'),
  }),
})

export const UserSignInSchema = z.object({
  email: Email,
  password: Password,
})
export const UserSignUpSchema = UserSignInSchema.extend({
  name: UserName,
  confirmPassword: Password,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
export const UserNameSchema = z.object({
  name: UserName,
})

// Setting

export const SiteLanguageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
})
export const CarouselSchema = z.object({
  title: z.string().min(1, 'title is required'),
  url: z.string().min(1, 'url is required'),
  image: z.string().min(1, 'image is required'),
  buttonCaption: z.string().optional().default(''),
})

export const SiteCurrencySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  convertRate: z.coerce.number().min(0, 'Convert rate must be at least 0'),
  symbol: z.string().min(1, 'Symbol is required'),
})

export const PaymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  commission: z.coerce.number().min(0, 'Commission must be at least 0'),
})

export const DeliveryDateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  daysToDeliver: z.number().min(0, 'Days to deliver must be at least 0'),
  shippingPrice: z.coerce.number().min(0, 'Shipping price must be at least 0'),
})

// Category
export const CategoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentCategory: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export const CategoryUpdateSchema = CategoryInputSchema.extend({
  _id: z.string(),
})

export const SettingInputSchema = z.object({
  // PROMPT: create fields
  // codeium, based on the mongoose schema for settings
  common: z.object({
    pageSize: z.coerce
      .number()
      .min(1, 'Page size must be at least 1')
      .default(9),
    isMaintenanceMode: z.boolean().default(false),
    defaultTheme: z
      .string()
      .min(1, 'Default theme is required')
      .default('light'),
    defaultColor: z
      .string()
      .min(1, 'Default color is required')
      .default('gold'),
  }),
  site: z.object({
    name: z.string().min(1, 'Name is required'),
    logo: z.string().min(1, 'logo is required'),
    slogan: z.string().min(1, 'Slogan is required'),
    description: z.string().min(1, 'Description is required'),
    keywords: z.string().min(1, 'Keywords is required'),
    url: z.string().min(1, 'Url is required'),
    email: z.string().min(1, 'Email is required'),
    phone: z.string().min(1, 'Phone is required'),
    author: z.string().min(1, 'Author is required'),
    copyright: z.string().min(1, 'Copyright is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  availableLanguages: z
    .array(SiteLanguageSchema)
    .min(1, 'At least one language is required'),

  carousels: z
    .array(CarouselSchema)
    .min(1, 'At least one language is required'),
  defaultLanguage: z.string().min(1, 'Language is required'),
  availableCurrencies: z
    .array(SiteCurrencySchema)
    .min(1, 'At least one currency is required'),
  defaultCurrency: z.string().min(1, 'Currency is required'),
  availablePaymentMethods: z
    .array(PaymentMethodSchema)
    .min(1, 'At least one payment method is required'),
  defaultPaymentMethod: z.string().min(1, 'Payment method is required'),
  availableDeliveryDates: z
    .array(DeliveryDateSchema)
    .min(1, 'At least one delivery date is required'),
  defaultDeliveryDate: z.string().min(1, 'Delivery date is required'),
  notificationSettings: z
    .object({
      emailNotifications: z.boolean().default(true),
      adminEmail: z
        .string()
        .email('Format email invalide')
        .default('admin@example.com'),
      // Seuils globaux (source unique de vérité)
      globalLowStockThreshold: z.number().min(0).default(5),
      globalCriticalStockThreshold: z.number().min(0).default(2),
      // Anciens champs (dépréciés, conservés pour compatibilité)
      lowStockThreshold: z.number().min(0).default(5),
      criticalStockThreshold: z.number().min(0).default(2),
      notificationFrequency: z
        .enum(['realtime', 'hourly', 'daily'])
        .default('hourly'),
      uiNotificationLevel: z
        .enum(['minimal', 'standard', 'full'])
        .default('standard'),
    })
    .optional(),
})

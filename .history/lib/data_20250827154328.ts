import { Data, IProductInput, IUserInput } from '@/types'
import { toSlug } from './utils'
import bcrypt from 'bcryptjs'
import { i18n } from '@/i18n-config'

const users: IUserInput[] = [
  {
    name: 'John',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'Admin',
    address: {
      fullName: 'John Doe',
      street: '111 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jane Harris',
      street: '222 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1002',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Jack',
    email: 'jack@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jack Ryan',
      street: '333 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1003',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Sarah',
    email: 'sarah@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Sarah Smith',
      street: '444 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1005',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Michael',
    email: 'michael@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'John Alexander',
      street: '555 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1006',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Emily',
    email: 'emily@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Emily Johnson',
      street: '666 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Alice Cooper',
      street: '777 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10007',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Tom',
    email: 'tom@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Tom Hanks',
      street: '888 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10008',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Linda',
    email: 'linda@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Linda Holmes',
      street: '999 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10009',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'George',
    email: 'george@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'George Smith',
      street: '101 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10010',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jessica',
    email: 'jessica@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jessica Brown',
      street: '102 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10011',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Chris',
    email: 'chris@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Chris Evans',
      street: '103 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10012',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Samantha',
    email: 'samantha@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Samantha Wilson',
      street: '104 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10013',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'David',
    email: 'david@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'David Lee',
      street: '105 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10014',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Anna',
    email: 'anna@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Anna Smith',
      street: '106 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10015',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
]

const products: IProductInput[] = [
  {
    name: 'Hikvision Dome Camera 4MP IP Security Camera',
    slug: toSlug('Hikvision Dome Camera 4MP IP Security Camera'),
    category: 'Video Surveillance',
    images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
    tags: ['new-arrival', 'featured', 'todays-deal'],
    isPublished: true,
    price: 89.99,
    listPrice: 129.99,
    brand: 'Hikvision',
    avgRating: 4.71,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 9,
    countInStock: 11,
    description:
      'Caméra de surveillance IP 4MP avec vision nocturne, détection de mouvement et résistance IP67. Parfaite pour la surveillance intérieure et extérieure.',
    specifications: [
      '4MP Resolution',
      'Night Vision',
      'Motion Detection',
      'IP67 Waterproof',
    ],
    compatibility: ['Hikvision NVR', 'Universal ONVIF'],
    sizes: [],
    colors: ['White', 'Black'],
    reviews: [],
  },
  {
    name: 'Dell OptiPlex 7090 Desktop Computer',
    slug: toSlug('Dell OptiPlex 7090 Desktop Computer'),
    category: 'Computer Equipment',
    images: [
      '/images/p12-1.jpg',
      '/images/p12-2.jpg',
      '/images/p12-3.jpg',
      '/images/p12-4.jpg',
    ],
    tags: ['featured'],
    isPublished: true,
    price: 899.99,
    listPrice: 1099.99,
    brand: 'Dell',
    avgRating: 4.2,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 29,
    countInStock: 12,
    description:
      'Professional desktop computer with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for business and professional use.',
    specifications: [
      'Intel Core i7-11700',
      '16GB DDR4 RAM',
      '512GB NVMe SSD',
      'Windows 11 Pro',
    ],
    compatibility: ['Windows 11', 'Office 365', 'Business Software'],
    sizes: [],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Cisco IP Phone 7841',
    slug: toSlug('Cisco IP Phone 7841'),
    category: 'Telephony',
    brand: 'Cisco',
    images: ['/images/p13-1.jpg', '/images/p13-2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 189.99,
    listPrice: 249.99,
    avgRating: 4,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 55,
    countInStock: 13,
    description:
      'Professional IP phone with HD voice quality, large color display, and advanced calling features. Ideal for business communications.',
    specifications: [
      'HD Voice Quality',
      'Color Display',
      'PoE Powered',
      'Gigabit Ethernet',
    ],
    compatibility: ['Cisco CallManager', 'SIP Protocol', 'VoIP Systems'],
    colors: ['Black'],
    reviews: [],
  },
  // Computer Equipment
  {
    name: 'HP EliteBook 840 G8 Laptop',
    slug: toSlug('HP EliteBook 840 G8 Laptop'),
    category: 'Computer Equipment',
    brand: 'HP',
    images: ['/images/p14-1.jpg', '/images/p15-1.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 1299.99,
    listPrice: 1499.99,
    avgRating: 4.5,
    numReviews: 8,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 23,
    countInStock: 7,
    description:
      'Business laptop with Intel Core i7 processor, 16GB RAM, and 14-inch FHD display. Built for productivity and security.',
    specifications: [
      'Intel Core i7-1165G7',
      '16GB DDR4 RAM',
      '512GB SSD',
      '14" FHD Display',
    ],
    compatibility: ['Windows 11 Pro', 'HP Management Tools', 'Business Software'],
    colors: ['Silver'],
    reviews: [],
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    slug: toSlug('Lenovo ThinkPad X1 Carbon'),
    category: 'Computer Equipment',
    brand: 'Lenovo',
    images: ['/images/p16-1.jpg', '/images/p17-1.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 1599.99,
    listPrice: 1899.99,
    avgRating: 4.8,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 3 },
      { rating: 5, count: 12 },
    ],
    numSales: 67,
    countInStock: 9,
    description:
      'Ultra-lightweight business laptop with premium build quality, Intel Core i7 processor, and 16GB RAM. Perfect for executives and professionals.',
    specifications: [
      'Intel Core i7-1185G7',
      '16GB LPDDR4X RAM',
      '1TB PCIe SSD',
      '13.3" 4K Display',
    ],
    compatibility: ['Windows 11 Pro', 'Lenovo Vantage', 'Enterprise Software'],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Apple MacBook Pro 14-inch',
    slug: toSlug('Apple MacBook Pro 14-inch'),
    category: 'Computer Equipment',
    brand: 'Apple',
    images: ['/images/p18-1.jpg', '/images/p19-1.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 1999.99,
    listPrice: 2199.99,
    avgRating: 4.9,
    numReviews: 22,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 20 },
    ],
    numSales: 89,
    countInStock: 5,
    description:
      'Professional MacBook Pro with M2 Pro chip, 16GB unified memory, and 14-inch Liquid Retina XDR display. Built for creative professionals.',
    specifications: [
      'Apple M2 Pro Chip',
      '16GB Unified Memory',
      '512GB SSD',
      '14" Liquid Retina XDR',
    ],
    compatibility: ['macOS Ventura', 'Creative Suite', 'Professional Software'],
    colors: ['Space Gray', 'Silver'],
    reviews: [],
  },
  // Video Surveillance
  {
    name: 'Dahua 4K IP Camera Bullet',
    slug: toSlug('Dahua 4K IP Camera Bullet'),
    category: 'Video Surveillance',
    brand: 'Dahua',
    images: ['/images/p20-1.jpg', '/images/p21-1.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 199.99,
    listPrice: 249.99,
    avgRating: 4.6,
    numReviews: 11,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 7 },
    ],
    numSales: 34,
    countInStock: 8,
    description:
      '4K Ultra HD IP bullet camera with night vision, motion detection, and weatherproof design. Ideal for outdoor surveillance.',
    specifications: [
      '4K Ultra HD Resolution',
      'Night Vision up to 100m',
      'Motion Detection',
      'IP67 Weatherproof',
    ],
    compatibility: ['Dahua NVR', 'ONVIF Protocol', 'Third-party VMS'],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Axis Communications P1445-LE',
    slug: toSlug('Axis Communications P1445-LE'),
    category: 'Video Surveillance',
    brand: 'Axis',
    images: ['/images/p22-1.jpg', '/images/p23-1.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 399.99,
    listPrice: 499.99,
    avgRating: 4.7,
    numReviews: 9,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 7 },
    ],
    numSales: 18,
    countInStock: 6,
    description:
      'Professional dome camera with Lightfinder technology, 4K resolution, and advanced analytics. Perfect for high-security applications.',
    specifications: [
      '4K Resolution',
      'Lightfinder Technology',
      'Advanced Analytics',
      'PoE+ Powered',
    ],
    compatibility: ['Axis Camera Station', 'ONVIF', 'Third-party VMS'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Bosch NBN-83223-000',
    slug: toSlug('Bosch NBN-83223-000'),
    category: 'Video Surveillance',
    brand: 'Bosch',
    images: ['/images/p24-1.jpg', '/images/p25-1.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 299.99,
    listPrice: 349.99,
    avgRating: 4.4,
    numReviews: 13,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 4 },
      { rating: 5, count: 7 },
    ],
    numSales: 42,
    countInStock: 10,
    description:
      'Professional dome camera with 2MP resolution, night vision, and vandal-resistant design. Suitable for indoor and outdoor use.',
    specifications: [
      '2MP Resolution',
      'Night Vision',
      'Vandal Resistant',
      'IP66 Weatherproof',
    ],
    compatibility: ['Bosch Video System', 'ONVIF', 'Third-party NVR'],
    colors: ['White', 'Black'],
    reviews: [],
  },
  // Telephony
  {
    name: 'Yealink T46S IP Phone',
    slug: toSlug('Yealink T46S IP Phone'),
    category: 'Telephony',
    brand: 'Yealink',
    images: ['/images/p26-1.jpg', '/images/p27-1.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 159.99,
    listPrice: 199.99,
    avgRating: 4.3,
    numReviews: 14,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 5 },
      { rating: 5, count: 6 },
    ],
    numSales: 38,
    countInStock: 12,
    description:
      'Advanced IP phone with 7-inch touch screen, HD voice quality, and Bluetooth support. Perfect for modern business communications.',
    specifications: [
      '7" Touch Screen',
      'HD Voice Quality',
      'Bluetooth Support',
      'PoE Powered',
    ],
    compatibility: ['Asterisk', 'FreePBX', '3CX', 'SIP Protocol'],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Grandstream GXP2170 IP Phone',
    slug: toSlug('Grandstream GXP2170 IP Phone'),
    category: 'Telephony',
    brand: 'Grandstream',
    images: ['/images/p28-1.jpg', '/images/p29-1.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 89.99,
    listPrice: 119.99,
    avgRating: 4.1,
    numReviews: 16,
    ratingDistribution: [
      { rating: 1, count: 2 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 6 },
      { rating: 5, count: 5 },
    ],
    numSales: 51,
    countInStock: 15,
    description:
      'Cost-effective IP phone with HD voice quality, 4 programmable keys, and PoE support. Ideal for small to medium businesses.',
    specifications: [
      'HD Voice Quality',
      '4 Programmable Keys',
      'PoE Support',
      'Gigabit Ethernet',
    ],
    compatibility: ['Asterisk', 'FreePBX', 'Grandstream UCM', 'SIP'],
    colors: ['Black'],
    reviews: [],
  },
  // Fire Equipment
  {
    name: 'Kidde Smoke Detector with Carbon Monoxide',
    slug: toSlug('Kidde Smoke Detector with Carbon Monoxide'),
    category: 'Fire',
    brand: 'Kidde',
    images: ['/images/p30-1.jpg', '/images/p31-1.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 49.99,
    listPrice: 69.99,
    avgRating: 4.6,
    numReviews: 19,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 6 },
      { rating: 5, count: 10 },
    ],
    numSales: 73,
    countInStock: 25,
    description:
      'Dual sensor smoke and carbon monoxide detector with 10-year battery life and voice alerts. Essential for home safety.',
    specifications: [
      'Dual Sensor Technology',
      '10-Year Battery Life',
      'Voice Alerts',
      'Interconnect Capable',
    ],
    compatibility: ['Other Kidde Detectors', 'Home Security Systems'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'First Alert Fire Extinguisher 5BC',
    slug: toSlug('First Alert Fire Extinguisher 5BC'),
    category: 'Fire',
    brand: 'First Alert',
    images: ['/images/p32-1.jpg', '/images/p33-1.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 39.99,
    listPrice: 49.99,
    avgRating: 4.8,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 10 },
    ],
    numSales: 95,
    countInStock: 30,
    description:
      '5BC rated fire extinguisher for home and office use. Fights fires involving flammable liquids and electrical equipment.',
    specifications: [
      '5BC Rating',
      '12-Year Warranty',
      'Easy Grip Handle',
      'Wall Mount Bracket',
    ],
    compatibility: ['Standard Wall Mounts', 'Fire Safety Cabinets'],
    colors: ['Red'],
    reviews: [],
  },
  {
    name: 'FireAde 2000 Fire Suppressant',
    slug: toSlug('FireAde 2000 Fire Suppressant'),
    category: 'Fire',
    brand: 'FireAde',
    images: ['/images/p34-1.jpg', '/images/p35-1.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 29.99,
    listPrice: 39.99,
    avgRating: 4.5,
    numReviews: 8,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 67,
    countInStock: 20,
    description:
      'Advanced fire suppressant that cools, coats, and penetrates fires. Safe for use on all types of fires including electrical.',
    specifications: [
      'Multi-Class Fire Rating',
      'Non-Toxic Formula',
      'Long Shelf Life',
      'Easy Cleanup',
    ],
    compatibility: ['Standard Fire Extinguishers', 'Fire Suppression Systems'],
    colors: ['Clear'],
    reviews: [],
  },
]
const reviews = [
  {
    rating: 1,
    title: 'Poor quality',
    comment:
      'Very disappointed. The item broke after just a few uses. Not worth the money.',
  },
  {
    rating: 2,
    title: 'Disappointed',
    comment:
      "Not as expected. The material feels cheap, and it didn't fit well. Wouldn't buy again.",
  },
  {
    rating: 2,
    title: 'Needs improvement',
    comment:
      "It looks nice but doesn't perform as expected. Wouldn't recommend without upgrades.",
  },
  {
    rating: 3,
    title: 'not bad',
    comment:
      'This product is decent, the quality is good but it could use some improvements in the details.',
  },
  {
    rating: 3,
    title: 'Okay, not great',
    comment:
      'It works, but not as well as I hoped. Quality is average and lacks some finishing.',
  },
  {
    rating: 3,
    title: 'Good product',
    comment:
      'This product is amazing, I love it! The quality is top notch, the material is comfortable and breathable.',
  },
  {
    rating: 4,
    title: 'Pretty good',
    comment:
      "Solid product! Great value for the price, but there's room for minor improvements.",
  },
  {
    rating: 4,
    title: 'Very satisfied',
    comment:
      'Good product! High quality and worth the price. Would consider buying again.',
  },
  {
    rating: 4,
    title: 'Absolutely love it!',
    comment:
      'Perfect in every way! The quality, design, and comfort exceeded all my expectations.',
  },
  {
    rating: 4,
    title: 'Exceeded expectations!',
    comment:
      'Fantastic product! High quality, feels durable, and performs well. Highly recommend!',
  },
  {
    rating: 5,
    title: 'Perfect purchase!',
    comment:
      "Couldn't be happier with this product. The quality is excellent, and it works flawlessly!",
  },
  {
    rating: 5,
    title: 'Highly recommend',
    comment:
      "Amazing product! Worth every penny, great design, and feels premium. I'm very satisfied.",
  },
  {
    rating: 5,
    title: 'Just what I needed',
    comment:
      'Exactly as described! Quality exceeded my expectations, and it arrived quickly.',
  },
  {
    rating: 5,
    title: 'Excellent choice!',
    comment:
      'This product is outstanding! Everything about it feels top-notch, from material to functionality.',
  },
  {
    rating: 5,
    title: "Couldn't ask for more!",
    comment:
      "Love this product! It's durable, stylish, and works great. Would buy again without hesitation.",
  },
]

const data: Data = {
  users,
  products,
  reviews,
  webPages: [
    {
      title: 'About Us',
      slug: 'about-us',
      content: `Welcome to [Your Store Name], your trusted destination for quality products and exceptional service. Our journey began with a mission to bring you the best shopping experience by offering a wide range of products at competitive prices, all in one convenient platform.

At [Your Store Name], we prioritize customer satisfaction and innovation. Our team works tirelessly to curate a diverse selection of items, from everyday essentials to exclusive deals, ensuring there's something for everyone. We also strive to make your shopping experience seamless with fast shipping, secure payments, and excellent customer support.

As we continue to grow, our commitment to quality and service remains unwavering. Thank you for choosing [Your Store Name]—we look forward to being a part of your journey and delivering value every step of the way.`,
      isPublished: true,
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      content: `We’re here to help! If you have any questions, concerns, or feedback, please don’t hesitate to reach out to us. Our team is ready to assist you and ensure you have the best shopping experience.

**Customer Support**
For inquiries about orders, products, or account-related issues, contact our customer support team:
- **Email:** support@example.com
- **Phone:** +1 (123) 456-7890
- **Live Chat:** Available on our website from 9 AM to 6 PM (Monday to Friday).

**Head Office**
For corporate or business-related inquiries, reach out to our headquarters:
- **Address:** 1234 E-Commerce St, Suite 567, Business City, BC 12345
- **Phone:** +1 (987) 654-3210

We look forward to assisting you! Your satisfaction is our priority.
`,
      isPublished: true,
    },
    {
      title: 'Help',
      slug: 'help',
      content: `Welcome to our Help Center! We're here to assist you with any questions or concerns you may have while shopping with us. Whether you need help with orders, account management, or product inquiries, this page provides all the information you need to navigate our platform with ease.

**Placing and Managing Orders**
Placing an order is simple and secure. Browse our product categories, add items to your cart, and proceed to checkout. Once your order is placed, you can track its status through your account under the "My Orders" section. If you need to modify or cancel your order, please contact us as soon as possible for assistance.

**Shipping and Returns**
We offer a variety of shipping options to suit your needs, including standard and express delivery. For detailed shipping costs and delivery timelines, visit our Shipping Policy page. If you're not satisfied with your purchase, our hassle-free return process allows you to initiate a return within the specified timeframe. Check our Returns Policy for more details.

**Account and Support**
Managing your account is easy. Log in to update your personal information, payment methods, and saved addresses. If you encounter any issues or need further assistance, our customer support team is available via email, live chat, or phone. Visit our Contact Us page for support hours and contact details.`,
      isPublished: true,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: `We value your privacy and are committed to protecting your personal information. This Privacy Notice explains how we collect, use, and share your data when you interact with our services. By using our platform, you consent to the practices described herein.

We collect data such as your name, email address, and payment details to provide you with tailored services and improve your experience. This information may also be used for marketing purposes, but only with your consent. Additionally, we may share your data with trusted third-party providers to facilitate transactions or deliver products.

Your data is safeguarded through robust security measures to prevent unauthorized access. However, you have the right to access, correct, or delete your personal information at any time. For inquiries or concerns regarding your privacy, please contact our support team.`,
      isPublished: true,
    },
    {
      title: 'Conditions of Use',
      slug: 'conditions-of-use',
      content: `Welcome to [Ecommerce Website Name]. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, including browsing, purchasing products, and interacting with any content or services provided. You must be at least 18 years old or have the consent of a parent or guardian to use this website. Any breach of these terms may result in the termination of your access to our platform.

We strive to ensure all product descriptions, pricing, and availability information on our website are accurate. However, errors may occur, and we reserve the right to correct them without prior notice. All purchases are subject to our return and refund policy. By using our site, you acknowledge that your personal information will be processed according to our privacy policy, ensuring your data is handled securely and responsibly. Please review these terms carefully before proceeding with any transactions.
`,
      isPublished: true,
    },
    {
      title: 'Customer Service',
      slug: 'customer-service',
      content: `At [Your Store Name], our customer service team is here to ensure you have the best shopping experience. Whether you need assistance with orders, product details, or returns, we are committed to providing prompt and helpful support.

If you have questions or concerns, please reach out to us through our multiple contact options:
- **Email:** support@example.com
- **Phone:** +1 (123) 456-7890
- **Live Chat:** Available on our website for instant assistance

We also provide helpful resources such as order tracking, product guides, and FAQs to assist you with common inquiries. Your satisfaction is our priority, and we’re here to resolve any issues quickly and efficiently. Thank you for choosing us!`,
      isPublished: true,
    },
    {
      title: 'Returns Policy',
      slug: 'returns-policy',
      content: 'Returns Policy Content',
      isPublished: true,
    },
    {
      title: 'Careers',
      slug: 'careers',
      content: 'careers Content',
      isPublished: true,
    },
    {
      title: 'Blog',
      slug: 'blog',
      content: 'Blog Content',
      isPublished: true,
    },
    {
      title: 'Sell Products',
      slug: 'sell',
      content: `Sell Products Content`,
      isPublished: true,
    },
    {
      title: 'Become Affiliate',
      slug: 'become-affiliate',
      content: 'Become Affiliate Content',
      isPublished: true,
    },
    {
      title: 'Advertise Your Products',
      slug: 'advertise',
      content: 'Advertise Your Products',
      isPublished: true,
    },
    {
      title: 'Shipping Rates & Policies',
      slug: 'shipping',
      content: 'Shipping Rates & Policies',
      isPublished: true,
    },
  ],
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
    {
      title: 'Most Popular Shoes For Sale',
      buttonCaption: 'Shop Now',
      image: '/images/banner3.jpg',
      url: '/search?category=Shoes',
      isPublished: true,
    },
    {
      title: 'Best Sellers in T-Shirts',
      buttonCaption: 'Shop Now',
      image: '/images/banner1.jpg',
      url: '/search?category=T-Shirts',
      isPublished: true,
    },
    {
      title: 'Best Deals on Wrist Watches',
      buttonCaption: 'See More',
      image: '/images/banner2.jpg',
      url: '/search?category=Wrist Watches',
      isPublished: true,
    },
  ],
  settings: [
    {
      common: {
        freeShippingMinPrice: 35,
        isMaintenanceMode: false,
        defaultTheme: 'Light',
        defaultColor: 'Gold',
        pageSize: 9,
      },
      site: {
        name: 'NxtAmzn',
        description:
          'NxtAmzn is a sample Ecommerce website built with Next.js, Tailwind CSS, and MongoDB.',
        keywords: 'Next Ecommerce, Next.js, Tailwind CSS, MongoDB',
        url: 'https://next-mongo-ecommerce-final.vercel.app',
        logo: '/icons/logo.svg',
        slogan: 'Spend less, enjoy more.',
        author: 'Next Ecommerce',
        copyright: '2000-2024, Next-Ecommerce.com, Inc. or its affiliates',
        email: 'admin@example.com',
        address: '123, Main Street, Anytown, CA, Zip 12345',
        phone: '+1 (123) 456-7890',
      },
      carousels: [
        {
          title: 'Most Popular Shoes For Sale',
          buttonCaption: 'Shop Now',
          image: '/images/banner3.jpg',
          url: '/search?category=Shoes',
        },
        {
          title: 'Best Sellers in T-Shirts',
          buttonCaption: 'Shop Now',
          image: '/images/banner1.jpg',
          url: '/search?category=T-Shirts',
        },
        {
          title: 'Best Deals on Wrist Watches',
          buttonCaption: 'See More',
          image: '/images/banner2.jpg',
          url: '/search?category=Wrist Watches',
        },
      ],
      availableLanguages: i18n.locales.map((locale) => ({
        code: locale.code,
        name: locale.name,
      })),
      defaultLanguage: 'en-US',
      availableCurrencies: [
        {
          name: 'United States Dollar',
          code: 'USD',
          symbol: '$',
          convertRate: 1,
        },
        { name: 'Euro', code: 'EUR', symbol: '€', convertRate: 0.96 },
        { name: 'UAE Dirham', code: 'AED', symbol: 'AED', convertRate: 3.67 },
      ],
      defaultCurrency: 'USD',
      availablePaymentMethods: [
        { name: 'PayPal', commission: 0 },
        { name: 'Stripe', commission: 0 },
        { name: 'Cash On Delivery', commission: 0 },
      ],
      defaultPaymentMethod: 'PayPal',
      availableDeliveryDates: [
        {
          name: 'Tomorrow',
          daysToDeliver: 1,
          shippingPrice: 12.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 3 Days',
          daysToDeliver: 3,
          shippingPrice: 6.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 5 Days',
          daysToDeliver: 5,
          shippingPrice: 4.9,
          freeShippingMinPrice: 35,
        },
      ],
      defaultDeliveryDate: 'Next 5 Days',
    },
  ],
}

export default data

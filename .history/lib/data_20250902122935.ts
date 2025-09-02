import { Data, IProductInput, IUserInput, ICategoryInput } from '@/types'
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

const categories: ICategoryInput[] = [
  // Catégories principales
  {
    name: 'Computer Equipment',
    slug: 'computer-equipment',
    description: 'Ordinateurs, moniteurs, imprimantes et accessoires informatiques',
    image: '/images/categories/computer-equipment.jpg',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Video Surveillance',
    slug: 'video-surveillance',
    description: 'Systèmes de surveillance vidéo et caméras de sécurité',
    image: '/images/categories/video-surveillance.jpg',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Telephony',
    slug: 'telephony',
    description: 'Solutions de téléphonie IP et équipements de communication',
    image: '/images/categories/telephony.jpg',
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'Fire Safety',
    slug: 'fire-safety',
    description: 'Équipements de sécurité incendie et détecteurs',
    image: '/images/categories/fire-safety.jpg',
    isActive: true,
    sortOrder: 4,
  },
]

const products: IProductInput[] = [
  {
    name: 'Hikvision Dome Camera 4MP IP Security Camera',
    slug: toSlug('Hikvision Dome Camera 4MP IP Security Camera'),
    category: 'Video Surveillance',
    subCategory: 'IP Cameras',
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
      '2.8mm Fixed Lens',
      'H.265+ Compression',
      'Built-in Microphone',
      'Power over Ethernet (PoE)',
    ],
    compatibility: [
      'Hikvision NVR',
      'Universal ONVIF',
      'Hikvision App',
      'Web Browser',
    ],
    colors: ['White', 'Black'],
    reviews: [],
  },
  {
    name: 'Dahua IP Camera 2MP Bullet Security Camera',
    slug: toSlug('Dahua IP Camera 2MP Bullet Security Camera'),
    category: 'Video Surveillance',
    subCategory: 'IP Cameras',
    images: [
      '/images/p12-1.jpg',
      '/images/p12-2.jpg',
      '/images/p12-3.jpg',
      '/images/p12-4.jpg',
    ],
    tags: ['featured', 'best-seller'],
    isPublished: true,
    price: 67.99,
    listPrice: 89.99,
    brand: 'Dahua',
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
      "Caméra de surveillance IP bullet 2MP avec vision nocturne jusqu'à 30m, détection de mouvement intelligente et résistance IP67. Idéale pour la surveillance extérieure.",
    specifications: [
      '2MP Resolution',
      'Night Vision 30m',
      'Smart Motion Detection',
      'IP67 Waterproof',
      '3.6mm Fixed Lens',
      'H.264+ Compression',
      'Built-in IR LEDs',
      'Power over Ethernet (PoE)',
    ],
    compatibility: ['Dahua NVR', 'Universal ONVIF', 'Dahua App', 'Web Browser'],
    colors: ['Black', 'White'],
    reviews: [],
  },
  {
    name: 'Samsung 24" LED Monitor Full HD',
    slug: toSlug('Samsung 24 LED Monitor Full HD'),
    category: 'Computer Equipment',
    subCategory: 'Monitors',
    brand: 'Samsung',
    images: ['/images/p13-1.jpg', '/images/p13-2.jpg'],
    tags: ['best-seller', 'featured'],
    isPublished: true,
    price: 149.99,
    listPrice: 199.99,
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
      'Moniteur LED Samsung 24 pouces avec résolution Full HD 1920x1080, temps de réponse 5ms et design ultra-fin. Parfait pour le travail, la bureautique et les jeux occasionnels.',
    specifications: [
      '24" Display',
      'Full HD 1920x1080',
      '5ms Response Time',
      'VGA/HDMI Ports',
      '60Hz Refresh Rate',
      '250 cd/m² Brightness',
      '1000:1 Contrast Ratio',
      '178° Viewing Angle',
    ],
    compatibility: [
      'Windows',
      'macOS',
      'Linux',
      'Universal',
      'HDMI 1.4',
      'VGA',
    ],
    colors: ['Black', 'Silver'],
    reviews: [],
  },
  {
    name: 'Dell OptiPlex 7090 Desktop Computer',
    slug: toSlug('Dell OptiPlex 7090 Desktop Computer'),
    category: 'Computer Equipment',
    subCategory: 'Desktop Computers',
    brand: 'Dell',
    images: ['/images/p14-1.jpg', '/images/p14-2.jpg'],
    tags: ['new-arrival', 'best-seller', 'todays-deal'],
    isPublished: true,
    price: 899.99,
    listPrice: 1199.99,
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
      'Ordinateur de bureau Dell OptiPlex 7090 avec processeur Intel Core i5, 8GB RAM, 256GB SSD et Windows 11 Pro. Idéal pour les entreprises et la bureautique.',
    specifications: [
      'Intel Core i5-10500',
      '8GB DDR4 RAM',
      '256GB NVMe SSD',
      'Windows 11 Pro',
      'Intel UHD Graphics 630',
      'Gigabit Ethernet',
      'USB 3.2 Gen 1',
      'DisplayPort 1.4',
    ],
    compatibility: [
      'Windows 11',
      'Universal',
      'Dell Support',
      'Enterprise Software',
    ],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'HP LaserJet Pro M404n Printer',
    slug: toSlug('HP LaserJet Pro M404n Printer'),
    category: 'Computer Equipment',
    subCategory: 'Printers',
    brand: 'HP',
    images: ['/images/p15-1.jpg', '/images/p15-2.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 299.99,
    listPrice: 399.99,
    avgRating: 4.3,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 5 },
      { rating: 5, count: 6 },
    ],
    numSales: 34,
    countInStock: 9,
    description:
      "Imprimante laser HP LaserJet Pro M404n avec impression monochrome haute qualité, connectivité réseau et impression rapide jusqu'à 40 ppm.",
    specifications: [
      'Monochrome Laser',
      '40 ppm',
      'Network Ready',
      'Duplex Printing',
      '1200 x 1200 dpi',
      'Ethernet Port',
      'USB 2.0',
      '250-sheet Tray',
    ],
    compatibility: ['Windows', 'macOS', 'Linux', 'Universal', 'HP Smart App'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Cisco IP Phone 7841',
    slug: toSlug('Cisco IP Phone 7841'),
    category: 'Telephony',
    brand: 'Cisco',
    images: ['/images/p16-1.jpg', '/images/p16-2.jpg'],
    tags: ['new-arrival', 'featured'],
    isPublished: true,
    price: 89.99,
    listPrice: 129.99,
    avgRating: 4.6,
    numReviews: 11,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 7 },
    ],
    numSales: 18,
    countInStock: 14,
    description:
      'Téléphone IP Cisco 7841 avec écran LCD, support des codecs G.711 et G.729, et compatibilité avec les systèmes de téléphonie IP.',
    specifications: [
      'IP Phone',
      'LCD Display',
      'G.711/G.729 Codecs',
      'PoE Compatible',
      'Gigabit Ethernet',
      'HD Audio',
      'Programmable Keys',
      'Headset Port',
    ],
    compatibility: [
      'Cisco Call Manager',
      'Universal SIP',
      'Cisco IP Communicator',
      'Web Browser',
    ],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Kidde Fire Extinguisher 10-B:C',
    slug: toSlug('Kidde Fire Extinguisher 10-B:C'),
    category: 'Fire',
    brand: 'Kidde',
    images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
    tags: ['best-seller', 'featured', 'todays-deal'],
    isPublished: true,
    price: 45.99,
    listPrice: 59.99,
    avgRating: 4.8,
    numReviews: 25,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 4 },
      { rating: 5, count: 20 },
    ],
    numSales: 67,
    countInStock: 22,
    description:
      "Extincteur d'incendie Kidde 10-B:C avec agent chimique sec, poignée ergonomique et indicateur de pression. Certifié UL et CSA.",
    specifications: [
      '10-B:C Rating',
      'Dry Chemical',
      'Pressure Gauge',
      'UL/CSA Certified',
      '2.5 lb Capacity',
      'Easy-grip Handle',
      'Metal Valve',
      'Wall Mount Bracket',
    ],
    compatibility: [
      'Universal',
      'Commercial Use',
      'Residential Use',
      'Vehicle Use',
    ],
    colors: ['Red'],
    reviews: [],
  },
  {
    name: 'First Alert Smoke Detector Battery Powered',
    slug: toSlug('First Alert Smoke Detector Battery Powered'),
    category: 'Fire',
    brand: 'First Alert',
    images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
    tags: ['new-arrival', 'best-seller'],
    isPublished: true,
    price: 19.99,
    listPrice: 29.99,
    avgRating: 4.4,
    numReviews: 18,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 5 },
      { rating: 5, count: 10 },
    ],
    numSales: 45,
    countInStock: 31,
    description:
      'Détecteur de fumée First Alert alimenté par pile avec technologie photélectrique, bouton de test et alarme de 85 dB.',
    specifications: [
      'Photoelectric Technology',
      '85 dB Alarm',
      'Battery Powered',
      'Test Button',
      'Low Battery Indicator',
      'Hush Feature',
      'Tamper-resistant Design',
      '10-Year Warranty',
    ],
    compatibility: [
      'Universal',
      'Residential Use',
      'Commercial Use',
      '9V Battery',
    ],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Laptop',
    slug: toSlug('Lenovo ThinkPad X1 Carbon Laptop'),
    category: 'Computer Equipment',
    brand: 'Lenovo',
    images: ['/images/p23-1.jpg', '/images/p23-2.jpg'],
    tags: ['featured', 'premium'],
    isPublished: true,
    price: 1499.99,
    listPrice: 1899.99,
    avgRating: 4.7,
    numReviews: 16,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 12 },
    ],
    numSales: 12,
    countInStock: 5,
    description:
      'Ordinateur portable Lenovo ThinkPad X1 Carbon avec processeur Intel Core i7, 16GB RAM, 512GB SSD et écran 14" 4K. Ultra-léger et ultra-performant.',
    specifications: [
      'Intel Core i7-1165G7',
      '16GB LPDDR4X RAM',
      '512GB NVMe SSD',
      '14" 4K Display',
      'Intel Iris Xe Graphics',
      'Thunderbolt 4',
      'Wi-Fi 6',
      'Fingerprint Reader',
    ],
    compatibility: [
      'Windows 11',
      'Universal',
      'Lenovo Vantage',
      'Enterprise Software',
    ],
    colors: ['Black'],
    reviews: [],
  },
  {
    name: 'Western Digital 2TB Internal Hard Drive',
    slug: toSlug('Western Digital 2TB Internal Hard Drive'),
    category: 'Computer Equipment',
    brand: 'Western Digital',
    images: ['/images/p24-1.jpg', '/images/p24-2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 59.99,
    listPrice: 79.99,
    avgRating: 4.2,
    numReviews: 22,
    ratingDistribution: [
      { rating: 1, count: 2 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 6 },
      { rating: 5, count: 11 },
    ],
    numSales: 89,
    countInStock: 28,
    description:
      'Disque dur interne Western Digital 2TB avec interface SATA 6Gb/s, vitesse de rotation 7200 RPM et technologie IntelliPower.',
    specifications: [
      '2TB Capacity',
      'SATA 6Gb/s',
      '7200 RPM',
      'IntelliPower Technology',
      '64MB Cache',
      '3.5" Form Factor',
      'Low Power Consumption',
      '5-Year Warranty',
    ],
    compatibility: [
      'Windows',
      'macOS',
      'Linux',
      'Universal',
      'SATA III',
      'Backward Compatible',
    ],
    colors: ['Black'],
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
      content: `Welcome to MendelCorp, your premier destination for cutting-edge technology solutions and professional equipment. Founded with a vision to bridge the gap between innovation and accessibility, MendelCorp has established itself as a leading e-commerce platform specializing in computer equipment, security systems, telephony solutions, and fire safety products.

At MendelCorp, we understand that technology is the backbone of modern business and security. Our expert team carefully curates a comprehensive selection of products from world-renowned brands, ensuring that every item meets our rigorous standards for quality, reliability, and performance. Whether you're equipping an enterprise, securing a facility, or upgrading your personal tech setup, we provide the tools you need to succeed.

Our commitment extends beyond just selling products – we're your technology partners, offering expert guidance, comprehensive support, and innovative solutions that drive your success. As we continue to evolve with the rapidly changing tech landscape, our dedication to excellence and customer satisfaction remains unwavering. Thank you for choosing MendelCorp – together, we're building a more secure and technologically advanced future.`,
      isPublished: true,
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      content: `We’re here to help! If you have any questions, concerns, or feedback, please don’t hesitate to reach out to us. Our team is ready to assist you and ensure you have the best shopping experience.

**Technical Support & Sales**
For product inquiries, technical specifications, compatibility questions, or order assistance, contact our technology experts:
- **Email:** support@mendelcorp.com
- **Phone:** +1 (555) 123-4567
- **Live Chat:** Available on our website from 8 AM to 8 PM (Monday to Friday).
- **Technical Consultation:** Schedule a free consultation with our technology specialists.

**Corporate & Enterprise Solutions**
For enterprise solutions, bulk orders, or corporate partnerships, reach out to our business development team:
- **Email:** enterprise@mendelcorp.com
- **Phone:** +1 (555) 123-4568
- **Address:** 123, Tech Innovation Drive, Silicon Valley, CA, Zip 94025

**After-Sales Support**
Our commitment doesn't end with the sale. We provide comprehensive after-sales support including installation guidance, troubleshooting, and ongoing technical assistance.

We look forward to being your technology partner! Your success is our priority.
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
      title: 'Best Deals on Computer Equipment',
      buttonCaption: 'Shop Now',
      image: '/images/banner3.jpg',
      url: '/search?category=Computer Equipment',
      isPublished: true,
    },
    {
      title: 'Professional Video Surveillance Systems',
      buttonCaption: 'Shop Now',
      image: '/images/banner1.jpg',
      url: '/search?category=Video Surveillance',
      isPublished: true,
    },
    {
      title: 'Advanced Telephony Solutions',
      buttonCaption: 'See More',
      image: '/images/banner2.jpg',
      url: '/search?category=Telephony',
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
        name: 'MendelCorp',
        description:
          'MendelCorp is a leading e-commerce platform specializing in cutting-edge technology products, computer equipment, security systems, and professional telephony solutions.',
        keywords:
          'Technology, Computer Equipment, Security Systems, Telephony, Fire Safety, Professional Equipment, MendelCorp',
        url: 'https://mendelcorp.com',
        logo: '/icons/logo.png',
        slogan: 'Empowering Technology, Securing Tomorrow.',
        author: 'MendelCorp',
        copyright: '2017-2024, MendelCorp.com, Inc. or its affiliates',
        email: 'admin@mendelcorp.com',
        address: '123, Tech Innovation Drive, Silicon Valley, CA, Zip 94025',
        phone: '+1 (555) 123-4567',
      },
      carousels: [
        {
          title: 'Best Deals on Computer Equipment',
          buttonCaption: 'Shop Now',
          image: '/images/banner3.jpg',
          url: '/search?category=Computer Equipment',
        },
        {
          title: 'Professional Video Surveillance Systems',
          buttonCaption: 'Shop Now',
          image: '/images/banner1.jpg',
          url: '/search?category=Video Surveillance',
        },
        {
          title: 'Advanced Telephony Solutions',
          buttonCaption: 'See More',
          image: '/images/banner2.jpg',
          url: '/search?category=Telephony',
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
        {
          name: "Franc CFA (Afrique de l'Ouest)",
          code: 'XOF',
          symbol: 'CFA',
          convertRate: 655.957,
        },
      ],
      defaultCurrency: 'USD',
      availablePaymentMethods: [{ name: 'Cash On Delivery', commission: 0 }],
      defaultPaymentMethod: 'Cash On Delivery',
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

/* ═══════════════════════════════════════════════════
   IDEAL HAIR PRODUCTS — data.js
   ─────────────────────────────────────────────────
   This is your DATA LAYER (frontend backend).
   All products, reviews, brand content, and contact
   info live here. Edit this file to update the site.

   Loaded BEFORE app.js in index.html.
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── PRODUCTS ────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name:     'Vitamin E Detangler',
    price:    30,
    category: 'treatment',
    emoji:    '🌿',
    badge:    'Bestseller',
    desc:     'Gently detangles and softens hair while locking in moisture. Enriched with vitamin E for strength and shine.',
    benefits: ['Reduces breakage and split ends','Adds lasting moisture','Safe for all hair types','Can be used daily'],
    featured: true
  },
  {
    id: 2,
    name:     'Ideal Organic Natural',
    price:    40,
    category: 'treatment',
    emoji:    '🍃',
    badge:    'Organic',
    desc:     'Our signature organic blend combining African botanicals to deeply nourish and revive dull, dry hair.',
    benefits: ['Deep moisturising formula','Strengthens hair shaft','Promotes healthy growth','100% organic ingredients'],
    featured: true
  },
  {
    id: 3,
    name:     'Lanolin Oil',
    price:    25,
    category: 'oil',
    emoji:    '✨',
    badge:    'Pure',
    desc:     'Premium lanolin oil that penetrates deep into the hair shaft to condition, strengthen and add brilliant shine.',
    benefits: ['Deep conditioning treatment','Restores elasticity','Reduces frizz and flyaways','Adds mirror-like shine'],
    featured: false
  },
  {
    id: 4,
    name:     'Texturizer',
    price:    40,
    category: 'styling',
    emoji:    '💪',
    badge:    '',
    desc:     'Defines and enhances your natural curl pattern for a beautifully textured look that lasts all day.',
    benefits: ['Defines curl pattern','Long-lasting hold','No crunch or flaking','Frizz control all day'],
    featured: false
  },
  {
    id: 5,
    name:     'Classic Gold Shampoo',
    price:    30,
    category: 'shampoo',
    emoji:    '🥇',
    badge:    'Gold',
    desc:     'A luxurious 2-in-1 shampoo and conditioner infused with gold extracts that cleanses, conditions and adds brilliant shine.',
    benefits: ['Cleanses without stripping','Built-in conditioning','Gold extract shine boost','Colour-safe formula'],
    featured: true
  },
  {
    id: 6,
    name:     'Creamy Mint Conditioner',
    price:    35,
    category: 'conditioner',
    emoji:    '🌸',
    badge:    'Mint',
    desc:     'A refreshing creamy conditioner with real peppermint extracts that deeply moisturises and invigorates the scalp.',
    benefits: ['Deep moisture replenishment','Soothes scalp irritation','Refreshing peppermint scent','Detangles easily'],
    featured: false
  },
  {
    id: 7,
    name:     'Styling Gel',
    price:    35,
    category: 'styling',
    emoji:    '💧',
    badge:    '',
    desc:     'A firm-hold, no-flake styling gel that keeps your styles perfectly in place while protecting hair from humidity.',
    benefits: ['Strong hold, no crunch','Humidity resistant','No white residue','Nourishes while styling'],
    featured: false
  },
  {
    id: 8,
    name:     'African Shea Butter Pomade',
    price:    30,
    category: 'treatment',
    emoji:    '🧴',
    badge:    'African',
    desc:     'Rich with authentic West African shea butter, this pomade seals in moisture for all-day softness and manageability.',
    benefits: ['Authentic African shea butter','Seals in moisture for 24h','Reduces breakage','Softens coarse hair'],
    featured: true
  },
  {
    id: 9,
    name:     'Leave-In Conditioner',
    price:    30,
    category: 'conditioner',
    emoji:    '🌺',
    badge:    '',
    desc:     'A lightweight yet powerful leave-in conditioner that keeps hair moisturised, soft and manageable throughout the day.',
    benefits: ['No-rinse formula','All-day moisture','Reduces tangles','Lightweight feel'],
    featured: true
  },
  {
    id: 10,
    name:     'Ideal Oil Serum',
    price:    25,
    category: 'oil',
    emoji:    '💎',
    badge:    'Serum',
    desc:     'A luxurious multi-purpose serum that instantly adds brilliant gloss, tames frizz and protects against heat damage.',
    benefits: ['Instant gloss and shine','Tames frizz in seconds','Heat protectant up to 230°C','Non-greasy formula'],
    featured: false
  },
  {
    id: 11,
    name:     'Scalp Nourish Spray',
    price:    28,
    category: 'treatment',
    emoji:    '🌾',
    badge:    'New',
    desc:     'A targeted scalp spray packed with vitamins and plant extracts to soothe dryness, itching and promote hair growth.',
    benefits: ['Soothes dry, itchy scalp','Promotes hair growth','Lightweight spray formula','Daily use safe'],
    featured: false
  },
  {
    id: 12,
    name:     'Hydrating Hair Mask',
    price:    45,
    category: 'treatment',
    emoji:    '🫙',
    badge:    'Intensive',
    desc:     'An intensive deep treatment mask that restores moisture, repairs damage and brings even the most distressed hair back to life.',
    benefits: ['Intensive repair formula','Restores shine in 1 use','Reduces breakage by 80%','Weekly treatment'],
    featured: true
  }
];

/* ── PRODUCT CATEGORIES ────────────────────────────── */
const CATEGORIES = [
  { value: 'all',        label: 'All Products' },
  { value: 'treatment',  label: 'Treatments'   },
  { value: 'shampoo',    label: 'Shampoos'     },
  { value: 'conditioner',label: 'Conditioners' },
  { value: 'styling',    label: 'Styling'      },
  { value: 'oil',        label: 'Oils & Serums'},
];

/* ── CUSTOMER REVIEWS ────────────────────────────── */
let REVIEWS = [
  {
    id: 1, name: 'Akosua Mensah', loc: 'Kumasi, Ashanti',
    stars: 5, product: 'African Shea Butter Pomade',
    text: 'My hair has never felt this soft in my life! The Shea Butter Pomade is absolutely incredible. Been using Ideal Hair for 6 months and I will never go back.',
    date: '2025-03-12'
  },
  {
    id: 2, name: 'Fatima Karimu', loc: 'Accra, Greater Accra',
    stars: 5, product: 'Vitamin E Detangler',
    text: 'The Vitamin E Detangler saved my natural hair journey. No more breakage, no more tears — literally! My daughters use it too. Highly recommended to every natural.',
    date: '2025-03-08'
  },
  {
    id: 3, name: 'Grace Asante', loc: 'Takoradi, Western',
    stars: 5, product: 'Classic Gold Shampoo',
    text: 'I love that these are 100% organic. The Gold Shampoo smells absolutely amazing and leaves my hair so clean and bouncy. I tell everyone I know about Ideal Hair.',
    date: '2025-02-28'
  },
  {
    id: 4, name: 'Esi Boateng', loc: 'Cape Coast, Central',
    stars: 5, product: 'Leave-In Conditioner',
    text: 'Tried the Leave-In Conditioner last month and I am completely obsessed. My curls look so defined and moisturised all week long. Reordering immediately.',
    date: '2025-02-20'
  },
  {
    id: 5, name: 'Abena Osei', loc: 'Sunyani, Bono',
    stars: 5, product: 'Ideal Organic Natural',
    text: 'FDA approved organic products at this price range? Ideal Hair is a real gem. I could not believe the quality when I first tried it. Will be ordering again.',
    date: '2025-02-15'
  },
  {
    id: 6, name: 'Nana Yeboah', loc: 'Tamale, Northern',
    stars: 5, product: 'Lanolin Oil',
    text: 'The Lanolin Oil is worth every pesewa. My scalp feels so healthy and I have noticed my hair growing much faster since I started using it three months ago.',
    date: '2025-02-10'
  },
  {
    id: 7, name: 'Maame Ama Darko', loc: 'Tema, Greater Accra',
    stars: 4, product: 'Styling Gel',
    text: 'The Styling Gel gives great hold without any crunch or flaking. My edges lay perfectly all day even in the heat. Great product, will definitely buy again!',
    date: '2025-01-30'
  },
  {
    id: 8, name: 'Adwoa Amponsah', loc: 'Koforidua, Eastern',
    stars: 5, product: 'Hydrating Hair Mask',
    text: 'This hair mask is a complete game changer. I used it once and my hair felt like a completely different texture — so smooth and shiny. Worth every cedi.',
    date: '2025-01-22'
  },
  {
    id: 9, name: 'Serwaa Adusei', loc: 'Bolgatanga, Upper East',
    stars: 5, product: 'Creamy Mint Conditioner',
    text: 'The Creamy Mint Conditioner smells so refreshing and really works. My scalp irritation is completely gone and my hair feels incredibly soft after every wash.',
    date: '2025-01-18'
  }
];

/* ── COMPANY VALUES ────────────────────────────── */
const VALUES = [
  { ico: '🌱', title: 'Pure Ingredients', desc: 'We use only certified organic, sustainably sourced ingredients — no parabens, sulfates or hidden nasties.' },
  { ico: '🌍', title: 'African Heritage', desc: 'Every formula is inspired by West African hair traditions passed down through generations.' },
  { ico: '🐾', title: 'Cruelty-Free Always', desc: 'We never test on animals. Every product is 100% vegan and cruelty-free certified.' },
  { ico: '🏥', title: 'FDA Approved', desc: 'All products are vetted and approved by the Ghana FDA for your safety and peace of mind.' },
  { ico: '🌱', title: 'Eco Packaging', desc: 'We\'re committed to reducing our environmental impact with recyclable and sustainable packaging.' },
  { ico: '🤝', title: 'Community First', desc: 'We employ and uplift local Ghanaian communities and source ingredients from local farmers.' },
  { ico: '🔬', title: 'Science + Nature', desc: 'Our formulas combine traditional botanical wisdom with modern hair science for real results.' },
  { ico: '💯', title: 'Satisfaction Guaranteed', desc: 'Not happy? We\'ll make it right. Your satisfaction is our promise.' },
];

/* ── KEY INGREDIENTS ────────────────────────────── */
const INGREDIENTS = [
  { ico: '🌰', name: 'African Shea Butter', benefit: 'Deep moisture, strengthens hair and seals split ends' },
  { ico: '🫒', name: 'Lanolin Oil',          benefit: 'Conditions, adds shine and restores hair elasticity' },
  { ico: '🌿', name: 'Vitamin E',            benefit: 'Antioxidant protection and promotes hair growth' },
  { ico: '🌱', name: 'Peppermint Extract',   benefit: 'Invigorates scalp and stimulates hair follicles' },
  { ico: '✨', name: 'Gold Extracts',         benefit: 'Adds brilliant shine and improves hair texture' },
  { ico: '🌺', name: 'Hibiscus Flower',       benefit: 'Prevents breakage and adds volume naturally' },
  { ico: '🥥', name: 'Coconut Oil',           benefit: 'Penetrates hair shaft for deep conditioning' },
  { ico: '🌾', name: 'Aloe Vera',             benefit: 'Soothes scalp, adds moisture and reduces frizz' },
];

/* ── CONTACT INFORMATION ────────────────────────── */
const CONTACT_INFO = [
  { ico: '📍', label: 'Location',       value: 'Kumasi, Ashanti Region, Ghana' },
  { ico: '📱', label: 'Phone / WhatsApp', value: '+233 XX XXX XXXX' },
  { ico: '✉️', label: 'Email',           value: 'info@idealhairgh.com' },
  { ico: '🕐', label: 'Business Hours',  value: 'Monday – Saturday, 8:00am – 6:00pm' },
];

/* ── REVIEW STATS ────────────────────────────────── */
const REVIEW_STATS = [
  { num: '1,200+', stars: '★★★★★', label: 'Total Reviews' },
  { num: '4.9',    stars: '★★★★★', label: 'Average Rating' },
  { num: '98%',    stars: '★★★★★', label: 'Would Recommend' },
  { num: '12,000+',stars: '',       label: 'Happy Customers' },
];

/* ── HELPER UTILITIES (used by app.js) ───────────── */

/**
 * Filter products by category
 */
function filterProductsByCategory(cat) {
  if (cat === 'all') return [...PRODUCTS];
  return PRODUCTS.filter(p => p.category === cat);
}

/**
 * Search products by name or description
 */
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [...PRODUCTS];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

/**
 * Sort product array
 */
function sortProducts(arr, mode) {
  const copy = [...arr];
  if (mode === 'price-asc')  return copy.sort((a,b) => a.price - b.price);
  if (mode === 'price-desc') return copy.sort((a,b) => b.price - a.price);
  if (mode === 'name')       return copy.sort((a,b) => a.name.localeCompare(b.name));
  return copy;
}

/**
 * Get a product by ID
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Get featured products for the homepage
 */
function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured);
}

/**
 * Add a new review to the in-memory list
 */
function addReview(review) {
  const newReview = {
    id:      Date.now(),
    name:    review.name,
    loc:     review.loc,
    product: review.product,
    stars:   review.stars,
    text:    review.text,
    date:    new Date().toISOString().split('T')[0]
  };
  REVIEWS.unshift(newReview);   // newest first
  return newReview;
}

/**
 * Filter reviews by product name
 */
function filterReviews(productName) {
  if (!productName || productName === 'All Products') return [...REVIEWS];
  return REVIEWS.filter(r => r.product === productName);
}

/* ── CART PERSISTENCE (localStorage) ─────────────── */
const CartStore = {
  key: 'idealHairCart',

  load() {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch { return []; }
  },

  save(cart) {
    localStorage.setItem(this.key, JSON.stringify(cart));
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};

/* ── ORDER PERSISTENCE (localStorage) ───────────── */
const OrderStore = {
  key: 'idealHairOrders',

  save(order) {
    const orders = this.all();
    orders.push({ ...order, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem(this.key, JSON.stringify(orders));
  },

  all() {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch { return []; }
  }
};
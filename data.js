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
let PRODUCTS = [];

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
let REVIEWS = [];

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
function getReviewStats() {
  const total = REVIEWS.length;
  if (total === 0) return { avg: 5, count: 0, percent: 100 };
  
  const avg = (REVIEWS.reduce((sum, r) => sum + r.stars, 0) / total).toFixed(1);
  const percent = total > 0 ? 100 : 98; // simplify for now
  
  return { avg, count: total, percent };
} 

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
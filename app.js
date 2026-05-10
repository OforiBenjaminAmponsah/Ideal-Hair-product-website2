/* ═══════════════════════════════════════════════════
   IDEAL HAIR PRODUCTS — app.js
   ─────────────────────────────────────────────────
   Frontend application logic.
   Reads all data from data.js.
   Manipulates the DOM in index.html.
   Styled by style.css.

   Requires: data.js to be loaded first.
   ═══════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   APP STATE
══════════════════════════════════════ */
let cart           = CartStore.load();   // from data.js
let currentPage    = 'home';
let currentFilter  = 'all';
let currentSort    = 'default';
let currentSearch  = '';
let selectedStars  = 5;
let currentReviewFilter = 'All Products';
let modalOpen      = false;

const API_URL = 'http://localhost:5000/api';

/* ══════════════════════════════════════
   INIT — runs when DOM is ready
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const pRes = await fetch(`${API_URL}/products`);
    PRODUCTS = await pRes.json();
    
    const rRes = await fetch(`${API_URL}/reviews`);
    REVIEWS = await rRes.json();
  } catch (err) {
    console.error("Failed to fetch data from API:", err);
  }

  renderHome();
  renderFilterBar();
  renderProducts();
  renderAbout();
  renderReviews();
  renderContact();
  renderFooter();
  renderCart();
  updateBadge();
  setupStarPicker();
  setupScrollAnimations();
  setupNavScroll();
  populateReviewProductSelect();
});

/* ══════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════ */
function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  currentPage = name;

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`showPage('${name}')`)) {
      link.classList.add('active');
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger animations on the newly shown page
  setTimeout(triggerVisibleAnimations, 80);
}

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
function renderHome() {
  renderFeaturedProducts();
  renderMiniReviewStrip();
}

function renderFeaturedProducts() {
  const grid = document.getElementById('homeFeaturedGrid');
  if (!grid) return;
  const featured = getFeaturedProducts();
  grid.innerHTML = featured.map(p => productCardHTML(p)).join('');
}

function renderMiniReviewStrip() {
  const track = document.getElementById('miniReviewTrack');
  if (!track) return;
  // Duplicate for seamless loop
  const pills = [...REVIEWS, ...REVIEWS].map(r => `
    <div class="mr-pill">
      <span class="mr-stars">${'★'.repeat(r.stars)}</span>
      <span class="mr-txt">"${r.text.substring(0, 55)}…"</span>
      <span class="mr-name">— ${r.name}</span>
    </div>
  `).join('');
  track.innerHTML = pills;
}

/* ══════════════════════════════════════
   PRODUCTS PAGE
══════════════════════════════════════ */
function renderFilterBar() {
  const bar = document.getElementById('filterBar');
  if (!bar) return;
  bar.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat.value === currentFilter ? 'active' : ''}"
            onclick="setFilter('${cat.value}', this)">
      ${cat.label}
    </button>
  `).join('');
}

function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const count = document.getElementById('resultsCount');
  if (!grid) return;

  let items = currentSearch
    ? searchProducts(currentSearch)
    : filterProductsByCategory(currentFilter);

  items = sortProducts(items, currentSort);

  if (count) {
    count.textContent = items.length === 0
      ? 'No products found'
      : `Showing ${items.length} product${items.length !== 1 ? 's' : ''}`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px">
        <div style="font-size:48px;margin-bottom:14px">🔍</div>
        <p style="color:var(--txt-mute);font-size:16px">No products match your search. Try a different term.</p>
        <button class="btn-gold" style="margin-top:20px" onclick="clearSearch()">Clear Search</button>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p) {
  return `
    <div class="product-card" onclick="openModal(${p.id})">
      <div class="pc-img">
        ${p.badge ? `<div class="pc-badge">${p.badge}</div>` : ''}
        <span>${p.emoji}</span>
      </div>
      <div class="pc-body">
        <div class="pc-cat">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="pc-foot">
          <div class="pc-price">GH₵${p.price} <small>each</small></div>
          <button class="pc-add" onclick="event.stopPropagation(); addToCart(${p.id})">
            + Add
          </button>
        </div>
      </div>
    </div>`;
}

function setFilter(cat, btn) {
  currentFilter = cat;
  currentSearch = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function handleSearch() {
  const input = document.getElementById('searchInput');
  currentSearch = input ? input.value : '';
  renderProducts();
}

function handleSort() {
  const sel = document.getElementById('sortSelect');
  currentSort = sel ? sel.value : 'default';
  renderProducts();
}

function clearSearch() {
  currentSearch = '';
  currentFilter = 'all';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  renderFilterBar();
  renderProducts();
}

/* ══════════════════════════════════════
   PRODUCT MODAL (Quick View)
══════════════════════════════════════ */
function openModal(id) {
  const p = getProductById(id);
  if (!p) return;

  const inner = document.getElementById('modalInner');
  inner.innerHTML = `
    <div class="mi-emoji">${p.emoji}</div>
    <div class="mi-cat">${p.category}</div>
    <div class="mi-name">${p.name}</div>
    <div class="mi-price">GH₵${p.price}</div>
    <p class="mi-desc">${p.desc}</p>
    <div class="mi-benefits">
      ${p.benefits.map(b => `
        <div class="mi-benefit">
          <div class="chk" style="background:var(--g-pale);color:var(--g-mid)">✓</div>
          ${b}
        </div>`).join('')}
    </div>
    <div class="mi-actions">
      <button class="btn-gold" style="flex:1" onclick="addToCart(${p.id}); closeModal()">
        🛒 Add to Cart — GH₵${p.price}
      </button>
      <button class="btn-ghost dark-ghost" onclick="closeModal()">
        Close
      </button>
    </div>`;

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  modalOpen = true;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
  if (!document.getElementById('cartSidebar').classList.contains('open')) {
    document.body.style.overflow = '';
  }
  modalOpen = false;
}

/* ══════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════ */
function renderAbout() {
  renderValues();
  renderIngredients();
}

function renderValues() {
  const grid = document.getElementById('valuesGrid');
  if (!grid) return;
  grid.innerHTML = VALUES.map(v => `
    <div class="value-card animate-up">
      <div class="val-ico">${v.ico}</div>
      <h4>${v.title}</h4>
      <p>${v.desc}</p>
    </div>`).join('');
}

function renderIngredients() {
  const grid = document.getElementById('ingredientsGrid');
  if (!grid) return;
  grid.innerHTML = INGREDIENTS.map(ing => `
    <div class="ing-card animate-up">
      <div class="ing-ico">${ing.ico}</div>
      <h4>${ing.name}</h4>
      <p>${ing.benefit}</p>
    </div>`).join('');
}

/* ══════════════════════════════════════
   REVIEWS PAGE
══════════════════════════════════════ */
function renderReviews() {
  renderReviewStats();
  renderReviewTabs();
  renderReviewCards();
}

function renderReviewStats() {
  const bar = document.getElementById('reviewStatsBar');
  if (!bar) return;
  bar.innerHTML = REVIEW_STATS.map(s => `
    <div class="rsb-card animate-up">
      <div class="rsb-num">${s.num}</div>
      ${s.stars ? `<div class="rsb-stars">${s.stars}</div>` : ''}
      <div class="rsb-label">${s.label}</div>
    </div>`).join('');
}

function renderReviewTabs() {
  const tabs = document.getElementById('reviewTabs');
  if (!tabs) return;
  const productNames = ['All Products', ...new Set(REVIEWS.map(r => r.product))];
  tabs.innerHTML = productNames.map(name => `
    <button class="rtab ${name === currentReviewFilter ? 'active' : ''}"
            onclick="setReviewFilter('${name}', this)">
      ${name}
    </button>`).join('');
}

function renderReviewCards() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;
  const filtered = filterReviews(currentReviewFilter);
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--txt-mute)">No reviews for this product yet. Be the first!</div>`;
    return;
  }
  grid.innerHTML = filtered.map(r => `
    <div class="review-card animate-up">
      <div class="rc-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <div class="rc-prod">${r.product}</div>
      <p class="rc-text">"${r.text}"</p>
      <div class="rc-author">
        <div class="rc-avatar">${r.name.charAt(0)}</div>
        <div>
          <div class="rc-name">${r.name}</div>
          <div class="rc-loc">${r.loc} · ${formatDate(r.date)}</div>
        </div>
      </div>
    </div>`).join('');
}

function setReviewFilter(name, btn) {
  currentReviewFilter = name;
  document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderReviewCards();
  if (currentPage === 'reviews') {
    setTimeout(triggerVisibleAnimations, 50);
  }
}

async function submitReview(e) {
  e.preventDefault();
  const name    = document.getElementById('rvName').value.trim();
  const loc     = document.getElementById('rvLoc').value.trim();
  const product = document.getElementById('rvProduct').value;
  const text    = document.getElementById('rvText').value.trim();
  const stars   = parseInt(document.getElementById('rvStars').value);

  if (!name || !loc || !text) {
    showToast('⚠️ Please fill in all fields');
    return;
  }

  try {
    await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, loc, product, text, stars })
    });

    // Refresh reviews from server
    const rRes = await fetch(`${API_URL}/reviews`);
    REVIEWS = await rRes.json();
    
    renderReviews();
    e.target.reset();
    selectedStars = 5;
    setupStarPicker();
    showToast('✓ Thank you! Your review has been added.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentPage === 'reviews') {
      setTimeout(triggerVisibleAnimations, 50);
    }
  } catch (err) {
    showToast('❌ Error submitting review.');
    console.error(err);
  }
}

function setupStarPicker() {
  const stars = document.querySelectorAll('.sp');
  const input = document.getElementById('rvStars');
  if (!stars.length) return;

  function highlight(val) {
    stars.forEach(s => {
      s.classList.toggle('on', parseInt(s.dataset.v) <= val);
    });
  }

  highlight(selectedStars);

  if (stars[0].dataset.init) return;
  stars[0].dataset.init = "1";

  stars.forEach(s => {
    s.addEventListener('click', () => {
      selectedStars = parseInt(s.dataset.v);
      if (input) input.value = selectedStars;
      highlight(selectedStars);
    });
    s.addEventListener('mouseenter', () => highlight(parseInt(s.dataset.v)));
    s.addEventListener('mouseleave', () => highlight(selectedStars));
  });
}

function populateReviewProductSelect() {
  const sel = document.getElementById('rvProduct');
  if (!sel) return;
  sel.innerHTML = PRODUCTS.map(p => `<option>${p.name}</option>`).join('');
}

/* ══════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════ */
function renderContact() {
  const items = document.getElementById('contactInfoItems');
  if (!items) return;
  items.innerHTML = CONTACT_INFO.map(c => `
    <div class="ii">
      <div class="ii-ico">${c.ico}</div>
      <div>
        <h5>${c.label}</h5>
        <p>${c.value}</p>
      </div>
    </div>`).join('');
}

async function submitContact(e) {
  e.preventDefault();
  const firstName = document.getElementById('cfName').value.trim();
  const lastName = document.getElementById('cfLastName').value.trim();
  const name = `${firstName} ${lastName}`.trim();
  const email = document.getElementById('cfEmail').value.trim();
  const message = document.getElementById('cfMsg').value.trim();
  try {
    await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    showToast("✉️ Message sent! We'll respond within 24 hours.");
    e.target.reset();
  } catch (err) {
    showToast('❌ Error sending message.');
  }
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function renderFooter() {
  const links = document.getElementById('footerProductLinks');
  if (!links) return;
  // Show first 5 products in footer
  links.innerHTML = PRODUCTS.slice(0, 5).map(p => `
    <li><a href="#" onclick="showPage('products')">${p.name}</a></li>`).join('');
}

/* ══════════════════════════════════════
   CART
══════════════════════════════════════ */
function addToCart(id) {
  const product = getProductById(id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, qty: 1 }); }
  CartStore.save(cart);
  updateBadge();
  renderCart();
  showToast(`✓ ${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  CartStore.save(cart);
  updateBadge();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  CartStore.save(cart);
  updateBadge();
  renderCart();
}

function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge    = document.getElementById('cartBadge');
  const mobCount = document.getElementById('mobCartCount');
  if (badge)    badge.textContent    = total;
  if (mobCount) mobCount.textContent = total;
}

function renderCart() {
  const body = document.getElementById('csBody');
  const foot = document.getElementById('csFoot');
  if (!body || !foot) return;

  if (!cart.length) {
    body.innerHTML = `
      <div class="cs-empty">
        <div class="cs-empty-ico">🧴</div>
        <p>Your cart is empty.<br/>Browse our products and add something!</p>
        <button class="btn-gold" style="margin-top:20px" onclick="closeCart();showPage('products')">
          Shop Products
        </button>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  body.innerHTML = cart.map(item => `
    <div class="cs-item">
      <div class="cs-item-ico">${item.emoji}</div>
      <div class="cs-item-info">
        <div class="cs-item-name">${item.name}</div>
        <div class="cs-item-price">GH₵${item.price * item.qty}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-n">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},  1)">+</button>
        </div>
      </div>
      <button class="cs-remove" onclick="removeFromCart(${item.id})" title="Remove">🗑</button>
    </div>`).join('');

  // Always re-render footer fresh (handles post-order new cart correctly)
  foot.innerHTML = `
    <div class="cs-total">
      <span>Subtotal</span>
      <span class="cs-total-amt" id="cartSubtotal">GH₵${subtotal}</span>
    </div>
    <button id="checkoutBtn" class="btn-gold full-w" onclick="showCheckoutForm()">
      Proceed to Checkout →
    </button>
    <button class="btn-ghost dark-ghost full-w" style="margin-top:12px" onclick="closeCart()">
      ← Continue Shopping
    </button>
    <div id="checkoutWrap"></div>`;
}

/* ══════════════════════════════════════
   GHANA LOCATION DATA
══════════════════════════════════════ */
const GHANA_LOCATIONS = {
  'Greater Accra': ['Accra', 'Tema', 'Madina', 'Kasoa', 'Adenta', 'Ashaiman', 'Dome', 'Achimota', 'Teshie', 'Nungua', 'Dansoman', 'Korle-Bu', 'Cantonments', 'Osu', 'La', 'Labadi', 'Prampram', 'Dodowa'],
  'Ashanti': ['Kumasi', 'Obuasi', 'Ejisu', 'Konongo', 'Mampong', 'Bekwai', 'Juaben', 'Asokwa', 'Suame', 'Manhyia', 'Tafo', 'Bantama', 'Nhyiaeso'],
  'Western': ['Takoradi', 'Sekondi', 'Tarkwa', 'Axim', 'Prestea', 'Bogoso', 'Shama', 'Agona Nkwanta', 'Halfassini'],
  'Western North': ['Sefwi Wiawso', 'Bibiani', 'Enchi', 'Juaboso', 'Bia'],
  'Central': ['Cape Coast', 'Kasoa', 'Winneba', 'Saltpond', 'Mankessim', 'Assin Fosu', 'Elmina', 'Apam', 'Swedru'],
  'Eastern': ['Koforidua', 'Nkawkaw', 'Akosombo', 'Asamankese', 'Nsawam', 'Suhum', 'Oda', 'Kade', 'Aburi', 'Somanya'],
  'Volta': ['Ho', 'Hohoe', 'Keta', 'Aflao', 'Sogakope', 'Kpandu', 'Denu', 'Anloga'],
  'Oti': ['Dambai', 'Jasikan', 'Kadjebi', 'Nkwanta'],
  'Northern': ['Tamale', 'Savelugu', 'Yendi', 'Bimbilla', 'Gushegu', 'Karaga'],
  'North East': ['Nalerigu', 'Walewale', 'Gambaga', 'Chereponi'],
  'Savannah': ['Damongo', 'Bole', 'Salaga', 'Sawla'],
  'Upper East': ['Bolgatanga', 'Bawku', 'Navrongo', 'Zebilla', 'Paga'],
  'Upper West': ['Wa', 'Lawra', 'Tumu', 'Nandom', 'Jirapa'],
  'Bono': ['Sunyani', 'Berekum', 'Dormaa Ahenkro', 'Wenchi', 'Techiman'],
  'Bono East': ['Techiman', 'Nkoranza', 'Atebubu', 'Kintampo'],
  'Ahafo': ['Goaso', 'Kukuom', 'Acherensua', 'Bechem']
};

/* When region changes, repopulate the town select */
function onRegionChange() {
  const regionSel = document.getElementById('coRegion');
  const citySel   = document.getElementById('coCity');
  if (!regionSel || !citySel) return;
  const towns = GHANA_LOCATIONS[regionSel.value] || [];
  citySel.innerHTML = '<option value="">Select Town / City</option>' +
    towns.map(t => `<option value="${t}">${t}</option>`).join('');
  citySel.disabled = towns.length === 0;
}

function showCheckoutForm() {
  const btn = document.getElementById('checkoutBtn');
  if (btn) btn.style.display = 'none';

  const wrap = document.getElementById('checkoutWrap');
  if (!wrap) return;
  if (wrap.innerHTML.trim() !== '') {
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const regionOptions = Object.keys(GHANA_LOCATIONS)
    .map(r => `<option value="${r}">${r}</option>`).join('');

  wrap.innerHTML = `
    <div class="checkout-wrap">
      <h4>Delivery Details</h4>
      <div class="co-fields">
        <input class="co-input" type="text"  id="coName"    placeholder="Full Name" required />
        <input class="co-input" type="tel"   id="coPhone"   placeholder="Phone / WhatsApp" required />
        <input class="co-input" type="text"  id="coAddress" placeholder="Street / House No." required />

        <div class="loc-select-wrap">
          <select class="loc-select" id="coRegion" onchange="onRegionChange()">
            <option value="">🗺️ Select Region</option>
            ${regionOptions}
          </select>
        </div>

        <div class="loc-select-wrap">
          <select class="loc-select" id="coCity" disabled>
            <option value="">🏘️ Select Town / City</option>
          </select>
        </div>

        <h4 style="margin:14px 0 8px;font-size:14px;color:var(--g-dark)">💳 Payment Method</h4>
        <div class="payment-options">
          <label class="pay-opt">
            <input type="radio" name="payMethod" value="delivery" checked />
            <div class="pay-opt-inner">
              <div class="pay-opt-ico">🏠</div>
              <div>
                <div class="pay-opt-title">Pay on Delivery</div>
                <div class="pay-opt-sub">Cash when your order arrives</div>
              </div>
              <div class="pay-opt-check">✓</div>
            </div>
          </label>
          <label class="pay-opt">
            <input type="radio" name="payMethod" value="online" />
            <div class="pay-opt-inner">
              <div class="pay-opt-ico">📱</div>
              <div>
                <div class="pay-opt-title">Pay Online</div>
                <div class="pay-opt-sub">Mobile Money / Card (Paystack)</div>
              </div>
              <div class="pay-opt-check">✓</div>
            </div>
          </label>
        </div>

        <button class="btn-gold full-w" style="margin-top:14px" onclick="placeOrder()">Place Order 🎉</button>
      </div>
      <div class="order-success" id="orderSuccess" style="display:none">
        <div style="font-size:40px;margin-bottom:10px">🎉</div>
        <h4>Order Confirmed!</h4>
        <p>We'll contact you on WhatsApp to arrange delivery.</p>
      </div>
    </div>`;

  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function placeOrder() {
  const name    = document.getElementById('coName')?.value.trim();
  const phone   = document.getElementById('coPhone')?.value.trim();
  const address = document.getElementById('coAddress')?.value.trim();
  const region  = document.getElementById('coRegion')?.value;
  const city    = document.getElementById('coCity')?.value;

  if (!name || !phone || !address || !region || !city) {
    showToast('⚠️ Please fill in all delivery details including Region and City');
    return;
  }

  const payRadio = document.querySelector('input[name="payMethod"]:checked');
  const payment_method = payRadio ? payRadio.value : 'delivery';

  const orderData = {
    name, phone, address, city, region,
    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, category: i.category })),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    payment_method
  };

  try {
    if (payment_method === 'online') {
      showToast('📱 Redirecting to payment...');
      // TODO: integrate Paystack here
    }

    await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    // Clear cart and fully reset footer so next cart is fresh
    cart = [];
    CartStore.save(cart);
    updateBadge();
    const foot = document.getElementById('csFoot');
    if (foot) foot.innerHTML = '';

    const payLabel = payment_method === 'online' ? 'Paid Online' : 'Pay on Delivery';
    const body = document.getElementById('csBody');
    if (body) body.innerHTML = `
      <div class="cs-empty">
        <div class="cs-empty-ico" style="font-size:64px">🎉</div>
        <p style="font-size:17px;font-weight:600;color:var(--g-dark)">Order placed, ${name}!</p>
        <p style="margin-top:8px">Payment: <strong>${payLabel}</strong></p>
        <p style="margin-top:4px">We'll reach out on WhatsApp to confirm your delivery.</p>
        <button class="btn-gold" style="margin-top:20px" onclick="closeCart()">← Continue Shopping</button>
      </div>`;
  } catch (err) {
    showToast('❌ Error placing order. Please try again.');
    console.error(err);
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  if (!modalOpen) document.body.style.overflow = '';
}

/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
function openMob() {
  document.getElementById('mobDrawer').classList.add('open');
  document.getElementById('mobOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMob() {
  document.getElementById('mobDrawer').classList.remove('open');
  document.getElementById('mobOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════
   SCROLL ANIMATIONS
══════════════════════════════════════ */
let scrollObserver;

function setupScrollAnimations() {
  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        scrollObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-up, .animate-right').forEach(el => scrollObserver.observe(el));
}

function triggerVisibleAnimations() {
  if (!scrollObserver) return;
  
  document.querySelectorAll(`#page-${currentPage} .animate-up, #page-${currentPage} .animate-right`).forEach(el => {
    el.classList.remove('in');
    scrollObserver.observe(el);
  });

  // Trigger elements already in viewport immediately
  setTimeout(() => {
    document.querySelectorAll(`#page-${currentPage} .animate-up, #page-${currentPage} .animate-right`).forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('in');
        scrollObserver.unobserve(el);
      }
    });
  }, 100);
}

/* ══════════════════════════════════════
   NAVBAR SCROLL EFFECT
══════════════════════════════════════ */
function setupNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(13,31,22,0.98)';
    } else {
      nav.style.background = 'rgba(26,61,43,0.96)';
    }
  });
}

/* ══════════════════════════════════════
   KEYBOARD ACCESSIBILITY
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeModal();
    closeMob();
  }
});

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-GH', { month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

/* ══════════════════════════════════════
   Initial page load animation
══════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('#page-home .animate-up, #page-home .animate-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('in');
    });
  }, 200);
});
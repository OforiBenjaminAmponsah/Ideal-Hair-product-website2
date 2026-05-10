/* ═══════════════════════════════════════════
   IDEAL HAIR ADMIN — Jumia Style admin.js
   ─────────────────────────────────────────── */

const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('adminToken') || '';

// Global State
let allOrders = [];
let allProducts = [];
let salesChartInstance = null;

// Auto-login
if (token) showDashboard();

/* ─── AUTH ─── */
async function login() {
  const pwd = document.getElementById('adminPwd').value;
  try {
    const res  = await fetch(`${API_URL}/admin/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password: pwd })
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      localStorage.setItem('adminToken', token);
      showDashboard();
    } else {
      alert('Incorrect password');
    }
  } catch {
    alert('Cannot reach server.');
  }
}

function logout() {
  token = '';
  localStorage.removeItem('adminToken');
  document.getElementById('loginScreen').style.display  = 'flex';
  document.getElementById('dashboardScreen').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginScreen').style.display    = 'none';
  document.getElementById('dashboardScreen').style.display = 'flex';
  showPanel('dashboard');
}

/* ─── PANEL NAV ─── */
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  document.getElementById('panel-' + name).classList.add('active');
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  if (name === 'dashboard') loadDashboard();
  if (name === 'orders')    fetchOrders();
  if (name === 'products')  fetchProducts();
  if (name === 'customers') fetchCustomers();
  if (name === 'messages')  fetchMessages();
}

/* ─── HELPERS ─── */
function authHeaders() {
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function formatDate(dt) {
  if (!dt) return '—';
  try {
    return new Date(dt).toLocaleString('en-GH', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch { return dt; }
}

function payBadge(pm) {
  if (pm === 'online') return `<span class="badge badge-pay-onl">📱 Online</span>`;
  return `<span class="badge badge-pay-del">🏠 Pay on Delivery</span>`;
}

function statusBadge(status) {
  const map = {
    pending: 'badge-pending', processing: 'badge-processing', 
    shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled'
  };
  const cls = map[status] || 'badge-pending';
  return `<span class="badge ${cls}">${capitalize(status || 'pending')}</span>`;
}

function parseItems(raw) {
  try {
    const items = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!items || !items.length) return '—';
    return items.map(i => `<strong>${i.qty}×</strong> ${i.name}`).join('<br>');
  } catch {
    return raw;
  }
}

/* ─── DASHBOARD ─── */
async function loadDashboard() {
  const [ordersRes, prodRes, msgRes] = await Promise.all([
    fetch(`${API_URL}/admin/orders`, { headers: authHeaders() }),
    fetch(`${API_URL}/products`),
    fetch(`${API_URL}/admin/messages`, { headers: authHeaders() })
  ]);
  
  if (ordersRes.status === 401) return logout();

  allOrders = await ordersRes.json();
  const products = await prodRes.json();
  const messages = await msgRes.json();

  const revenue = allOrders.reduce((s, o) => s + (o.status !== 'cancelled' ? o.total : 0), 0);
  
  document.getElementById('dash-revenue').textContent = `GH₵${revenue.toFixed(0)}`;
  document.getElementById('dash-orders').textContent = allOrders.length;
  document.getElementById('dash-products').textContent = products.length;
  document.getElementById('dash-messages').textContent = messages.length;

  renderChart(allOrders);
  
  const recent = allOrders.slice(0, 5);
  document.getElementById('dash-recent-orders').innerHTML = recent.map(o => `
    <tr>
      <td><strong style="color:var(--blue)">#${o.id}</strong></td>
      <td>${o.name}</td>
      <td>GH₵${o.total}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${formatDate(o.created_at)}</td>
    </tr>
  `).join('');
}

function renderChart(orders) {
  const ctx = document.getElementById('salesChart').getContext('2d');
  if (salesChartInstance) salesChartInstance.destroy();

  // Group by date
  const counts = {};
  const revs = {};
  // last 7 days
  for(let i=6; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    counts[dStr] = 0;
    revs[dStr] = 0;
  }

  orders.forEach(o => {
    if(!o.created_at) return;
    const date = o.created_at.split(' ')[0]; // assuming datetime format
    if(counts[date] !== undefined && o.status !== 'cancelled') {
      counts[date]++;
      revs[date] += o.total;
    }
  });

  const labels = Object.keys(counts).map(d => {
    const dt = new Date(d);
    return `${dt.getDate()} ${dt.toLocaleString('default', { month: 'short' })}`;
  });

  salesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Revenue (GH₵)',
          data: Object.values(revs),
          backgroundColor: '#c5a059',
          borderRadius: 4,
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: Object.values(counts),
          type: 'line',
          borderColor: '#1a3d2b',
          borderWidth: 2,
          pointBackgroundColor: '#1a3d2b',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { type: 'linear', display: true, position: 'left' },
        y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  });
}

/* ─── ORDERS ─── */
async function fetchOrders() {
  const res = await fetch(`${API_URL}/admin/orders`, { headers: authHeaders() });
  if (res.status === 401) return logout();
  allOrders = await res.json();
  renderOrders('all');
}

function filterOrders(status, btn) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderOrders(status);
}

function renderOrders(filterStatus) {
  const tb = document.getElementById('tb-orders');
  let filtered = allOrders;
  if (filterStatus !== 'all') {
    filtered = allOrders.filter(o => (o.status || 'pending') === filterStatus);
  }

  if (!filtered.length) {
    tb.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color:var(--mute)">No orders found</td></tr>`;
    return;
  }

  tb.innerHTML = filtered.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>
        <div><strong>${o.name}</strong></div>
        <div style="font-size:11px; color:var(--mute)">${o.phone}</div>
        <div style="font-size:11px; color:var(--mute)">${o.city || o.address}</div>
      </td>
      <td><div style="font-size:12px">${parseItems(o.items)}</div></td>
      <td><strong>GH₵${o.total}</strong></td>
      <td>${payBadge(o.payment_method)}</td>
      <td>
        <select class="form-control" style="width:120px; padding:4px 8px; font-size:12px; font-weight:600" onchange="updateOrderStatus(${o.id}, this.value)">
          <option value="pending" ${(o.status||'pending')==='pending'?'selected':''}>Pending</option>
          <option value="processing" ${o.status==='processing'?'selected':''}>Processing</option>
          <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
          <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
        </select>
      </td>
      <td style="font-size:12px">${formatDate(o.created_at)}</td>
      <td>
        <button class="btn btn-danger" style="padding:4px 8px; font-size:11px" onclick="deleteOrder(${o.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateOrderStatus(id, status) {
  await fetch(`${API_URL}/admin/orders/${id}/status`, {
    method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status })
  });
  // Update local state without full refetch if possible, or just refetch
  const order = allOrders.find(o => o.id === id);
  if(order) order.status = status;
  // Re-filter
  const activeTab = document.querySelector('.tabs .tab.active').innerText.toLowerCase();
  renderOrders(activeTab);
}

async function deleteOrder(id) {
  if (!confirm('Delete this order? This cannot be undone.')) return;
  const res = await fetch(`${API_URL}/admin/orders/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (res.ok) fetchOrders();
}

async function resetStats() {
  if (!confirm('WARNING: This will delete ALL orders. Proceed?')) return;
  const res = await fetch(`${API_URL}/admin/reset`, { method: 'DELETE', headers: authHeaders() });
  if (res.ok) { alert('Data reset'); fetchOrders(); }
}

/* ─── PRODUCTS ─── */
async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  allProducts = await res.json();
  
  const tb = document.getElementById('tb-products');
  tb.innerHTML = allProducts.map(p => `
    <tr>
      <td style="font-size:24px">${p.emoji || '🧴'}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td><strong>GH₵${p.price}</strong></td>
      <td>${p.badge ? `<span class="badge" style="background:var(--g-light)">${p.badge}</span>` : '—'}</td>
      <td>
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick='editProduct(${JSON.stringify(p).replace(/'/g, "&#39;")})'>Edit</button>
        <button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openProductModal(prod = null) {
  document.getElementById('productModal').style.display = 'flex';
  const form = document.getElementById('productForm');
  form.reset();
  
  if (prod) {
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('prodId').value = prod.id;
    document.getElementById('prodName').value = prod.name;
    document.getElementById('prodPrice').value = prod.price;
    document.getElementById('prodCategory').value = prod.category;
    document.getElementById('prodEmoji').value = prod.emoji || '';
    document.getElementById('prodBadge').value = prod.badge || '';
    document.getElementById('prodDesc').value = prod.desc || '';
    document.getElementById('prodBenefits').value = (prod.benefits || []).join(', ');
    document.getElementById('prodFeatured').checked = prod.featured;
  } else {
    document.getElementById('modalTitle').innerText = 'Add Product';
    document.getElementById('prodId').value = '';
  }
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

async function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('prodId').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/admin/products/${id}` : `${API_URL}/admin/products`;
  
  const benefitsStr = document.getElementById('prodBenefits').value;
  const benefits = benefitsStr ? benefitsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

  const payload = {
    name: document.getElementById('prodName').value,
    price: parseFloat(document.getElementById('prodPrice').value),
    category: document.getElementById('prodCategory').value,
    emoji: document.getElementById('prodEmoji').value,
    badge: document.getElementById('prodBadge').value,
    desc: document.getElementById('prodDesc').value,
    benefits: benefits,
    featured: document.getElementById('prodFeatured').checked
  };

  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    closeProductModal();
    fetchProducts();
  } else {
    alert('Failed to save product');
  }
}

function editProduct(p) {
  openProductModal(p);
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const res = await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (res.ok) fetchProducts();
}

/* ─── CUSTOMERS ─── */
async function fetchCustomers() {
  if(!allOrders.length) {
    const res = await fetch(`${API_URL}/admin/orders`, { headers: authHeaders() });
    allOrders = await res.json();
  }
  
  const customers = {};
  allOrders.forEach(o => {
    if(!customers[o.phone]) {
      customers[o.phone] = { name: o.name, phone: o.phone, city: o.city||o.region||'', orders: 0 };
    }
    customers[o.phone].orders++;
  });

  const list = Object.values(customers).sort((a,b) => b.orders - a.orders);
  const tb = document.getElementById('tb-customers');
  
  if(!list.length) {
    tb.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color:var(--mute)">No customers found</td></tr>`;
    return;
  }

  tb.innerHTML = list.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.phone}</td>
      <td>${c.city}</td>
      <td><strong>${c.orders}</strong> orders</td>
    </tr>
  `).join('');
}

/* ─── MESSAGES ─── */
async function fetchMessages() {
  const res = await fetch(`${API_URL}/admin/messages`, { headers: authHeaders() });
  if (res.status === 401) return logout();
  const msgs = await res.json();
  const tb = document.getElementById('tb-messages');

  if (!msgs.length) {
    tb.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color:var(--mute)">No messages</td></tr>`;
    return;
  }

  tb.innerHTML = msgs.map(m => `
    <tr>
      <td><strong>#${m.id}</strong></td>
      <td>${m.name}</td>
      <td><a href="mailto:${m.email}">${m.email}</a></td>
      <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${m.message}">${m.message}</td>
      <td style="font-size:12px">${formatDate(m.created_at)}</td>
      <td><button class="btn btn-danger" style="padding:4px 8px; font-size:11px" onclick="deleteMessage(${m.id})">Delete</button></td>
    </tr>
  `).join('');
}

async function deleteMessage(id) {
  if (!confirm('Delete message?')) return;
  const res = await fetch(`${API_URL}/admin/messages/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (res.ok) fetchMessages();
}

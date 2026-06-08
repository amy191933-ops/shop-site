const products = [
  {
    id: "lamp",
    name: "柔光陶瓷桌燈",
    category: "居家",
    price: 20,
    tag: "暖白光",
    image: ["./product-feature-1.png", "./product-feature-2.png", "./product-feature-3.png"],
  },
  {
    id: "chair",
    name: "橡木閱讀椅",
    category: "居家",
    price: 3280,
    tag: "人氣補貨",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bag",
    name: "防潑水城市托特包",
    category: "穿搭",
    price: 1280,
    tag: "輕量",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sneaker",
    name: "低筒帆布休閒鞋",
    category: "穿搭",
    price: 1980,
    tag: "新色",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "speaker",
    name: "迷你藍牙喇叭",
    category: "科技",
    price: 2380,
    tag: "12hr 續航",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "keyboard",
    name: "薄型無線鍵盤",
    category: "科技",
    price: 2180,
    tag: "靜音軸",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mug",
    name: "手感釉色馬克杯",
    category: "居家",
    price: 520,
    tag: "限量",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "watch",
    name: "極簡皮革腕錶",
    category: "穿搭",
    price: 2980,
    tag: "真皮錶帶",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
  },
];

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

const state = {
  category: "全部",
  query: "",
  cart: new Map(),
};

const productGrid = document.querySelector("#productGrid");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotalEl = document.querySelector("#subtotal");
const shippingEl = document.querySelector("#shipping");
const totalEl = document.querySelector("#total");
const scrim = document.querySelector("#scrim");
const orderMessage = document.querySelector("#orderMessage");

function getProductImage(product, index = 0) {
  if (Array.isArray(product.image)) {
    return product.image[index % product.image.length];
  }

  return product.image;
}

function renderProducts() {
  const query = state.query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = state.category === "全部" || product.category === state.category;
    const searchable = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <button class="product-image-button" type="button" data-gallery="${product.id}" data-index="0" aria-label="切換${product.name}照片">
            <img src="${getProductImage(product)}" alt="${product.name}" loading="lazy">
          </button>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.tag}</span>
            </div>
            <h3>${product.name}</h3>
            <div class="product-footer">
              <span class="price">${currency.format(product.price)}</span>
              <button class="add-button" type="button" data-add="${product.id}">加入</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  if (filtered.length === 0) {
    productGrid.innerHTML = `<div class="empty">找不到符合條件的商品。</div>`;
  }
}

function getCartRows() {
  return Array.from(state.cart.entries()).map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return { ...product, quantity };
  });
}

function renderCart() {
  const rows = getCartRows();
  const subtotal = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 1200 ? 0 : 80;

  cartCount.textContent = rows.reduce((sum, item) => sum + item.quantity, 0);
  subtotalEl.textContent = currency.format(subtotal);
  shippingEl.textContent = shipping === 0 ? "免運" : currency.format(shipping);
  totalEl.textContent = currency.format(subtotal + shipping);

  if (rows.length === 0) {
    cartItems.innerHTML = `<div class="empty">購物車目前是空的。</div>`;
    return;
  }

  cartItems.innerHTML = rows
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${getProductImage(item)}" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <span>${currency.format(item.price)}</span>
          </div>
          <div class="qty" aria-label="${item.name} 數量">
            <button type="button" data-step="${item.id}" data-delta="-1">−</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-step="${item.id}" data-delta="1">+</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function openCart() {
  cartPanel.classList.add("open");
  scrim.classList.add("open");
  document.querySelector(".cart-toggle").setAttribute("aria-expanded", "true");
}

function closeCart() {
  cartPanel.classList.remove("open");
  scrim.classList.remove("open");
  document.querySelector(".cart-toggle").setAttribute("aria-expanded", "false");
}

document.querySelector("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelector(".chip.active").classList.remove("active");
    chip.classList.add("active");
    state.category = chip.dataset.category;
    renderProducts();
  });
});

productGrid.addEventListener("click", (event) => {
  const galleryButton = event.target.closest("[data-gallery]");
  if (galleryButton) {
    const product = products.find((item) => item.id === galleryButton.dataset.gallery);
    if (product && Array.isArray(product.image) && product.image.length > 1) {
      const nextIndex = (Number(galleryButton.dataset.index || 0) + 1) % product.image.length;
      const image = galleryButton.querySelector("img");
      galleryButton.dataset.index = String(nextIndex);
      image.src = getProductImage(product, nextIndex);
    }
    return;
  }

  const button = event.target.closest("[data-add]");
  if (!button) return;

  const productId = button.dataset.add;
  state.cart.set(productId, (state.cart.get(productId) || 0) + 1);
  renderCart();
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-step]");
  if (!button) return;

  const productId = button.dataset.step;
  const nextQuantity = (state.cart.get(productId) || 0) + Number(button.dataset.delta);

  if (nextQuantity <= 0) {
    state.cart.delete(productId);
  } else {
    state.cart.set(productId, nextQuantity);
  }

  renderCart();
});

document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);

document.querySelector(".checkout-link").addEventListener("click", closeCart);

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.cart.size === 0) {
    orderMessage.textContent = "請先加入商品再送出訂單。";
    return;
  }

  state.cart.clear();
  renderCart();
  orderMessage.textContent = "訂單已建立，稍後會寄送確認信給你。";
  event.currentTarget.reset();
});

renderProducts();
renderCart();

/* Skrip untuk Cart Page
   Berupa Logika untuk menampilkan isi keranjang dan menangani klik */
function tampilkanPeringatanLogin() {
    const overlay = document.createElement('div');
    overlay.className = 'auth-warning-overlay';

    overlay.innerHTML = `
        <div class="auth-warning-box">
            <h3>Akses Ditolak</h3>
            <p>Silakan masuk (login) terlebih dahulu untuk melihat keranjang belanja Anda.</p>
            <a href="login.html" class="auth-warning-btn">Ke Halaman Login</a>
        </div>`;

    document.body.appendChild(overlay);
}

function initCart() {
  const itemsEl = document.getElementById("cartItems");
  if (!itemsEl) return; 
  if (!getCurrentUser()) {
    tampilkanPeringatanLogin();
    return;               // berhenti, jangan render keranjang
  }

  function renderCart() {
    const products = getProducts();
    const cart = getCart();

    if (cart.length === 0) {
      itemsEl.innerHTML = "<p>Keranjang kosong. Pilih rendang dulu di halaman utama.</p>";
    } else {
      itemsEl.innerHTML = cart.map(i => {
        const p = products.find(p => p.id === i.id);
        if (!p) return ""; // produk sudah dihapus admin
        return `
          <div class="cart-row">
            <img src="${p.img}" alt="${p.name}" ${IMG_FALLBACK_ATTR}>
            <div class="info">
              <p>${p.name}</p>
              <p>${formatRupiah(p.price)}</p>
            </div>
            <div class="qty">
              <button data-act="dec" data-id="${p.id}">-</button>
              <span>${i.qty}</span>
              <button data-act="inc" data-id="${p.id}">+</button>
            </div>
            <button class="btn-del" data-act="del" data-id="${p.id}">Hapus</button>
          </div>`;
      }).join("");
    }
    document.getElementById("cartTotal").textContent = formatRupiah(getCartTotal());
  }

  itemsEl.addEventListener("click", e => {
    const act = e.target.dataset.act;
    if (!act) return;
    const id = Number(e.target.dataset.id);
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (act === "inc") item.qty++;
    if (act === "dec") item.qty = Math.max(1, item.qty - 1);
    if (act === "del") { removeFromCart(id); renderCart(); return; }
    saveCart(cart);
    renderCart();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (getCart().length === 0) return alert("Keranjang masih kosong.");
    alert("Pesanan berhasil dibuat! Total: " + formatRupiah(getCartTotal()));
    saveCart([]);
    renderCart();
  });

  renderCart();
}

initCart();
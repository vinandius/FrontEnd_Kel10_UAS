/*fungsi mengganti alert dgn notifikasi*/
function tampilkanNotifKeranjang(elemenTombol) {

    let notifLama = document.querySelector('.cart-notification');
    if (notifLama) notifLama.remove();

    const notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.innerHTML = `
        <span>Berhasil ditambahkan ke keranjang!</span>
        <button class="notif-close">&times;</button>
    `;

    document.body.appendChild(notif);

    if (window.innerWidth >= 1024) {
        const posisiTombol = elemenTombol.getBoundingClientRect();
        notif.style.left = (posisiTombol.right + window.scrollX + 15) + 'px';
        notif.style.top = (posisiTombol.top + window.scrollY + (posisiTombol.height / 2)) + 'px';
    } else {
        notif.style.left = '';
        notif.style.top = '';
    }

    notif.querySelector('.notif-close').addEventListener('click', (e) => {
        e.stopPropagation();
        notif.remove();
    });

    setTimeout(() => {
        if (document.body.contains(notif)) notif.remove();
    }, 5000);
}

/* Skrip untuk Menu Page
   Berupa Logika untuk menampilkan daftar produk, pencarian produk,
   dan menangani klik */

const container = document.getElementById("renlistcont");
const containerToko = document.getElementById("renlistcontToko");

function renderProducts(keyword = "") {
  const list = getProducts().filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  if (list.length === 0) {
    container.innerHTML = "<p>Rendang tidak ditemukan.</p>";
    containerToko.innerHTML = "<p>Rendang tidak ditemukan.</p>";
    return;
  }
  if (containerToko){
    containerToko.innerHTML = list.map(p => `
      <div class="renlist">
        <img src="${p.img}" alt="${p.name}" ${IMG_FALLBACK_ATTR}>
        <div>
          <p>${p.name}</p>
          <p>${formatRupiah(p.price)}</p>
          <button class="btn-add" data-id="${p.id}">+ Keranjang</button>
        </div>
      </div>
    `).join("");
  }
  if (container){
    container.innerHTML = list.map(p => `
      <div class="renlist">
        <img src="${p.img}" alt="${p.name}" ${IMG_FALLBACK_ATTR}>
        <div>
          <p>${p.name}</p>
        </div>
      </div>
    `).join("");
  }
}

if (containerToko){
  containerToko.addEventListener("click", e => {
    if (e.target.classList.contains("btn-add")) {
      addToCart(Number(e.target.dataset.id));
      tampilkanNotifKeranjang(e.target);
    }
  });
}

// Mekanisme Pencarian Produk
document.getElementById("searchProduct").addEventListener("input", e => {
  renderProducts(e.target.value);
});

renderProducts();
/* Skrip untuk Admin Page
   Berupa Mekanisme untuk :
   Menambahkan, menghapus, dan mengedit produk */

const user = getCurrentUser();
if (!user || user.role !== "admin") {
  window.location.href = "login.html";
} else {
  initAdmin();
}

function readImage(file, maxSize = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function initAdmin() {
  const table = document.getElementById("productTable");
  const form = document.getElementById("productForm");

  function render() {
    table.innerHTML = getProducts().map(p => `
      <tr>
        <td><img src="${p.img}" alt="" class="thumb" ${IMG_FALLBACK_ATTR}></td>
        <td>${p.name}</td>
        <td>${formatRupiah(p.price)}</td>
        <td>
          <button class="btn-add" data-act="edit" data-id="${p.id}">Edit</button>
          <button class="btn-del" data-act="del" data-id="${p.id}">Hapus</button>
        </td>
      </tr>`).join("");
  }

  function resetForm() {
    form.reset();
    document.getElementById("pid").value = "";
    document.getElementById("saveBtn").textContent = "Tambah produk";
    document.getElementById("cancelBtn").style.display = "none";
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const list = getProducts();
    const id = Number(document.getElementById("pid").value);
    const name = document.getElementById("pname").value.trim();
    const price = Number(document.getElementById("pprice").value);
    const file = document.getElementById("pimg").files[0];

    if (price <= 0) {
      alert("Harga harus lebih dari 0.");
      return;
    }

    if (id) {
      const p = list.find(p => p.id === id);

      if (p.name === name && p.price === price && !file) {
        alert("Tidak ada perubahan.");
        return;
      }

      let pesan = "Simpan perubahan?\n\n" +
        "Nama: " + p.name + " -> " + name + "\n" +
        "Harga: " + formatRupiah(p.price) + " -> " + formatRupiah(price) +
        (file ? "\nFoto: diganti" : "");

      const rasio = price / p.price;
      if (rasio < 0.5 || rasio > 2) {
        pesan += "\n\nPERHATIAN: harga berubah drastis. Pastikan angkanya sudah benar.";
      }
      if (!confirm(pesan)) return;
    } else {
      if (!confirm('Tambah produk "' + name + '" dengan harga ' + formatRupiah(price) + "?")) return;
    }

    let img = null;
    if (file) {
      try {
        img = await readImage(file);
      } catch (err) {
        alert("File yang dipilih bukan gambar yang valid.");
        return;
      }
    }

    if (id) {
      const p = list.find(p => p.id === id);
      p.name = name;
      p.price = price;
      if (img) p.img = img;
      const newId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
      list.push({ id: newId, name, price, img: img || "Photos/Rendang.jpg" });
    }

    if (saveProducts(list)) {
      resetForm();
      render();
    }
  });

  table.addEventListener("click", e => {
    const act = e.target.dataset.act;
    if (!act) return;
    const id = Number(e.target.dataset.id);
    const list = getProducts();

    if (act === "del") {
      if (!confirm("Hapus produk ini?")) return;
      saveProducts(list.filter(p => p.id !== id));
      render();
    }
    if (act === "edit") {
      const p = list.find(p => p.id === id);
      document.getElementById("pid").value = p.id;
      document.getElementById("pname").value = p.name;
      document.getElementById("pprice").value = p.price;
      document.getElementById("saveBtn").textContent = "Simpan perubahan";
      document.getElementById("cancelBtn").style.display = "inline-block";
    }
  });

  document.getElementById("cancelBtn").addEventListener("click", resetForm);
  document.getElementById("logoutLink").addEventListener("click", e => {
    e.preventDefault();
    logout();
    window.location.href = "login.html";
  });

  render();
}
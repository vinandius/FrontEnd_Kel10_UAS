/* Skrip untuk Cart Page
   Berupa Logika untuk isi keranjang */


function cartKey() {
  const user = getCurrentUser();
  // if (!getCurrentUser()) {
  //   tampilkanPeringatanLogin();
    
  // }
  return user ? "cart_" + user.email : null;
}

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey())) || [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey(), JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function getCartTotal() {
  const products = getProducts();
  return getCart().reduce((sum, i) => {
    const p = products.find(p => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

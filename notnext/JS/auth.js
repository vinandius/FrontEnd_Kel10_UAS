/* Mekanisme Autentikasi Pengguna tanpa memakai Database
   Hanya menggunakan Local Storage untuk menyimpan data pengguna. */


function register(name, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.email === email)) {
    return false;
  } 
  users.push({ name, email, password, role: "customer" });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function login(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return false;
  } 
  localStorage.setItem("currentUser", JSON.stringify(user));
  return true;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  localStorage.removeItem("currentUser");
}

function updateNavbar() {
  const link = document.getElementById("authLink");
  if (!link) return;
  const user = getCurrentUser();
  if (!user) return;
  link.textContent = "Akun";
  link.href = "acc.html";
}
updateNavbar();
/* ========= VELOCE BIKES - app.js (Paso 3: administración) ========= */
const CAT_NOMBRES = { montaña:"Montaña", ruta:"Ruta", urbana:"Urbana", eléctrica:"Eléctrica", bmx:"BMX", infantil:"Infantil" };
const fmt = n => "$" + n.toLocaleString("es-CO");
const $ = id => document.getElementById(id);
let selectedTalla = null, selectedColorIdx = 0, currentProduct = null, comparados = [];

const RESENAS_DEMO = [
  { autor:"Carlos M.", fecha:"12/08/2026", rating:5, texto:"Excelente relación calidad-precio. Llegó en 3 días y perfectamente ajustada." },
  { autor:"Laura G.", fecha:"03/07/2026", rating:4, texto:"Muy buena bicicleta. Solo tuve que centrar los frenos al recibirla, lo demás perfecto." },
  { autor:"Andrés P.", fecha:"19/05/2026", rating:5, texto:"La guía de tallas acertó exactamente con mi altura. 100% recomendada." }
];

/* ============ "BASE DE DATOS" DE PRODUCTOS (RF-17 a RF-20) ============
   data.js es la SEMILLA; la verdad viva queda en localStorage.
   El catálogo (global `productos`) solo muestra productos ACTIVOS. */
function initProductsDB(){
  let all = JSON.parse(localStorage.getItem("veloce_products"));
  if (!all){
    all = productos.map(p => ({ ...p, activo:true }));
    localStorage.setItem("veloce_products", JSON.stringify(all));
  }
  productos.length = 0;
  all.filter(p => p.activo !== false).forEach(p => productos.push(p));
}
function saveAllProducts(all){ localStorage.setItem("veloce_products", JSON.stringify(all)); }
function getAllProducts(){ return JSON.parse(localStorage.getItem("veloce_products")) || []; }
initProductsDB();

/* ============ AUTENTICACIÓN (RF-13 a RF-16, RNF-05, RF-08) ============ */
const USERS_KEY = "veloce_users";
const SESSION_KEY = "veloce_session";

async function hashPass(texto){
  const conSal = texto + "_veloce_salt";
  if (window.crypto && crypto.subtle){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(conSal));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381;
  for (let i = 0; i < conSal.length; i++) h = ((h * 33) ^ conSal.charCodeAt(i)) >>> 0;
  return "fb-" + h.toString(16);
}
function getUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession(){ return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
function setSession(s){ s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); }
function emailValido(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email); }

async function seedAdmin(){
  const users = getUsers();
  if (!users.find(u => u.email === "admin@veloce.com")){
    users.push({ id:"u-admin", nombre:"Administrador Veloce", email:"admin@veloce.com", passHash: await hashPass("Admin123*"), rol:"administrador", activo:true });
    saveUsers(users);
  }
}
async function registrarUsuario(nombre, email, pass){
  if (!nombre) return "⚠️ Escribe tu nombre completo.";
  if (!emailValido(email)) return "⚠️ El correo no es válido. Ejemplo correcto: nombre@dominio.com";
  if (getUsers().find(u => u.email === email)) return "⚠️ Ya existe una cuenta registrada con este correo.";
  if (pass.length < 8) return "⚠️ La contraseña debe tener al menos 8 caracteres.";
  const users = getUsers();
  users.push({ id:"u-" + Date.now(), nombre, email, passHash: await hashPass(pass), rol:"cliente", activo:true });
  saveUsers(users);
  return null;
}
async function iniciarSesion(email, pass){
  const user = getUsers().find(u => u.email === email);
  if (!user) return "⚠️ No existe una cuenta con este correo.";
  if (!user.activo) return "⚠️ Tu cuenta está desactivada. Contacta a soporte.";
  if (await hashPass(pass) !== user.passHash) return "⚠️ Contraseña incorrecta. Inténtalo de nuevo.";
  setSession({ id:user.id, nombre:user.nombre, email:user.email, rol:user.rol });
  migrarCarritoInvitado(user.id);
  return null;
}
function cerrarSesion(){ setSession(null); location.reload(); }

const codigosRecuperacion = {};
function solicitarRecuperacion(email){
  if (!emailValido(email)) return "⚠️ El correo no es válido.";
  if (!getUsers().find(u => u.email === email)) return "⚠️ No existe una cuenta con este correo.";
  codigosRecuperacion[email] = String(Math.floor(100000 + Math.random() * 900000));
  alert(`📧 SIMULACIÓN DE CORREO\n\nHola, tu código de recuperación es: ${codigosRecuperacion[email]}\n(En producción este código llegaría por email.)`);
  return null;
}
async function restablecerContrasena(email, code, nuevaPass){
  if (codigosRecuperacion[email] !== code) return "⚠️ El código ingresado no es válido.";
  if (nuevaPass.length < 8) return "⚠️ La contraseña debe tener al menos 8 caracteres.";
  const users = getUsers();
  users.find(u => u.email === email).passHash = await hashPass(nuevaPass);
  saveUsers(users);
  delete codigosRecuperacion[email];
  return null;
}

/* ============ CARRITO POR USUARIO (RF-08) ============ */
function cartKey(){
  const s = getSession();
  return "veloce_cart_" + (s ? s.id : "guest");
}
function migrarCarritoInvitado(userId){
  const guest = JSON.parse(localStorage.getItem("veloce_cart_guest")) || [];
  if (guest.length){
    const key = "veloce_cart_" + userId;
    const propio = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify([...propio, ...guest]));
    localStorage.removeItem("veloce_cart_guest");
  }
}
function getCart(){ return JSON.parse(localStorage.getItem(cartKey())) || []; }
function setCart(c){ localStorage.setItem(cartKey(), JSON.stringify(c)); }

function pintarSesion(){
  const list = document.querySelector(".nav__list"); if (!list) return;
  const s = getSession();
  const li = document.createElement("li");
  li.style.cssText = "display:flex;align-items:center;gap:10px;font-size:.88rem;";
  if (s){
    li.innerHTML =
      `<span style="font-weight:600;color:var(--ink);">👤 ${s.nombre.split(" ")[0]}${s.rol === "administrador" ? ' <small style="color:var(--accent);font-weight:800;">ADMIN</small>' : ""}</span>` +
      (s.rol === "administrador" ? `<a href="admin.html" style="color:var(--accent);font-weight:600;">Panel</a>` : "") +
      `<button onclick="cerrarSesion()" style="background:none;border:none;color:var(--ink-soft);cursor:pointer;text-decoration:underline;">Salir</button>`;
  } else {
    li.innerHTML = `<a href="login.html" style="font-weight:600;color:var(--accent);">Ingresar</a>`;
  }
  list.appendChild(li);
}

/* ============ PEDIDOS Y PAGO (RF-10 a RF-12) ============ */
function getOrders(){ return JSON.parse(localStorage.getItem("veloce_orders")) || []; }
function saveOrders(o){ localStorage.setItem("veloce_orders", JSON.stringify(o)); }
function nuevoNumeroPedido(){
  const seq = parseInt(localStorage.getItem("veloce_order_seq") || "0", 10) + 1;
  localStorage.setItem("veloce_order_seq", String(seq));
  return `VB-${new Date().getFullYear()}-${String(seq).padStart(6, "0")}`;
}
function validarPago(d){
  const num = d.tarjeta.replace(/\s/g, "");
  if (!/^\d{16}$/.test(num)) return "⚠️ El número de tarjeta debe tener 16 dígitos.";
  if (!d.titular.trim()) return "⚠️ Escribe el nombre del titular de la tarjeta.";
  const m = d.vencimiento.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return "⚠️ Vencimiento inválido. Usa el formato MM/AA (ej: 12/28).";
  const mes = +m[1], anio = 2000 + +m[2], ahora = new Date();
  if (mes < 1 || mes > 12) return "⚠️ El mes de vencimiento no es válido.";
  if (anio < ahora.getFullYear() || (anio === ahora.getFullYear() && mes < ahora.getMonth() + 1)) return "⚠️ La tarjeta está vencida.";
  if (!/^\d{3,4}$/.test(d.cvv)) return "⚠️ El CVV debe tener 3 o 4 dígitos.";
  return null;
}
function procesarPedido(datosEnvio, datosPago){
  const cart = getCart();
  if (!cart.length) return { error:"Tu carrito está vacío." };
  const subtotal = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const envio = subtotal >= 2000000 ? 0 : 60000;
  const s = getSession();
  const pedido = {
    id: nuevoNumeroPedido(),
    fecha: new Date().toISOString(),
    usuarioId: s ? s.id : "invitado",
    usuarioNombre: s ? s.nombre : datosEnvio.nombre,
    email: s ? s.email : "invitado@veloce.com",
    items: cart,
    subtotal, envio, total: subtotal + envio,
    pago: { metodo:"Tarjeta (pago simulado)", ultimos4: datosPago.tarjeta.replace(/\s/g, "").slice(-4) },
    direccion: datosEnvio,
    estado: "pagado"
  };
  const orders = getOrders(); orders.push(pedido); saveOrders(orders);
  setCart([]);
  return { pedido };
}
function mostrarConfirmacion(pedido){
  const view = $("confirm-view"); if (!view) return;
  const main = $("cart-main"); if (main) main.style.display = "none";
  view.hidden = false;
  view.innerHTML = `
    <div class="confirm-card">
      <div style="font-size:3.2rem;">✅</div>
      <h2 style="margin:10px 0 6px;">¡Pago procesado exitosamente!</h2>
      <p style="color:#5B6472;">Tu pedido <strong style="color:var(--accent);">${pedido.id}</strong> quedó confirmado.<br>Recibirás el comprobante en tu correo (simulado).</p>
      <div class="confirm-box">
        <p><strong>Cliente:</strong> ${pedido.usuarioNombre}</p>
        <p><strong>Envío a:</strong> ${pedido.direccion.direccion}, ${pedido.direccion.ciudad} · Tel: ${pedido.direccion.telefono}</p>
        <p><strong>Pago:</strong> ${pedido.pago.metodo} terminada en ${pedido.pago.ultimos4}</p>
        <hr style="border:none;border-top:1px dashed var(--line);margin:10px 0;">
        ${pedido.items.map(i => `<p>${i.cantidad} × ${i.nombre} (T ${i.talla}, ${i.color}) — ${fmt(i.precio * i.cantidad)}</p>`).join("")}
        <hr style="border:none;border-top:1px dashed var(--line);margin:10px 0;">
        <p style="font-size:1.15rem;font-weight:800;color:var(--ink);">Total pagado: ${fmt(pedido.total)}</p>
      </div>
      <a href="catalogo.html" class="btn" style="margin-top:20px;">Seguir comprando</a>
    </div>`;
  window.scrollTo({ top:0, behavior:"smooth" });
}

/* ============ MÓDULO DE ADMINISTRACIÓN ============ */
/* RF-30 / RNF-04: control de acceso por rol */
function requireAdmin(){
  const s = getSession();
  if (s && s.rol === "administrador") return true;
  const content = $("admin-content"); if (content) content.hidden = true;
  const denied = $("admin-denied"); if (denied) denied.hidden = false;
  return false;
}

/* RF-20: consultar, buscar y filtrar productos */
function renderAdminProducts(){
  const q = ($("admin-prod-search") ? $("admin-prod-search").value : "").toLowerCase();
  const cat = $("admin-prod-cat") ? $("admin-prod-cat").value : "";
  const lista = getAllProducts().filter(p =>
    (!q || p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)) &&
    (!cat || p.categoria === cat));
  $("admin-products-table").innerHTML = lista.length ? lista.map(p => `
    <tr>
      <td><img src="${p.imagen}" style="width:56px;height:42px;object-fit:cover;border-radius:8px;background:#EDEFF2;" alt="" onerror="this.onerror=null;this.src='img/placeholder.webp'"></td>
      <td><strong>${p.nombre}</strong><br><small style="color:#5B6472;">${p.marca} · ${CAT_NOMBRES[p.categoria] || p.categoria}</small></td>
      <td>${fmt(p.precio)}</td>
      <td>${p.stock}</td>
      <td>${p.activo === false ? '<span class="tag tag--off">Inactivo</span>' : '<span class="tag tag--on">Activo</span>'}</td>
      <td><div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="mini-btn" onclick="abrirFormProducto('${p.id}')">✏️ Editar</button>
        <button class="mini-btn" onclick="adminToggleProducto('${p.id}')">${p.activo === false ? "✅ Activar" : "🚫 Inactivar"}</button>
      </div></td>
    </tr>`).join("") : `<tr><td colspan="6" style="text-align:center;padding:24px;color:#5B6472;">Sin resultados para la búsqueda.</td></tr>`;
}

/* RF-17 y RF-18: formulario de registro / edición */
function abrirFormProducto(id){
  const p = id ? getAllProducts().find(x => x.id === id) : null;
  const val = (c, d="") => p ? (p[c] ?? d) : d;
  const spec = (c, d="") => (p && p.specs) ? (p.specs[c] ?? d) : d;
  abrirModal(p ? "Editar producto (RF-18)" : "Registrar producto (RF-17)", `
  <form onsubmit="adminSubmitProducto(event)">
    <input type="hidden" id="pf-id" value="${p ? p.id : ""}">
    <div class="form-grid">
      <div class="form-group"><label>Nombre *</label><input id="pf-nombre" required value="${val("nombre")}"></div>
      <div class="form-group"><label>Marca *</label><input id="pf-marca" required value="${val("marca")}"></div>
      <div class="form-group"><label>Categoría *</label><select id="pf-categoria" required>
        ${Object.entries(CAT_NOMBRES).map(([k,v]) => `<option value="${k}" ${val("categoria") === k ? "selected" : ""}>${v}</option>`).join("")}
      </select></div>
      <div class="form-group"><label>Precio (COP) *</label><input id="pf-precio" type="number" min="0" required value="${val("precio")}"></div>
      <div class="form-group"><label>Stock total *</label><input id="pf-stock" type="number" min="0" required value="${val("stock")}"></div>
      <div class="form-group"><label>Badge</label><select id="pf-badge">
        ${["","Más Vendida","Novedad","Oferta","Últimas unidades"].map(b => `<option ${val("badge") === b ? "selected" : ""}>${b}</option>`).join("")}
      </select></div>
      <div class="form-group" style="grid-column:1/-1;"><label>URL o ruta de imagen</label><input id="pf-imagen" value="${val("imagen")}" placeholder="img/mi-bici.png o https://..."></div>
      <div class="form-group" style="grid-column:1/-1;"><label>Descripción</label><input id="pf-desc" value="${val("descripcion")}"></div>
      <div class="form-group" style="grid-column:1/-1;"><label>Tallas (separadas por coma)</label><input id="pf-tallas" value="${p ? p.tallas.join(", ") : "S, M, L"}"></div>
      <div class="form-group"><label>Color 1 (nombre)</label><input id="pf-color1n" value="${p ? p.nombresColores[0] : "Negro"}"></div>
      <div class="form-group"><label>Color 1 (hex)</label><input id="pf-color1h" value="${p ? p.colores[0] : "#1A1A2E"}"></div>
      <div class="form-group"><label>Color 2 (nombre, opcional)</label><input id="pf-color2n" value="${p && p.nombresColores[1] ? p.nombresColores[1] : ""}"></div>
      <div class="form-group"><label>Color 2 (hex)</label><input id="pf-color2h" value="${p && p.colores[1] ? p.colores[1] : "#6C757D"}"></div>
      <div class="form-group"><label>Cuadro</label><input id="pf-cuadro" value="${spec("cuadro")}"></div>
      <div class="form-group"><label>Suspensión</label><input id="pf-suspension" value="${spec("suspension")}"></div>
      <div class="form-group"><label>Velocidades</label><input id="pf-velocidades" value="${spec("velocidades")}"></div>
      <div class="form-group"><label>Frenos</label><select id="pf-frenos">
        ${["Disco hidráulico","Disco mecánico","V-Brake","U-Brake","Zapata"].map(f => `<option ${spec("frenos") === f ? "selected" : ""}>${f}</option>`).join("")}
      </select></div>
      <div class="form-group"><label>Rueda</label><input id="pf-rueda" value="${spec("rueda")}"></div>
      <div class="form-group"><label>Peso</label><input id="pf-peso" value="${spec("peso")}"></div>
    </div>
    <button class="btn" type="submit" style="width:100%;margin-top:14px;">💾 Guardar producto</button>
  </form>`);
}

function adminSubmitProducto(ev){
  ev.preventDefault();
  const id = $("pf-id").value || null;
  const stock = parseInt($("pf-stock").value, 10) || 0;
  const c1n = $("pf-color1n").value.trim() || "Negro";
  const c1h = $("pf-color1h").value.trim() || "#1A1A2E";
  const c2n = $("pf-color2n").value.trim();
  const c2h = $("pf-color2h").value.trim() || "#6C757D";
  const datos = {
    nombre: $("pf-nombre").value.trim(),
    categoria: $("pf-categoria").value,
    marca: $("pf-marca").value.trim(),
    precio: parseInt($("pf-precio").value, 10) || 0,
    stock,
    imagen: $("pf-imagen").value.trim() || "img/placeholder.webp",
    descripcion: $("pf-desc").value.trim() || "Producto registrado por el administrador.",
    badge: $("pf-badge").value,
    tallas: $("pf-tallas").value.split(",").map(s => s.trim()).filter(Boolean),
    colores: c2n ? [c1h, c2h] : [c1h],
    nombresColores: c2n ? [c1n, c2n] : [c1n],
    stockPorColor: c2n ? [Math.ceil(stock / 2), Math.floor(stock / 2)] : [stock],
    specs: {
      cuadro: $("pf-cuadro").value.trim() || "Aluminio 6061",
      suspension: $("pf-suspension").value.trim() || "Rígida",
      velocidades: $("pf-velocidades").value.trim() || "1x7 (7 velocidades)",
      frenos: $("pf-frenos").value,
      rueda: $("pf-rueda").value.trim() || '29"',
      peso: $("pf-peso").value.trim() || "13 kg",
      componentes: "Definidos por el administrador",
      horquilla: "Según modelo",
      cargaMax: "120 kg"
    }
  };
  if (!datos.nombre || !datos.precio){ alert("⚠️ Nombre y precio son obligatorios."); return; }

  const all = getAllProducts();
  if (id){
    Object.assign(all.find(x => x.id === id), datos);
  } else {
    all.push({ ...datos, id:"p-" + Date.now(), reviews:{ promedio:5, total:0 }, popularidad:50,
      fecha:new Date().toISOString().slice(0, 10), activo:true });
  }
  saveAllProducts(all);
  initProductsDB();
  cerrarModal();
  renderAdminProducts();
  alert(id ? "✅ Producto actualizado correctamente (RF-18)." : "✅ Producto registrado correctamente (RF-17).");
}

/* RF-19: inactivar / activar productos */
function adminToggleProducto(id){
  const all = getAllProducts();
  const p = all.find(x => x.id === id);
  p.activo = (p.activo === false);
  saveAllProducts(all);
  initProductsDB();
  renderAdminProducts();
  alert(p.activo ? "✅ Producto activado: vuelve a aparecer en el catálogo." : "🚫 Producto inactivado: ya no aparece en el catálogo (RF-19).");
}

/* RF-27 y RF-31: listado y búsqueda de usuarios */
function renderAdminUsers(){
  const q = ($("admin-user-search") ? $("admin-user-search").value : "").toLowerCase();
  const lista = getUsers().filter(u => !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  $("admin-users-table").innerHTML = lista.length ? lista.map(u => `
    <tr>
      <td><strong>${u.nombre}</strong></td>
      <td>${u.email}</td>
      <td>${u.rol === "administrador" ? '<span class="tag tag--on">Administrador</span>' : '<span class="tag">Cliente</span>'}</td>
      <td>${u.activo ? '<span class="tag tag--on">Activa</span>' : '<span class="tag tag--off">Desactivada</span>'}</td>
      <td><div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="mini-btn" onclick="adminToggleRol('${u.id}')">${u.rol === "administrador" ? "⬇️ Hacer cliente" : "⬆️ Hacer admin"}</button>
        <button class="mini-btn" onclick="adminToggleUsuario('${u.id}')">${u.activo ? "🚫 Desactivar" : "✅ Activar"}</button>
      </div></td>
    </tr>`).join("") : `<tr><td colspan="5" style="text-align:center;padding:24px;color:#5B6472;">Sin resultados.</td></tr>`;
}

/* RF-28: asignar roles */
function adminToggleRol(id){
  const us = getUsers();
  const u = us.find(x => x.id === id);
  if (u.id === "u-admin"){ alert("⚠️ El administrador principal no puede cambiar de rol."); return; }
  u.rol = (u.rol === "administrador") ? "cliente" : "administrador";
  saveUsers(us);
  renderAdminUsers();
  alert(`✅ Ahora ${u.nombre} tiene rol: ${u.rol}.`);
}

/* RF-29: activar / desactivar cuentas */
function adminToggleUsuario(id){
  const us = getUsers();
  const u = us.find(x => x.id === id);
  if (u.id === "u-admin"){ alert("⚠️ El administrador principal no puede desactivarse."); return; }
  u.activo = !u.activo;
  saveUsers(us);
  renderAdminUsers();
  alert(u.activo ? `✅ Cuenta de ${u.nombre} activada.` : `🚫 Cuenta de ${u.nombre} desactivada: no podrá iniciar sesión.`);
}

/* ============ NÚCLEO DE LA TIENDA ============ */
document.addEventListener("DOMContentLoaded", async () => {
  await seedAdmin();
  updateCartCount();
  pintarSesion();
  initCompareBar();
  initAutocomplete();
  const path = location.pathname;
  if (path.includes("producto.html")) renderProductDetail();
  else if (path.includes("carrito.html")) renderCart();
});

function estrellas(r){ const f = Math.round(r); return "★".repeat(f) + "☆".repeat(5 - f); }

function cardHTML(p){
  return `
  <article class="product-card">
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
    <a href="producto.html?id=${p.id}" aria-label="Ver detalle de ${p.nombre}">
      <img src="${p.imagen}" alt="Bicicleta ${p.nombre}, categoría ${CAT_NOMBRES[p.categoria]}" class="product-card__img" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.webp'">
    </a>
    <div class="product-card__body">
      <h2 class="product-card__title">${p.nombre}</h2>
      <p class="product-card__cat">${CAT_NOMBRES[p.categoria] || p.categoria} · ${p.marca}</p>
      <p class="stars" aria-label="Calificación ${p.reviews.promedio} de 5">${estrellas(p.reviews.promedio)} <span>(${p.reviews.total})</span></p>
      <p class="product-card__price">${p.precioAnterior ? `<s class="price-old">${fmt(p.precioAnterior)}</s> ` : ""}${fmt(p.precio)}</p>
      <div class="product-card__actions">
        <a href="producto.html?id=${p.id}" class="btn">Ver detalles</a>
        <button type="button" class="btn" style="flex:none;width:44px;padding:10px 0;font-size:1.25rem;line-height:1;border-radius:10px;" onclick="agregarRapido('${p.id}')" title="Agregar al carrito" aria-label="Agregar ${p.nombre} al carrito">+</button>
      </div>
      <label class="compare-check" style="margin-top:8px;"><input type="checkbox" ${comparados.includes(p.id) ? "checked" : ""} onchange="toggleCompare('${p.id}', this)"> Comparar</label>
    </div>
  </article>`;
}

function agregarRapido(id){
  const p = productos.find(x => x.id === id);
  const talla = p.tallas[0], color = p.nombresColores[0], stock = p.stockPorColor[0];
  if (stock <= 0){ alert(`⚠️ ${p.nombre} está agotada en el color ${color}. Revísala en el detalle.`); return; }
  const cart = getCart();
  const ex = cart.find(i => i.id === id && i.talla === talla && i.color === color);
  if (ex) ex.cantidad = Math.min(ex.cantidad + 1, stock);
  else cart.push({ id:p.id, nombre:p.nombre, precio:p.precio, imagen:p.imagen, talla, color, cantidad:1, categoria:p.categoria });
  setCart(cart); updateCartCount();
  alert(`✅ ${p.nombre} agregada al carrito (Talla ${talla}, ${color}).`);
}

function renderGrid(lista, id){
  const grid = $(id); if (!grid) return;
  grid.innerHTML = lista.length ? lista.map(cardHTML).join("") : `<p class="empty-msg">No se encontraron bicicletas con estos criterios.</p>`;
}

function abrirModal(titulo, html){
  cerrarModal();
  const m = document.createElement("div");
  m.className = "modal-overlay"; m.id = "modal-overlay";
  m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${titulo}">
      <div class="modal__head"><h3>${titulo}</h3><button class="modal__close" onclick="cerrarModal()" aria-label="Cerrar ventana">×</button></div>
      <div class="modal__body">${html}</div></div>`;
  m.addEventListener("click", e => { if (e.target === m) cerrarModal(); });
  document.body.appendChild(m);
}
function cerrarModal(){ const m = $("modal-overlay"); if (m) m.remove(); }
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarModal(); });

function abrirGuiaTallas(){
  abrirModal("Guía de tallas según tu altura", `
    <table class="specs-table guide-table">
      <thead><tr><th>Altura del ciclista</th><th>Talla MTB / Urbana</th><th>Talla Ruta</th></tr></thead>
      <tbody>
        <tr><td>1.50 – 1.60 m</td><td>S</td><td>48</td></tr>
        <tr><td>1.60 – 1.70 m</td><td>M</td><td>52</td></tr>
        <tr><td>1.70 – 1.78 m</td><td>L</td><td>54</td></tr>
        <tr><td>1.78 – 1.88 m</td><td>XL</td><td>56</td></tr>
        <tr><td>Más de 1.88 m</td><td>XL</td><td>58</td></tr>
      </tbody>
    </table>
    <p style="margin-top:16px;font-size:.9rem;color:#6c757d;">BMX e infantil usan talla única según edad: BMX 20&quot; (8+ años), infantil 16&quot; (4-7 años) y 20&quot; (6-9 años).</p>`);
}

function initCompareBar(){
  const bar = document.createElement("div");
  bar.className = "compare-bar"; bar.id = "compare-bar"; bar.hidden = true;
  bar.innerHTML = `<span id="compare-txt"></span>
    <button class="btn" onclick="abrirComparador()">Comparar</button>
    <button class="btn btn--ghost" onclick="limpiarCompare()">Limpiar</button>`;
  document.body.appendChild(bar);
}
function toggleCompare(id, cb){
  if (cb.checked){
    if (comparados.length >= 3){ cb.checked = false; alert("Puedes comparar máximo 3 bicicletas."); return; }
    comparados.push(id);
  } else comparados = comparados.filter(x => x !== id);
  actualizarCompareBar();
}
function actualizarCompareBar(){
  const bar = $("compare-bar"); if (!bar) return;
  bar.hidden = comparados.length === 0;
  $("compare-txt").textContent = `${comparados.length} de 3 bicicletas seleccionadas`;
}
function limpiarCompare(){
  comparados = []; actualizarCompareBar();
  document.querySelectorAll(".compare-check input").forEach(c => c.checked = false);
}
function abrirComparador(){
  const ps = comparados.map(id => productos.find(p => p.id === id));
  const filas = [["Precio", p => fmt(p.precio)], ["Categoría", p => CAT_NOMBRES[p.categoria]], ["Marca", p => p.marca],
    ["Cuadro", p => p.specs.cuadro], ["Frenos", p => p.specs.frenos], ["Rueda", p => p.specs.rueda],
    ["Velocidades", p => p.specs.velocidades], ["Peso", p => p.specs.peso], ["Carga máx.", p => p.specs.cargaMax], ["Stock", p => p.stock + " u."]];
  abrirModal("Comparar bicicletas", `<div class="table-scroll"><table class="specs-table compare-table">
    <thead><tr><th scope="col"></th>${ps.map(p => `<th scope="col">${p.nombre}</th>`).join("")}</tr></thead>
    <tbody>${filas.map(([n, f]) => `<tr><th scope="row">${n}</th>${ps.map(p => `<td>${f(p)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`);
}

function initAutocomplete(){
  const input = $("search-input"), list = $("search-suggestions");
  if (!input || !list) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2){ list.hidden = true; return; }
    const match = productos.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q) || p.categoria.includes(q)).slice(0, 6);
    list.innerHTML = match.map(p =>
      `<li><button type="button" onclick="elegirSugerencia('${p.id}')">${p.nombre} <small>· ${CAT_NOMBRES[p.categoria]}</small></button></li>`).join("");
    list.hidden = match.length === 0;
  });
}
function elegirSugerencia(id){
  $("search-input").value = productos.find(p => p.id === id).nombre;
  $("search-suggestions").hidden = true;
  if (window.applyFilters) applyFilters();
}

function renderProductDetail(){
  const id = new URLSearchParams(location.search).get("id");
  const p = productos.find(x => x.id === id);
  if (!p){
    const inactivo = getAllProducts().find(x => x.id === id && x.activo === false);
    document.querySelector("main").innerHTML = inactivo
      ? `<h2 class="container" style="padding:48px 16px;">🚫 Este producto fue inactivado por el administrador y ya no está disponible para la venta.</h2>`
      : `<h2 class="container" style="padding:48px 16px;">Producto no encontrado.</h2>`;
    return;
  }
  currentProduct = p; selectedTalla = null; selectedColorIdx = 0;

  document.title = `${p.nombre} | Veloce Bikes`;
  document.querySelector('meta[name="description"]').content = p.descripcion;
  inyectarSchema(p);

  $("pdp-title").textContent = p.nombre;
  $("pdp-cat").textContent = `${CAT_NOMBRES[p.categoria] || p.categoria} · ${p.marca}`;
  $("pdp-desc").textContent = p.descripcion;
  $("pdp-price").innerHTML = `${p.precioAnterior ? `<s class="price-old">${fmt(p.precioAnterior)}</s> ` : ""}${fmt(p.precio)}`;
  $("pdp-rating").innerHTML = `${estrellas(p.reviews.promedio)} <span>${p.reviews.promedio} · ${p.reviews.total} reseñas</span>`;
  const img = $("pdp-img"); img.src = p.imagen; img.alt = `Bicicleta ${p.nombre}`;
  img.onerror = () => { img.src = "img/placeholder.webp"; };

  renderColores(p); renderTallas(p); renderSpecs(p); renderResenas(p);
  actualizarStock();
  $("btn-add-cart").onclick = () => addToCart(p);
}

function inyectarSchema(p){
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.text = JSON.stringify({
    "@context":"https://schema.org/", "@type":"Product", name:p.nombre, image:[p.imagen], description:p.descripcion,
    brand:{ "@type":"Brand", name:p.marca },
    aggregateRating:{ "@type":"AggregateRating", ratingValue:p.reviews.promedio, reviewCount:p.reviews.total },
    offers:{ "@type":"Offer", priceCurrency:"COP", price:p.precio, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }
  });
  document.head.appendChild(s);
}

function renderColores(p){
  $("color-options").innerHTML = p.colores.map((c, i) =>
    `<button type="button" class="color-swatch ${i === 0 ? "selected" : ""}" style="background:${c}" title="${p.nombresColores[i]}" aria-label="Color ${p.nombresColores[i]}" onclick="selectColor(${i})"></button>`).join("");
}
function selectColor(i){
  selectedColorIdx = i;
  document.querySelectorAll(".color-swatch").forEach((s, idx) => s.classList.toggle("selected", idx === i));
  actualizarStock();
}
function actualizarStock(){
  if (!currentProduct) return;
  const p = currentProduct, st = p.stockPorColor[selectedColorIdx];
  const el = $("pdp-stock");
  el.textContent = `Color ${p.nombresColores[selectedColorIdx]}: ${st > 0 ? st + " unidades disponibles" : "AGOTADO en este color"}`;
  el.className = "stock-label " + (st > 0 ? "stock-ok" : "stock-out");
}

function renderTallas(p){
  $("talla-options").innerHTML = p.tallas.map(t =>
    `<button type="button" class="talla-btn" onclick="selectTalla(this,'${t}')">${t}</button>`).join("");
}
function selectTalla(el, t){
  selectedTalla = t;
  document.querySelectorAll(".talla-btn").forEach(b => b.classList.remove("selected"));
  el.classList.add("selected");
}

function renderSpecs(p){
  const etiquetas = { cuadro:"Material del cuadro", suspension:"Suspensión", velocidades:"Velocidades", frenos:"Frenos", rueda:"Tamaño de rueda", peso:"Peso", componentes:"Componentes", horquilla:"Horquilla", cargaMax:"Capacidad de carga", motor:"Motor", autonomia:"Autonomía" };
  $("specs-body").innerHTML = Object.entries(p.specs || {}).map(([k, v]) =>
    `<tr><th scope="row">${etiquetas[k] || k}</th><td>${v}</td></tr>`).join("");
}

function renderResenas(p){
  const cont = $("reviews-list"); if (!cont) return;
  cont.innerHTML = RESENAS_DEMO.map(r => `
    <article class="review-card">
      <header><strong>${r.autor}</strong> <span class="stars">${estrellas(r.rating)}</span> <time>${r.fecha}</time></header>
      <p>${r.texto}</p>
    </article>`).join("");
}

function addToCart(p){
  if (!selectedTalla){ alert("⚠️ Por favor selecciona una TALLA antes de añadir al carrito."); return; }
  const stock = p.stockPorColor[selectedColorIdx];
  if (stock <= 0){ alert("⚠️ Este color se encuentra agotado. Elige otro color."); return; }
  const cart = getCart();
  const color = p.nombresColores[selectedColorIdx];
  const ex = cart.find(i => i.id === p.id && i.talla === selectedTalla && i.color === color);
  if (ex) ex.cantidad = Math.min(ex.cantidad + 1, stock);
  else cart.push({ id:p.id, nombre:p.nombre, precio:p.precio, imagen:p.imagen, talla:selectedTalla, color, cantidad:1, categoria:p.categoria });
  setCart(cart); updateCartCount();
  alert(`✅ ${p.nombre} (Talla ${selectedTalla}, ${color}) añadida al carrito.`);
}

function updateCartCount(){
  const badge = $("cart-count");
  if (badge) badge.textContent = getCart().reduce((s, i) => s + i.cantidad, 0);
}

function renderCart(){
  const cart = getCart();
  const cont = $("cart-items"); if (!cont) return;

  if (!cart.length){
    cont.innerHTML = `<p class="empty-msg">Tu carrito está vacío. <a href="catalogo.html" style="color:var(--accent);font-weight:600;">Ver catálogo</a></p>`;
    $("cart-subtotal").textContent = fmt(0); $("cart-total").textContent = fmt(0);
    $("cart-shipping").textContent = "—"; return;
  }

  let subtotal = 0;
  cont.innerHTML = cart.map((item, i) => {
    subtotal += item.precio * item.cantidad;
    return `
    <div class="cart-item">
      <img src="${item.imagen}" alt="${item.nombre}" onerror="this.onerror=null;this.src='img/placeholder.webp'">
      <div class="cart-item__info">
        <h4>${item.nombre}</h4>
        <p>Talla: ${item.talla} · Color: ${item.color}</p>
        <p>${fmt(item.precio)} × ${item.cantidad} = <strong>${fmt(item.precio * item.cantidad)}</strong></p>
        <div class="qty" aria-label="Cantidad de ${item.nombre}">
          <button type="button" onclick="cambiarCantidad(${i},-1)" aria-label="Disminuir cantidad">−</button>
          <span>${item.cantidad}</span>
          <button type="button" onclick="cambiarCantidad(${i},1)" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart(${i})" aria-label="Eliminar ${item.nombre}">🗑️</button>
    </div>`;
  }).join("");

  const envio = subtotal >= 2000000 ? 0 : 60000;
  $("cart-subtotal").textContent = fmt(subtotal);
  $("cart-shipping").textContent = envio === 0 ? "¡Gratis! 🎉" : fmt(envio);
  $("cart-total").textContent = fmt(subtotal + envio);
}

function cambiarCantidad(i, delta){
  const cart = getCart();
  const item = cart[i]; if (!item) return;
  const p = productos.find(x => x.id === item.id);
  const stock = p ? (p.stockPorColor[p.nombresColores.indexOf(item.color)] ?? 99) : 99;
  item.cantidad += delta;
  if (item.cantidad <= 0) cart.splice(i, 1);
  else if (item.cantidad > stock){ item.cantidad = stock; alert(`⚠️ Solo hay ${stock} unidades disponibles de este modelo y color.`); }
  setCart(cart); renderCart(); updateCartCount();
}

function removeFromCart(i){
  const cart = getCart();
  cart.splice(i, 1);
  setCart(cart);
  renderCart(); updateCartCount();
}
/* ========= VELOCE BIKES - app.js v6 ========= */
const CAT_NOMBRES = { montaña:"Montaña", ruta:"Ruta", urbana:"Urbana", eléctrica:"Eléctrica", bmx:"BMX", infantil:"Infantil", accesorios:"Accesorios" };
const fmt = n => "$" + n.toLocaleString("es-CO");
const $ = id => document.getElementById(id);
let selectedTalla = null, selectedColorIdx = 0, currentProduct = null, comparados = [];
let ultimoPedido = null;

const ADMIN_CLAVE_B64 = "QWRtaW4xMjMq";

/* ============ RESEÑAS DINÁMICAS POR PRODUCTO ============ */
const AUTORES = ["Carlos M.","Laura G.","Andrés P.","Mariana R.","Jorge C.","Camila T.","Felipe V.","Diana S.","Ricardo B.","Paula H.","Sergio L.","Valentina O."];
const FECHAS_RESENA = ["08/09/2026","21/08/2026","02/07/2026","15/06/2026","28/04/2026","11/03/2026","19/01/2026","05/12/2025"];

const PLANTILLAS_RESENAS = {
  montaña: [
    "La {nombre} se portó espectacular en trocha: la suspensión ({suspension}) absorbe muy bien y los cambios ({velocidades}) pasan suaves incluso con barro.",
    "Rodé {n} km de sendero en la {nombre} y no necesitó ni un ajuste. El freno {frenos} da mucha confianza en bajadas técnicas.",
    "Excelente geometría y el peso ({peso}) se siente ligero al subir. La recomiendo para quien empieza en montaña seria.",
    "Llegó perfectamente empacada y el armado tomó 20 minutos. En ruta de finca respondió como una bici de gama alta.",
    "El cuadro se siente rígido y noble. Único detalle: me tocó centrar un radio tras la primera salida, pero el soporte lo hizo gratis."
  ],
  ruta: [
    "La {nombre} rueda finísimo: con rueda {rueda} y {velocidades} mantengo el promedio sin sufrir. El peso ({peso}) se nota en cada repecho.",
    "Hice una rodada de {n} km y la posición es cómoda aun siendo agresiva. Los frenos {frenos} responden suaves y progresivos.",
    "Comparada con mi bici anterior, la {nombre} es otra liga: más rígida al sprint y más estable bajando.",
    "Estética 10/10 y rendimiento real. El cambio de marchas es silencioso incluso bajo carga.",
    "Para el precio, el grupo de componentes es muy superior al de la competencia. Feliz con la compra."
  ],
  urbana: [
    "Uso la {nombre} a diario para ir al trabajo: cómoda, ágil en tráfico y el mantenimiento es mínimo.",
    "Me encantó que viniera lista para ciudad. Los frenos {frenos} paran seguro incluso con lluvia.",
    "Ligera para ser urbana ({peso}). La subo al apartamento sin problema y rueda suave en ciclorruta.",
    "Excelente para entregas y mandados: el cuadro aguanta y la posición de manejo es relajada.",
    "Después de {n} km urbanos, cero ruidos. Muy buena relación calidad-precio."
  ],
  eléctrica: [
    "La asistencia de la {nombre} es suavísima: subo puentes sudando la mitad y la batería rinde lo prometido.",
    "La cargué completa y aun así el motor empuja parejo. Los {n} km de autonomía se cumplen en modo eco.",
    "Pesada al subir escaleras ({peso}), pero en plano es una nube. El display es claro y fácil de usar.",
    "La uso para reemplazar el carro en trayectos cortos: ahorro brutal y cero emisiones.",
    "El freno {frenos} es indispensable con el peso y la velocidad de esta bici. Muy segura."
  ],
  bmx: [
    "La {nombre} aguanta mis sesiones de park sin quejarse: cuadro rígido y rines firmes.",
    "Perfecta para street: los pegs vienen incluidos y los rodamientos sellados giran suaves.",
    "Mi hijo la maltrata a diario y sigue como nueva. Resistencia real de cuadro.",
    "Geometría cómoda para trucos básicos y saltos. Muy buena para progresar.",
    "Por el precio, la calidad del conjunto ({peso}) es sorprendente."
  ],
  infantil: [
    "Se la compramos a mi hija de 6 años y aprendió en una tarde: liviana y con frenos que ella alcanza fácil.",
    "Las rueditas entrenadoras se quitan sin herramientas. Excelente acabado, sin bordes filosos.",
    "Mi sobrino feliz: el color es igual al de la foto y el tamaño quedó perfecto.",
    "Resistente a golpes de principiante. La pintura no se despega.",
    "Buenísima compra: ligera ({peso}) y segura para aprender."
  ],
  accesorios: [
    "Lo compré para complementar mi bici y superó lo esperado: calidad de marca sin pagar de más.",
    "Uso el/la {nombre} hace {n} semanas en mis rodadas y sigue como nuevo(a).",
    "Llegó antes de lo prometido y bien empacado. Cumple exactamente lo que dice la ficha técnica.",
    "Se nota el material de calidad; lo recomiendo para uso diario en ciudad o trocha.",
    "Buena relación precio-calidad de parte de {marca}. Lo volvería a comprar sin dudarlo."
  ]
};

const FRASE_SUB = {
  cascos:"El ajuste de ruleta queda firme y la ventilación se agradece en clima cálido.",
  guantes:"La palmilla amortigua muy bien las vibraciones del manubrio.",
  ropa:"El corte queda entallado sin apretar y la tela seca rápido.",
  iluminacion:"La potencia lumínica es real: manejo de noche totalmente tranquilo.",
  seguridad:"Se siente sólido al asegurar la bici en la calle o el trabajo.",
  hidratacion:"La válvula no gotea y se bebe sin soltar el manubrio.",
  herramientas:"Me salvó de un ajuste en plena rodada: indispensable en la mochila.",
  componentes:"La instalación fue directa y el funcionamiento es silencioso."
};

function hashStr(s){
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function rellenarPlantilla(t, p){
  const s = p.specs || {};
  const n = 30 + (hashStr(p.id + "n") % 60);
  return t
    .replace(/\{nombre\}/g, p.nombre)
    .replace(/\{marca\}/g, p.marca)
    .replace(/\{frenos\}/g, s.frenos || "sistema de frenos")
    .replace(/\{velocidades\}/g, s.velocidades || "sus cambios")
    .replace(/\{suspension\}/g, s.suspension || "suspensión")
    .replace(/\{rueda\}/g, s.rueda || "rueda")
    .replace(/\{peso\}/g, s.peso || "su peso")
    .replace(/\{n\}/g, n);
}

function generarResenas(p){
  const seed = hashStr(p.id);
  const pool = PLANTILLAS_RESENAS[p.categoria] || PLANTILLAS_RESENAS.accesorios;
  const base = (p.reviews && p.reviews.promedio) ? p.reviews.promedio : 4.5;
  const combos = base >= 4.7 ? [5,5,4] : base >= 4.4 ? [5,4,4] : [4,4,3];
  const extra = FRASE_SUB[p.subcategoria] || "";
  const out = [];
  for (let i = 0; i < 3; i++){
    let texto = rellenarPlantilla(pool[(seed + i * 3) % pool.length], p);
    if (i === 0 && extra) texto += " " + extra;
    out.push({
      autor: AUTORES[(seed + i * 5) % AUTORES.length],
      fecha: FECHAS_RESENA[(seed + i * 2) % FECHAS_RESENA.length],
      rating: combos[(seed + i) % 3],
      texto
    });
  }
  return out;
}

/* ============ "BASE DE DATOS" DE PRODUCTOS ============ */
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

/* ============ STOCK: se descuenta con cada compra ============ */
function descontarStock(items){
  const all = getAllProducts();
  let cambio = false;
  items.forEach(i => {
    const p = all.find(x => x.id === i.id);
    if (!p) return;
    const idx = (p.nombresColores || []).indexOf(i.color);
    if (idx >= 0 && Array.isArray(p.stockPorColor)){
      p.stockPorColor[idx] = Math.max(0, (p.stockPorColor[idx] || 0) - i.cantidad);
    }
    p.stock = Math.max(0, (p.stock || 0) - i.cantidad);
    cambio = true;
  });
  if (cambio){
    saveAllProducts(all);
    initProductsDB();
  }
}

/* ============ AUTENTICACIÓN ============ */
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

const CONTRASENAS_DEBILES = ["12345678","123456789","1234567890","11111111","00000000","password","contrasena","qwerty123","abc12345","admin123"];
function validarFortaleza(pass){
  if (pass.length < 8) return "⚠️ La contraseña debe tener al menos 8 caracteres.";
  if (CONTRASENAS_DEBILES.includes(pass.toLowerCase())) return "⚠️ Esa contraseña aparece en filtraciones de datos públicas (como 12345678). Elige una más segura.";
  if (!/[a-zA-Z]/.test(pass) || !/[0-9]/.test(pass)) return "⚠️ La contraseña debe combinar al menos una letra y un número.";
  return null;
}

async function seedAdmin(){
  const users = getUsers();
  const hashDefault = await hashPass(atob(ADMIN_CLAVE_B64));
  const admin = users.find(u => u.email === "admin@veloce.com");
  if (!admin){
    users.push({ id:"u-admin", nombre:"Administrador Veloce", email:"admin@veloce.com", passHash: hashDefault, rol:"administrador", activo:true });
    saveUsers(users);
  } else if (admin.passHash === null){
    admin.passHash = hashDefault;
    saveUsers(users);
  }
}

async function registrarUsuario(nombre, email, pass){
  if (!nombre) return "⚠️ Escribe tu nombre completo.";
  if (!emailValido(email)) return "⚠️ El correo no es válido. Ejemplo correcto: nombre@dominio.com";
  if (getUsers().find(u => u.email === email)) return "⚠️ Ya existe una cuenta registrada con este correo.";
  const err = validarFortaleza(pass);
  if (err) return err;
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
  const err = validarFortaleza(nuevaPass);
  if (err) return err;
  const users = getUsers();
  users.find(u => u.email === email).passHash = await hashPass(nuevaPass);
  saveUsers(users);
  delete codigosRecuperacion[email];
  return null;
}

/* ============ CARRITO POR USUARIO ============ */
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
  li.style.cssText = "display:flex;align-items:center;gap:10px;font-size:.88rem;white-space:nowrap;";
  if (s){
    const esAdmin = s.rol === "administrador";
    li.innerHTML =
      `<span style="display:inline-flex;align-items:center;gap:7px;font-weight:600;color:var(--ink);">👤 ${s.nombre.split(" ")[0]}` +
        (esAdmin ? `<span style="background:var(--accent);color:#fff;font-size:.6rem;font-weight:800;letter-spacing:.08em;padding:3px 9px;border-radius:999px;">ADMIN</span>` : "") +
      `</span>` +
      (esAdmin ? `<a href="admin.html" style="display:inline-flex;align-items:center;padding:7px 15px;border:1.5px solid var(--accent);border-radius:999px;color:var(--accent);font-weight:700;font-size:.82rem;transition:all .2s;" onmouseover="this.style.background='var(--accent)';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='var(--accent)'">Panel</a>` : "") +
      `<button onclick="cerrarSesion()" style="background:none;border:none;color:var(--ink-soft);cursor:pointer;text-decoration:underline;font-size:.82rem;">Salir</button>`;
  } else {
    li.innerHTML = `<a href="login.html" style="font-weight:600;color:var(--accent);">Ingresar</a>`;
  }
  list.appendChild(li);
}

/* ============ PEDIDOS Y PAGO ============ */
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
  descontarStock(pedido.items);   /* 📉 el inventario se actualiza con cada venta */
  setCart([]);
  ultimoPedido = pedido;
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
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px;">
        <button class="btn" onclick="generarReciboPedido()">📄 Descargar recibo en PDF</button>
        <a href="catalogo.html" class="btn btn--ghost">Seguir comprando</a>
      </div>
    </div>`;
  window.scrollTo({ top:0, behavior:"smooth" });
}

/* ============ RECIBOS EN PDF ============ */
function abrirVentanaRecibo(contenido){
  const win = window.open("", "_blank", "width=820,height=940");
  if (!win){ alert("⚠️ Tu navegador bloqueó la ventana emergente. Permite las ventanas emergentes para descargar el recibo."); return; }
  win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Recibo Veloce Bikes</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;color:#0B1220;padding:40px;background:#fff}
    .head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:3px solid #FF4D00;padding-bottom:16px;margin-bottom:24px}
    .logo{font-size:26px;font-weight:800}
    .logo span{color:#FF4D00}
    .meta{text-align:right;font-size:12px;color:#5B6472;line-height:1.8}
    h1{font-size:18px;margin-bottom:4px}
    .sub{color:#5B6472;font-size:12px;margin-bottom:20px}
    .box{border:1px solid #E6E9EF;border-radius:10px;padding:16px;margin-bottom:18px;font-size:13px;line-height:1.9}
    table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:18px}
    th{background:#0B0F14;color:#fff;text-align:left;padding:10px 12px;font-size:11px;letter-spacing:.06em;text-transform:uppercase}
    td{padding:10px 12px;border-bottom:1px solid #E6E9EF}
    .tot{margin-left:auto;width:280px;font-size:13px}
    .tot div{display:flex;justify-content:space-between;gap:12px;padding:6px 0}
    .tot .grand{border-top:2px solid #0B1220;margin-top:6px;padding-top:10px;font-size:16px;font-weight:800}
    .tot .grand span:last-child{color:#FF4D00}
    .foot{margin-top:32px;border-top:1px dashed #9AA4B2;padding-top:14px;font-size:11px;color:#5B6472;text-align:center;line-height:1.8}
    @media print{ body{padding:10mm} }
  </style></head><body>${contenido}
  <script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
  </body></html>`);
  win.document.close();
}

function generarReciboPedido(pedido){
  const p = pedido || ultimoPedido;
  if (!p){ alert("⚠️ No hay ningún pedido reciente para generar el recibo."); return; }
  const filas = p.items.map(i =>
    `<tr><td>${i.cantidad} × ${i.nombre} (T ${i.talla}, ${i.color})</td><td>${fmt(i.precio)}</td><td style="text-align:right">${fmt(i.precio * i.cantidad)}</td></tr>`
  ).join("");
  abrirVentanaRecibo(`
    <div class="head">
      <div>
        <div class="logo">🚲 VELOCE <span>BIKES</span></div>
        <div class="sub" style="margin:0">Tecnología y pasión sobre dos ruedas<br>SENA — CBI Palmira · NIT 900.123.456-8</div>
      </div>
      <div class="meta">
        <strong>RECIBO DE VENTA</strong><br>
        N° ${p.id}<br>
        Fecha: ${new Date(p.fecha).toLocaleString("es-CO")}<br>
        Estado: ${p.estado.toUpperCase()}
      </div>
    </div>
    <h1>Gracias por tu compra, ${p.usuarioNombre}</h1>
    <p class="sub">Este comprobante certifica tu pedido realizado en Veloce Bikes (pago simulado con fines formativos).</p>
    <div class="box">
      <b>Cliente:</b> ${p.usuarioNombre} · ${p.email}<br>
      <b>Envío:</b> ${p.direccion.direccion}, ${p.direccion.ciudad} · Tel: ${p.direccion.telefono}<br>
      <b>Pago:</b> ${p.pago.metodo} terminada en ${p.pago.ultimos4}
    </div>
    <table>
      <thead><tr><th>Concepto</th><th>P. unitario</th><th style="text-align:right">Subtotal</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <div class="tot">
      <div><span>Subtotal</span><span>${fmt(p.subtotal)}</span></div>
      <div><span>Envío</span><span>${p.envio === 0 ? "Gratis" : fmt(p.envio)}</span></div>
      <div class="grand"><span>TOTAL PAGADO</span><span>${fmt(p.total)}</span></div>
    </div>
    <div class="foot">
      Documento equivalente a factura (simulado) · Garantía de 2 años en cuadro y componentes<br>
      Devoluciones dentro de los 30 días · https://joaovasquez685-cmd.github.io/BikeStore/
    </div>`);
}

function generarReciboCita(cita){
  if (!cita){ alert("⚠️ No hay ninguna cita reciente para generar el recibo."); return; }
  const extras = (cita.extras && cita.extras.length) ? cita.extras.join(", ") : "Ninguno";
  abrirVentanaRecibo(`
    <div class="head">
      <div>
        <div class="logo">🚲 VELOCE <span>BIKES</span></div>
        <div class="sub" style="margin:0">Servicio técnico especializado<br>SENA — CBI Palmira</div>
      </div>
      <div class="meta">
        <strong>COMPROBANTE DE CITA</strong><br>
        N° ${cita.id}<br>
        Emitido: ${new Date(cita.fechaRegistro).toLocaleString("es-CO")}<br>
        Estado: ${cita.estado.toUpperCase()}
      </div>
    </div>
    <h1>Cita agendada: ${cita.nombreServicio}</h1>
    <p class="sub">Presenta este comprobante el día de tu servicio.</p>
    <div class="box">
      <b>Cliente:</b> ${cita.nombre} · Tel: ${cita.telefono}${cita.correo ? " · " + cita.correo : ""}<br>
      <b>Bicicleta:</b> ${cita.tipoBici}${cita.marcaBici ? " — " + cita.marcaBici : ""}<br>
      <b>Fecha y hora:</b> ${cita.fechaPreferida} a las ${cita.hora}<br>
      <b>Urgencia:</b> ${cita.urgencia === "prioritario" ? "Prioritario" : "Normal"} · <b>Extras:</b> ${extras}<br>
      <b>Descripción:</b> ${cita.descripcion || "Sin observaciones adicionales."}
    </div>
    <div class="tot">
      <div><span>Servicio</span><span>${cita.nombreServicio}</span></div>
      <div class="grand"><span>TOTAL ESTIMADO</span><span>${fmt(cita.totalEstimado)}</span></div>
    </div>
    <div class="foot">
      El valor final puede variar según repuestos requeridos (se cotizan antes de instalar).<br>
      Garantía de 30 días sobre mano de obra · https://joaovasquez685-cmd.github.io/BikeStore/mantenimiento.html
    </div>`);
}

/* ============ MÓDULO DE ADMINISTRACIÓN ============ */
function requireAdmin(){
  const s = getSession();
  if (s && s.rol === "administrador") return true;
  const content = $("admin-content"); if (content) content.hidden = true;
  const denied = $("admin-denied"); if (denied) denied.hidden = false;
  return false;
}
function renderAdminProducts(){
  const q = ($("admin-prod-search") ? $("admin-prod-search").value : "").toLowerCase();
  const cat = $("admin-prod-cat") ? $("admin-prod-cat").value : "";
  const lista = getAllProducts().filter(p =>
    (!q || p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)) &&
    (!cat || p.categoria === cat));
  $("admin-products-table").innerHTML = lista.length ? lista.map(p => `
    <tr>
      <td><img src="${p.imagen}" style="width:56px;height:42px;object-fit:cover;border-radius:8px;background:#EDEFF2;${p.stock <= 0 ? "filter:grayscale(1);opacity:.6;" : ""}" alt="" onerror="this.onerror=null;this.src='img/placeholder.svg'"></td>
      <td><strong>${p.nombre}</strong><br><small style="color:#5B6472;">${p.marca} · ${CAT_NOMBRES[p.categoria] || p.categoria}</small></td>
      <td>${fmt(p.precio)}</td>
      <td>${p.stock <= 0 ? '<strong style="color:var(--bad);">0 (agotado)</strong>' : p.stock}</td>
      <td>${p.activo === false ? '<span class="tag tag--off">Inactivo</span>' : '<span class="tag tag--on">Activo</span>'}</td>
      <td><div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="mini-btn" onclick="abrirFormProducto('${p.id}')">✏️ Editar</button>
        <button class="mini-btn" onclick="adminToggleProducto('${p.id}')">${p.activo === false ? "✅ Activar" : "🚫 Inactivar"}</button>
      </div></td>
    </tr>`).join("") : `<tr><td colspan="6" style="text-align:center;padding:24px;color:#5B6472;">Sin resultados para la búsqueda.</td></tr>`;
}
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
    imagen: $("pf-imagen").value.trim() || "img/placeholder.svg",
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
    const original = all.find(x => x.id === id);
    /* Si solo cambió el stock, redistribuye proporcional entre colores existentes */
    if (original && original.stock !== stock && original.nombresColores && original.nombresColores.length){
      const n = original.nombresColores.length;
      datos.nombresColores = original.nombresColores;
      datos.colores = original.colores;
      datos.stockPorColor = original.nombresColores.map((_, i) =>
        i === 0 ? Math.ceil(stock / n) : Math.floor(stock / n));
    }
    Object.assign(original, datos);
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
function adminToggleProducto(id){
  const all = getAllProducts();
  const p = all.find(x => x.id === id);
  p.activo = (p.activo === false);
  saveAllProducts(all);
  initProductsDB();
  renderAdminProducts();
  alert(p.activo ? "✅ Producto activado: vuelve a aparecer en el catálogo." : "🚫 Producto inactivado: ya no aparece en el catálogo (RF-19).");
}
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
function adminToggleRol(id){
  const us = getUsers();
  const u = us.find(x => x.id === id);
  if (u.id === "u-admin"){ alert("⚠️ El administrador principal no puede cambiar de rol."); return; }
  u.rol = (u.rol === "administrador") ? "cliente" : "administrador";
  saveUsers(us);
  renderAdminUsers();
  alert(`✅ Ahora ${u.nombre} tiene rol: ${u.rol}.`);
}
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

function volverAnterior(){
  if (history.length > 1){ history.back(); return; }
  location.href = (currentProduct && currentProduct.categoria === "accesorios") ? "accesorios.html" : "catalogo.html";
}

function cardHTML(p){
  const catLabel = p.subcategoria
    ? p.subcategoria.charAt(0).toUpperCase() + p.subcategoria.slice(1)
    : (CAT_NOMBRES[p.categoria] || p.categoria);
  const agotado = p.stock <= 0;
  return `
  <article class="product-card">
    ${agotado ? `<span class="badge" style="background:#5B6472;">Agotado</span>` : (p.badge ? `<span class="badge">${p.badge}</span>` : "")}
    <a href="producto.html?id=${p.id}" aria-label="Ver detalle de ${p.nombre}">
      <img src="${p.imagen}" alt="${p.nombre} - categoría ${catLabel}" class="product-card__img" loading="lazy" decoding="async" ${agotado ? 'style="filter:grayscale(1);opacity:.55;"' : ''} onerror="this.onerror=null;this.src='img/placeholder.svg'">
    </a>
    <div class="product-card__body">
      <h2 class="product-card__title">${p.nombre}</h2>
      <p class="product-card__cat">${catLabel} · ${p.marca}</p>
      <p class="stars" aria-label="Calificación ${p.reviews.promedio} de 5">${estrellas(p.reviews.promedio)} <span>(${p.reviews.total})</span></p>
      <p class="product-card__price">${p.precioAnterior ? `<s class="price-old">${fmt(p.precioAnterior)}</s> ` : ""}${fmt(p.precio)}</p>
      <div class="product-card__actions">
        <a href="producto.html?id=${p.id}" class="btn">Ver detalles</a>
        <button type="button" class="btn" style="flex:none;width:44px;padding:10px 0;font-size:1.25rem;line-height:1;border-radius:10px;${agotado ? "opacity:.4;cursor:not-allowed;box-shadow:none;" : ""}" ${agotado ? "disabled" : ""} onclick="agregarRapido('${p.id}')" title="${agotado ? "Sin stock disponible" : "Agregar al carrito"}" aria-label="Agregar ${p.nombre} al carrito">+</button>
      </div>
      <label class="compare-check" style="margin-top:8px;"><input type="checkbox" ${comparados.includes(p.id) ? "checked" : ""} onchange="toggleCompare('${p.id}', this)"> Comparar</label>
    </div>
  </article>`;
}

function agregarRapido(id){
  const p = productos.find(x => x.id === id);
  if (!p) return;
  if (p.stock <= 0){ alert(`⚠️ ${p.nombre} está AGOTADO por el momento. Pronto repondremos stock.`); return; }
  const talla = p.tallas[0], color = p.nombresColores[0], stock = p.stockPorColor[0];
  if (stock <= 0){ alert(`⚠️ ${p.nombre} está agotada en el color ${color}. Revísala en el detalle.`); return; }
  const cart = getCart();
  const ex = cart.find(i => i.id === id && i.talla === talla && i.color === color);
  if (ex) ex.cantidad = Math.min(ex.cantidad + 1, stock);
  else cart.push({ id:p.id, nombre:p.nombre, precio:p.precio, imagen:p.imagen, talla, color, cantidad:1, categoria:p.categoria });
  setCart(cart); updateCartCount();
  alert(`✅ ${p.nombre} agregado al carrito (Talla ${talla}, ${color}).`);
}

function renderGrid(lista, id){
  const grid = $(id); if (!grid) return;
  grid.innerHTML = lista.length ? lista.map(cardHTML).join("") : `<p class="empty-msg">No se encontraron productos con estos criterios.</p>`;
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
    if (comparados.length >= 3){ cb.checked = false; alert("Puedes comparar máximo 3 productos."); return; }
    comparados.push(id);
  } else comparados = comparados.filter(x => x !== id);
  actualizarCompareBar();
}
function actualizarCompareBar(){
  const bar = $("compare-bar"); if (!bar) return;
  bar.hidden = comparados.length === 0;
  $("compare-txt").textContent = `${comparados.length} de 3 seleccionados`;
}
function limpiarCompare(){
  comparados = []; actualizarCompareBar();
  document.querySelectorAll(".compare-check input").forEach(c => c.checked = false);
}
function abrirComparador(){
  const ps = comparados.map(id => productos.find(p => p.id === id));
  const filas = [["Precio", p => fmt(p.precio)], ["Categoría", p => CAT_NOMBRES[p.categoria] || p.categoria], ["Marca", p => p.marca],
    ["Cuadro", p => p.specs.cuadro || "—"], ["Frenos", p => p.specs.frenos || "—"], ["Rueda", p => p.specs.rueda || "—"],
    ["Velocidades", p => p.specs.velocidades || "—"], ["Peso", p => p.specs.peso || "—"], ["Carga máx.", p => p.specs.cargaMax || "—"], ["Stock", p => (p.stock <= 0 ? "Agotado" : p.stock + " u.")]];
  abrirModal("Comparar productos", `<div class="table-scroll"><table class="specs-table compare-table">
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
      `<li><button type="button" onclick="elegirSugerencia('${p.id}')">${p.nombre} <small>· ${CAT_NOMBRES[p.categoria] || p.categoria}</small></button></li>`).join("");
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

  const bcCat = $("bc-cat");
  if (bcCat){
    if (p.categoria === "accesorios"){ bcCat.href = "accesorios.html"; bcCat.textContent = "Accesorios"; }
    else { bcCat.href = "catalogo.html"; bcCat.textContent = "Catálogo"; }
  }
  const bcName = $("bc-name");
  if (bcName) bcName.textContent = p.nombre;

  $("pdp-title").textContent = p.nombre;
  $("pdp-cat").textContent = `${p.subcategoria ? p.subcategoria.charAt(0).toUpperCase() + p.subcategoria.slice(1) : (CAT_NOMBRES[p.categoria] || p.categoria)} · ${p.marca}`;
  $("pdp-desc").textContent = p.descripcion;
  $("pdp-price").innerHTML = `${p.precioAnterior ? `<s class="price-old">${fmt(p.precioAnterior)}</s> ` : ""}${fmt(p.precio)}`;
  $("pdp-rating").innerHTML = `${estrellas(p.reviews.promedio)} <span>${p.reviews.promedio} · ${p.reviews.total} reseñas</span>`;
  const img = $("pdp-img"); img.src = p.imagen; img.alt = p.nombre;
  if (p.stock <= 0) img.style.cssText = "filter:grayscale(1);opacity:.6;";
  img.onerror = () => { img.src = "img/placeholder.svg"; };

  renderColores(p); renderTallas(p); renderSpecs(p); renderResenas(p);
  actualizarStock();

  /* Botón añadir: se bloquea si el producto está agotado */
  const btnAdd = $("btn-add-cart");
  if (p.stock <= 0){
    btnAdd.disabled = true;
    btnAdd.style.opacity = ".5";
    btnAdd.style.cursor = "not-allowed";
    btnAdd.style.boxShadow = "none";
    btnAdd.textContent = "🚫 Producto agotado";
    btnAdd.onclick = null;
  } else {
    btnAdd.disabled = false;
    btnAdd.style.opacity = "";
    btnAdd.style.cursor = "";
    btnAdd.style.boxShadow = "";
    btnAdd.textContent = "🛒 Añadir al Carrito";
    btnAdd.onclick = () => addToCart(p);
  }
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
    `<button type="button" class="color-swatch ${i === 0 ? "selected" : ""}" style="background:${c};${(p.stockPorColor[i] || 0) <= 0 ? "opacity:.35;" : ""}" title="${p.nombresColores[i]}${(p.stockPorColor[i] || 0) <= 0 ? " (agotado)" : ""}" aria-label="Color ${p.nombresColores[i]}" onclick="selectColor(${i})"></button>`).join("");
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
  if (p.stock <= 0){
    el.textContent = "PRODUCTO AGOTADO — sin unidades disponibles";
    el.className = "stock-label stock-out";
    return;
  }
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
  const etiquetas = { cuadro:"Material del cuadro", suspension:"Suspensión", velocidades:"Velocidades", frenos:"Frenos", rueda:"Tamaño de rueda", peso:"Peso", componentes:"Componentes", horquilla:"Horquilla", cargaMax:"Capacidad de carga", motor:"Motor", autonomia:"Autonomía", talla:"Tallas", certificacion:"Certificación", ventilacion:"Ventilación", material:"Material", palmilla:"Palmilla", cierre:"Cierre", lavado:"Lavado", proteccion:"Protección", impermeabilidad:"Impermeabilidad", bolsillos:"Bolsillos", badana:"Badana", tirantes:"Tirantes", columna:"Columna de agua", altura:"Altura", luminosidad:"Luminosidad", carga:"Carga", resistencia:"Resistencia", modos:"Modos", montaje:"Montaje", sensor:"Sensor", norma:"Norma", ajuste:"Ajuste", capacidad:"Capacidad", aislamiento:"Aislamiento", tapa:"Tapa", tornilleria:"Tornillería", compatibilidad:"Compatibilidad", incluye:"Incluye", presion:"Presión", manometro:"Manómetro", cabezal:"Cabezal", base:"Base", eslabones:"Eslabones", tratamiento:"Tratamiento", rango:"Rango", rodamientos:"Rodamientos", rosca:"Rosca", riel:"Riel", ancho:"Ancho", longitud:"Longitud", llaves:"Llaves", soporte:"Soporte", funda:"Funda", extra:"Extra", interiores:"Interior" };
  $("specs-body").innerHTML = Object.entries(p.specs || {}).map(([k, v]) =>
    `<tr><th scope="row">${etiquetas[k] || k}</th><td>${v}</td></tr>`).join("");
}

function renderResenas(p){
  const cont = $("reviews-list"); if (!cont) return;
  cont.innerHTML = generarResenas(p).map(r => `
    <article class="review-card">
      <header><strong>${r.autor}</strong> <span class="stars">${estrellas(r.rating)}</span> <time>${r.fecha}</time></header>
      <p>${r.texto}</p>
    </article>`).join("");
}

function addToCart(p){
  if (p.stock <= 0){ alert(`⚠️ ${p.nombre} está AGOTADO por el momento.`); return; }
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
    cont.innerHTML = `<p class="empty-msg">Tu carrito está vacío. <a href="catalogo.html" style="color:var(--accent);font-weight:600;">Ver catálogo</a> · <a href="accesorios.html" style="color:var(--accent);font-weight:600;">Ver accesorios</a></p>`;
    $("cart-subtotal").textContent = fmt(0); $("cart-total").textContent = fmt(0);
    $("cart-shipping").textContent = "—"; return;
  }

  let subtotal = 0;
  cont.innerHTML = cart.map((item, i) => {
    subtotal += item.precio * item.cantidad;
    return `
    <div class="cart-item">
      <img src="${item.imagen}" alt="${item.nombre}" onerror="this.onerror=null;this.src='img/placeholder.svg'">
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

/* ============ ANTI "CARGA INFINITA" ============ */
setTimeout(() => {
  document.querySelectorAll("img").forEach(im => {
    if (!im.complete && !im.dataset.fb) { im.dataset.fb = "1"; im.src = "img/placeholder.svg"; }
  });
}, 6000);

/* ============ VSELECT: dropdowns personalizados animados ============ */
(function(){
  const registry = [];

  function initVSelects(){
    document.querySelectorAll(".booking-form select, select[data-vselect]").forEach(sel => {
      if (sel.dataset.vselectInit) return;
      sel.dataset.vselectInit = "1";

      const wrap = document.createElement("div");
      wrap.className = "vselect";
      sel.parentNode.insertBefore(wrap, sel);
      wrap.appendChild(sel);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vselect__btn";
      btn.setAttribute("aria-haspopup", "listbox");
      btn.setAttribute("aria-expanded", "false");

      const label = document.createElement("span");
      label.className = "vselect__label";
      const arrow = document.createElement("span");
      arrow.className = "vselect__arrow";
      btn.append(label, arrow);

      const panel = document.createElement("div");
      panel.className = "vselect__panel";
      panel.setAttribute("role", "listbox");
      wrap.append(btn, panel);

      function renderLabel(){
        const chosen = sel.selectedOptions[0];
        label.textContent = chosen ? chosen.textContent : "";
        label.classList.toggle("is-placeholder", !sel.value);
      }

      function renderPanel(){
        panel.innerHTML = "";
        Array.from(sel.options).forEach(op => {
          const it = document.createElement("button");
          it.type = "button";
          it.className = "vselect__option" + (op.selected ? " is-selected" : "");
          it.setAttribute("role", "option");
          it.setAttribute("aria-selected", op.selected ? "true" : "false");
          it.innerHTML = `<span class="vselect__check">${op.selected ? "✓" : ""}</span>${op.textContent}`;
          it.addEventListener("click", () => {
            sel.value = op.value;
            sel.dispatchEvent(new Event("change", { bubbles:true }));
            close();
            renderLabel();
            btn.focus();
          });
          panel.appendChild(it);
        });
      }

      function open(){
        wrap.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        renderPanel();
      }
      function close(){
        wrap.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", () => wrap.classList.contains("is-open") ? close() : open());
      document.addEventListener("click", e => { if (!wrap.contains(e.target)) close(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

      renderLabel();
      registry.push({ sel, renderLabel, last: sel.value });
    });
  }

  setInterval(() => {
    registry.forEach(r => {
      if (r.sel.value !== r.last){ r.last = r.sel.value; r.renderLabel(); }
    });
  }, 300);

  document.addEventListener("DOMContentLoaded", initVSelects);
})();

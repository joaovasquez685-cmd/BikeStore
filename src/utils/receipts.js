import { escapeHtml as e, fmt } from "./format"
import logoNegro from "../assets/img/logo.negro.png"

/* Todos los datos del usuario pasan por escapeHtml: el original los inyectaba sin escapar (XSS en el recibo). */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,Helvetica,sans-serif;color:#0B1220;padding:40px;background:#fff}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:3px solid #FF4D00;padding-bottom:16px;margin-bottom:24px}
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
@media print{ body{padding:10mm} }`

const logo = () => `<img src="${new URL(logoNegro, location.href).href}" alt="Veloce Bikes" style="height:88px;width:auto;display:block;margin-bottom:6px;">`

function abrirVentana(contenido){
  const win = window.open("", "_blank", "width=820,height=940")
  if (!win){ window.alert("⚠️ Tu navegador bloqueó la ventana emergente. Permite las ventanas emergentes para descargar el recibo."); return }
  win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Recibo Veloce Bikes</title><style>${CSS}</style></head><body>${contenido}
  <script>window.onload=function(){setTimeout(function(){window.print()},1000)}<\/script></body></html>`)
  win.document.close()
}

export function generarReciboPedido(p){
  const filas = p.items.map(i =>
    `<tr><td>${i.cantidad} × ${e(i.nombre)} (T ${e(i.talla)}, ${e(i.color)})</td><td>${fmt(i.precio)}</td><td style="text-align:right">${fmt(i.precio * i.cantidad)}</td></tr>`).join("")
  abrirVentana(`
    <div class="head">
      <div>${logo()}<div class="sub" style="margin:0">Tecnología y pasión sobre dos ruedas<br>SENA — CBI Palmira · NIT 900.123.456-8</div></div>
      <div class="meta"><strong>RECIBO DE VENTA</strong><br>N° ${e(p.id)}<br>Fecha: ${new Date(p.fecha).toLocaleString("es-CO")}<br>Estado: ${e(p.estado.toUpperCase())}</div>
    </div>
    <h1>Gracias por tu compra, ${e(p.usuarioNombre)}</h1>
    <p class="sub">Este comprobante certifica tu pedido realizado en Veloce Bikes (pago simulado con fines formativos).</p>
    <div class="box">
      <b>Cliente:</b> ${e(p.usuarioNombre)} · ${e(p.email)}<br>
      <b>Envío:</b> ${e(p.direccion.direccion)}, ${e(p.direccion.ciudad)} · Tel: ${e(p.direccion.telefono)}<br>
      <b>Pago:</b> ${e(p.pago.metodo)} terminada en ${e(p.pago.ultimos4)}
    </div>
    <table><thead><tr><th>Concepto</th><th>P. unitario</th><th style="text-align:right">Subtotal</th></tr></thead><tbody>${filas}</tbody></table>
    <div class="tot">
      <div><span>Subtotal</span><span>${fmt(p.subtotal)}</span></div>
      <div><span>Envío</span><span>${p.envio === 0 ? "Gratis" : fmt(p.envio)}</span></div>
      <div class="grand"><span>TOTAL PAGADO</span><span>${fmt(p.total)}</span></div>
    </div>
    <div class="foot">Documento equivalente a factura (simulado) · Garantía de 2 años en cuadro y componentes<br>Devoluciones dentro de los 30 días · ${e(location.origin)}</div>`)
}

export function generarReciboCita(c){
  const extras = c.extras?.length ? c.extras.map(e).join(", ") : "Ninguno"
  abrirVentana(`
    <div class="head">
      <div>${logo()}<div class="sub" style="margin:0">Servicio técnico especializado<br>SENA — CBI Palmira</div></div>
      <div class="meta"><strong>COMPROBANTE DE CITA</strong><br>N° ${e(c.id)}<br>Emitido: ${new Date(c.fechaRegistro).toLocaleString("es-CO")}<br>Estado: ${e(c.estado.toUpperCase())}</div>
    </div>
    <h1>Cita agendada: ${e(c.nombreServicio)}</h1>
    <p class="sub">Presenta este comprobante el día de tu servicio.</p>
    <div class="box">
      <b>Cliente:</b> ${e(c.nombre)} · Tel: ${e(c.telefono)}${c.correo ? " · " + e(c.correo) : ""}<br>
      <b>Bicicleta:</b> ${e(c.tipoBici)}${c.marcaBici ? " — " + e(c.marcaBici) : ""}<br>
      <b>Fecha y hora:</b> ${e(c.fechaPreferida)} a las ${e(c.hora)}<br>
      <b>Urgencia:</b> ${c.urgencia === "prioritario" ? "Prioritario" : "Normal"} · <b>Extras:</b> ${extras}<br>
      <b>Descripción:</b> ${e(c.descripcion) || "Sin observaciones adicionales."}
    </div>
    <div class="tot">
      <div><span>Servicio</span><span>${e(c.nombreServicio)}</span></div>
      <div class="grand"><span>TOTAL ESTIMADO</span><span>${fmt(c.totalEstimado)}</span></div>
    </div>
    <div class="foot">El valor final puede variar según repuestos requeridos (se cotizan antes de instalar).<br>Garantía de 30 días sobre mano de obra · ${e(location.origin)}/mantenimiento</div>`)
}

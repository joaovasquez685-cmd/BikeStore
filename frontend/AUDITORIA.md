# Auditoría del proyecto original (HTML/CSS/JS puro) y qué se hizo con cada hallazgo

Alcance: 9 páginas HTML, `js/app.js` (1163 líneas), `js/data.js` (50 productos), `css/styles.css` (563 líneas).

## Seguridad
| # | Hallazgo | Estado en React |
|---|----------|-----------------|
| S1 | **XSS almacenado**: nombres de usuario, clientes de citas, direcciones y datos del recibo se inyectaban con `innerHTML`/`document.write` sin escapar (admin los veía). | ✅ Corregido: JSX escapa por defecto; los recibos usan `escapeHtml`. |
| S2 | Clave del administrador (`Admin123*`) embebida en el JS público (base64 ≠ cifrado). | ⚠️ Mitigado: pasa a `.env` y solo existe en modo demo. **Solución real: usuarios en BD + hash en servidor.** |
| S3 | Autorización por rol solo en el navegador (cualquiera edita `localStorage` y se vuelve admin). | ⚠️ Pendiente de backend: ahora el guard vive en `AdminOnly` y en los services (`exigirAdmin`); el backend debe validar el JWT. |
| S4 | Hash SHA-256 con sal fija; sesión sin expiración. | ⚠️ Solo demo; el backend debe usar bcrypt/argon2 + expiración. |
| S5 | Pago: el formulario pide tarjeta/CVV. | ✅ El pedido guarda solo los últimos 4 dígitos (igual que antes). Con backend usar pasarela/tokenización. |

## Errores funcionales
| # | Hallazgo | Estado |
|---|----------|--------|
| F1 | Tras **registrarse** no se iniciaba sesión (redirigía al inicio sin sesión). | ✅ Inicio de sesión automático y regreso a la página de origen (p. ej. carrito). |
| F2 | `catalogo?cat=` no reaccionaba si ya estabas en el catálogo. | ✅ Se sincroniza con la URL. |
| F3 | El checkout **no validaba stock** vigente → se podía vender de más. | ✅ `orderService.create` valida stock antes de cobrar. |
| F4 | Exportar CSV ignoraba los filtros del dashboard, sin BOM (tildes rotas en Excel) y sin escapar comillas. | ✅ Respeta filtros, BOM UTF-8, comillas escapadas. |
| F5 | Citas: se podía agendar domingos y sábados por la tarde (la tienda no atiende). | ✅ `validarHorarioCita`. |
| F6 | `toISOString()` para la fecha mínima de la cita usaba UTC (desfase de un día en la tarde-noche de Colombia). | ✅ `fechaLocalISO`. |
| F7 | Inicio: `productos.sort()` mutaba el catálogo global. | ✅ Se ordena una copia. |
| F8 | Pestañas del admin no marcaban la activa. | ✅ |
| F9 | Contadores de modelos por categoría escritos a mano en el HTML. | ✅ Calculados del catálogo. |
| F10 | Botones "Eliminar recibo" inyectados con `setInterval` cada 800 ms. | ✅ Nativos en `AdminReceiptsPanel`. |
| F11 | `VSelect` sincronizaba con `setInterval` de 300 ms y recreaba listeners globales por cada select. | ✅ Componente `VSelect` controlado. |
| F12 | Estado "comparar" y guía de tallas globales ligados al DOM. | ✅ `CompareContext` / `UiContext`. |
| F13 | Logout hacía `location.reload()`. | ✅ Solo actualiza el estado. |

## Recursos y SEO
| # | Hallazgo | Estado |
|---|----------|--------|
| R1 | `img/placeholder.webp` no existe (el real es `.svg`); `logo.blanco.png`, `logo.negro.jpg`, `logo.png`, `logo.blanco.webp` referenciados en CSS no existen. | ✅ Rutas corregidas; CSS usa `logo.negro.png` / `logo.blanco.jpg`. |
| R2 | CSS con `@import` de Google Fonts (bloquea render). | ✅ `<link rel="preconnect">` + `<link>` en `index.html`. |
| R3 | **Las 50 fotos de producto dependen de hosts externos** (`image.qwenlm.ai`, `placehold.co`, Unsplash). Si caen, la tienda queda sin imágenes. | ⚠️ Se mantienen (fallback a placeholder). **Recomendado: descargarlas a `public/products/`.** |
| R4 | `city-commuter.png` pesa 1.7 MB. | ⚠️ Recomendado optimizar a WebP (~150 KB). |
| R5 | Texto del footer "Hecho con HTML, CSS y JS puros". | ✅ Actualizado. |
| R6 | `sitemap.xml` y README apuntan a una URL de GitHub Pages ajena al repo; `producto.html` sin `?id=` indexado. | ⚠️ Actualizar al dominio final y listar `/producto/:id`. |
| R7 | Meta/JSON-LD por página manuales. | ✅ `usePageMeta` por página y por producto. |

## Compatibilidad
- Se conservan las claves de `localStorage` (`veloce_products`, `veloce_users`, `veloce_orders`, …): los datos del sitio antiguo (mismo dominio) siguen funcionando.
- Las URLs antiguas (`catalogo.html`, `producto.html?id=x`, …) redirigen a las nuevas.
- Si despliegas en GitHub Pages con `BrowserRouter`, añade un `404.html` que redirija a `index.html` (o cambia a `HashRouter`).

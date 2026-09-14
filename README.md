# 🚴 Veloce Bikes — Tienda Web de Bicicletas, Accesorios y Servicio Técnico

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-2088FF?style=flat&logo=github)
![SENA](https://img.shields.io/badge/SENA-ADSO-39A900?style=flat)

**Veloce Bikes** es un e-commerce de bicicletas, accesorios y servicio técnico desarrollado como proyecto formativo del **SENA**, construido 100% con tecnologías web nativas (sin frameworks ni dependencias), enfocado en rendimiento, accesibilidad y SEO técnico.

🔗 **Demo en vivo:** https://joaovasquez685-cmd.github.io/BikeStore/

---

## ✨ Funcionalidades

### 🛍️ Cliente
- 🛒 **Catálogo de 20 bicicletas** en 6 categorías: montaña, ruta, urbana, eléctrica, BMX e infantil (RF-01 a RF-04).
- 🪖 **Tienda de accesorios con 30 artículos** en 8 subcategorías: cascos, guantes, ropa, iluminación, seguridad, hidratación, herramientas y componentes, con tiles de acceso rápido y filtros por subcategoría, marca y precio.
- 🔍 **Filtros combinados**: categoría, marca, precio, talla, color y tipo de frenos + ordenamiento y buscador con autocompletado.
- 📄 **Ficha de producto dinámica** (por URL `?id=`): galería con zoom, selector de color con stock en tiempo real, selector de talla con guía interactiva, tabla de especificaciones técnicas, botón **← Volver** y migas de pan inteligentes (Accesorios o Catálogo según el origen).
- ⚖️ **Comparador** de hasta 3 productos lado a lado.
- 🛍️ **Carrito persistente** con `localStorage`, cantidades editables (+/−) y checkout simulado (RF-05 a RF-08).
- 💳 **Pago simulado validado** con generación de número único de pedido y confirmación con comprobante (RF-09 a RF-12).
- 📉 **Inventario en tiempo real**: el stock (total y por color) se descuenta con cada venta; al llegar a 0 el producto se muestra **Agotado** (imagen en gris, botón deshabilitado, ficha bloqueada), tanto en bicicletas como en accesorios.
- ⭐ **Reseñas dinámicas por producto**: cada artículo muestra comentarios únicos y estables (generados por semilla desde su ID) que mencionan sus propias especificaciones, con calificaciones coherentes con su promedio y datos estructurados Schema.org (`Product`, `Offer`, `AggregateRating`).
- 🔧 **Mantenimiento y servicio técnico**: agendamiento de citas con planes de servicio (básico, completo, reparación mayor, diagnóstico), descripción del problema, extras cotizados (urgencia, recogida/entrega), control de cupos por fecha y hora, y resumen de costo en vivo.
- 🧾 **Recibos en PDF**: al comprar o al agendar una cita se genera un recibo profesional (membrete, numeración, cliente, ítems y totales) listo para guardar como PDF desde el navegador, sin librerías externas.
- 🔐 **Registro con validación de correo**, inicio de sesión y **recuperación de contraseña** con código de 6 dígitos (RF-13 a RF-16).
- 📱 **Diseño mobile-first** responsive (1 → 4 columnas) y accesible (ARIA, contraste WCAG, navegación por teclado), con controles de formulario personalizados (dropdowns animados tipo *vselect*, fechas y checkboxes modernos).

### 🛠️ Administrador (rol protegido)
- 📦 **Gestión de productos**: registrar, editar precios/stock, inactivar/activar, buscar y filtrar, con indicador de agotados (RF-17 a RF-20).
- 👥 **Gestión de usuarios**: listado, búsqueda, asignación de roles y activación/desactivación de cuentas (RF-27 a RF-31).
- 📅 **Gestión de citas**: listado de agendamientos con confirmación/cancelación y recibo por cita.
- 🧾 **Historial permanente de recibos**: todas las ventas y citas quedan guardadas y su recibo en PDF puede regenerarse y descargarse en cualquier momento desde el panel.

### 📊 Dashboard e informes
- 📈 Métricas de ventas totales, pedidos, unidades vendidas y ticket promedio, con alertas de stock bajo (RF-21, RF-22, RF-24).
- 🏆 Ranking de productos más vendidos e ingresos por categoría (RF-23).
- 🔎 Filtros por rango de fechas y categoría (RF-25).
- 📥 Exportación de informes a **Excel (CSV)** y **PDF** (RF-26).

---

## 🔐 Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@veloce.com` | `Admin123*` |
| Cliente | *(regístrate desde el login)* | *(la que definas)* |

> La cuenta administradora se crea automáticamente la primera vez que se abre el sitio.

---

## 🗂️ Estructura del proyecto

```text
BikeStore/
├── index.html          # Home: hero, categorías y más vendidas
├── catalogo.html       # Catálogo con filtros y comparador
├── accesorios.html     # Tienda de accesorios (30 artículos, 8 subcategorías)
├── mantenimiento.html  # Servicio técnico: agendamiento de citas y recibos
├── producto.html       # Ficha de producto dinámica (?id=) con botón volver
├── carrito.html        # Carrito, checkout, confirmación y recibo de venta
├── login.html          # Registro, login y recuperación de contraseña
├── admin.html          # Panel: productos, usuarios, citas y recibos
├── dashboard.html      # Tablero de control e informes exportables
├── css/
│   └── styles.css      # Sistema de diseño + controles modernos y vselect
├── js/
│   ├── data.js         # Semilla del catálogo (20 bicicletas + 30 accesorios)
│   └── app.js          # Lógica: auth, carrito, stock, pedidos, recibos, admin
├── img/
│   ├── capturas/       # Evidencias visuales del README
│   ├── city-commuter.png
│   └── placeholder.svg # Imagen de respaldo vectorial (fallback)
├── docs/
│   ├── documentacion-ingenieria.md   # Análisis, arquitectura, MER/MR, pruebas, SCRUM
│   └── casos-de-uso.md               # Diagrama y fichas de casos de uso
├── database/
│   └── bikestore.sql   # Modelo relacional implementado (MySQL 8+)
├── sitemap.xml         # Mapa del sitio para buscadores
├── robots.txt          # Reglas para robots de indexación
└── README.md
```

---

## 🚀 Cómo ejecutarlo localmente

1. Clona o descarga este repositorio:

```bash
git clone https://github.com/joaovasquez685-cmd/BikeStore.git
```

2. Abre `index.html` directamente en tu navegador, **o** usa la extensión *Live Server* de VS Code.
3. No requiere instalación de dependencias ni servidor backend.

## 🌐 Publicación en GitHub Pages

1. Sube el proyecto a un repositorio público llamado `BikeStore`.
2. Ve a **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Tu sitio quedará en `https://joaovasquez685-cmd.github.io/BikeStore/`.

---

## 💡 Decisiones técnicas destacadas

| Decisión | Motivo |
|---|---|
| HTML/CSS/JS puro (sin frameworks) | Cero bundle size: carga instantánea y mejor LCP (Core Web Vitals) |
| `loading="lazy"` en imágenes | Ahorra datos y acelera el primer render |
| `aspect-ratio` en imágenes | Evita saltos de layout (mejora CLS) |
| JSON-LD Schema.org dinámico | Google muestra precio, stock y estrellas en resultados |
| Sistema de espaciado base 8px | Consistencia visual y mantenimiento fácil |
| `localStorage` para carrito, usuarios, stock y citas | Persistencia sin backend ni costos (equivalente funcional a las tablas) |
| Hash SHA-256 + salt para contraseñas | Nunca se almacenan en texto plano (RNF-05) |
| Control de acceso por rol en rutas admin | Impide acceso no autorizado (RNF-04, RF-30) |
| Recibos PDF vía ventana de impresión nativa | Comprobantes profesionales sin librerías externas (cero dependencias) |
| Reseñas determinísticas por semilla (hash del ID) | Contenido único y estable por producto sin base de datos |
| Descuento de stock transaccional al pagar | Inventario coherente entre carrito, catálogo y panel admin |
| Componente *vselect* propio (dropdown animado) | Formularios modernos y accesibles sin dependencias |

---

## 📚 Documentación de ingeniería

- [`docs/documentacion-ingenieria.md`](docs/documentacion-ingenieria.md): actores, casos de uso, historias de usuario, arquitectura, MER/MR, seguridad, plan de pruebas funcionales y E2E, matriz de trazabilidad y gestión SCRUM (Taiga.io).
- [`docs/casos-de-uso.md`](docs/casos-de-uso.md): diagrama Mermaid y 12 fichas detalladas de casos de uso.
- [`database/bikestore.sql`](database/bikestore.sql): script DDL del modelo relacional implementado en MySQL 8+.

---

## 📷 Capturas de pantalla

### 🏠 Home
![Home](img/capturas/01-home.png)

### 🛍️ Catálogo con filtros
![Catálogo](img/capturas/02-catalogo.png)

### 🪖 Tienda de accesorios
![Accesorios](img/capturas/03-accesorios.png)

### 🔧 Mantenimiento y agendamiento
![Mantenimiento](img/capturas/04-mantenimiento.png)

### 📄 Ficha de producto con reseñas dinámicas
![Ficha de producto](img/capturas/05-producto.png)

### ⚖️ Comparador
![Comparador](img/capturas/06-comparador.png)

### 🛒 Carrito y pago
![Carrito](img/capturas/07-carrito.png)

### ✅ Confirmación de pedido con recibo PDF
![Confirmación](img/capturas/08-pago.png)

### 🔐 Login y registro
![Login](img/capturas/09-login.png)

### 🛠️ Panel de administración (productos, usuarios, citas y recibos)
![Admin](img/capturas/10-admin.png)

### 📊 Dashboard
![Dashboard](img/capturas/11-dashboard.png)

---

## 👤 Autores

**Joan Esteban Bermúdez · Jan Pool Ramos · Johan Manuel Vasquez**
Programa de formación en Análisis y Desarrollo de Software (ADSO)
SENA — CBI Palmira · 2026
GitHub: [@joaovasquez685-cmd](https://github.com/joaovasquez685-cmd)

## 📝 Créditos y licencia

Imágenes de producto obtenidas de bancos gratuitos (Unsplash / Pexels) con fines educativos.
Proyecto didáctico SENA — metodología SCRUM gestionada en Taiga.io — libre para fines académicos.

# 🚴 Veloce Bikes — Tienda Web de Bicicletas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-2088FF?style=flat&logo=github)
![SENA](https://img.shields.io/badge/SENA-ADSO-39A900?style=flat)

**Veloce Bikes** es un e-commerce de bicicletas desarrollado como proyecto formativo del **SENA**, construido 100% con tecnologías web nativas (sin frameworks ni dependencias), enfocado en rendimiento, accesibilidad y SEO técnico.

🔗 **Demo en vivo:** https://joaovasquez685-cmd.github.io/BikeStore/

---

## ✨ Funcionalidades

### 🛍️ Cliente
- 🛒 **Catálogo de 20 bicicletas** en 6 categorías: montaña, ruta, urbana, eléctrica, BMX e infantil (RF-01 a RF-04).
- 🔍 **Filtros combinados**: categoría, marca, precio, talla, color y tipo de frenos + ordenamiento y buscador con autocompletado.
- 📄 **Ficha de producto dinámica** (por URL `?id=`): galería con zoom, selector de color con stock en tiempo real, selector de talla con guía interactiva y tabla de especificaciones técnicas completas.
- ⚖️ **Comparador** de hasta 3 bicicletas lado a lado.
- 🛍️ **Carrito persistente** con `localStorage`, cantidades editables (+/−) y checkout simulado por pasos (RF-05 a RF-08).
- 💳 **Pago simulado validado** con generación de número único de pedido y confirmación con comprobante (RF-09 a RF-12).
- 🔐 **Registro con validación de correo**, inicio de sesión y **recuperación de contraseña** con código de 6 dígitos (RF-13 a RF-16).
- ⭐ **Reseñas y calificaciones** con datos estructurados Schema.org (`Product`, `Offer`, `AggregateRating`).
- 📱 **Diseño mobile-first** responsive (1 → 4 columnas) y accesible (ARIA, contraste WCAG, navegación por teclado).

### 🛠️ Administrador (rol protegido)
- 📦 **Gestión de productos**: registrar, editar precios/stock, inactivar/activar, buscar y filtrar (RF-17 a RF-20).
- 👥 **Gestión de usuarios**: listado, búsqueda, asignación de roles y activación/desactivación de cuentas (RF-27 a RF-31).

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
├── producto.html       # Ficha de producto dinámica (?id=)
├── carrito.html        # Carrito, checkout y confirmación de pago
├── login.html          # Registro, login y recuperación de contraseña
├── admin.html          # Panel: productos y usuarios (solo rol admin)
├── dashboard.html      # Tablero de control e informes exportables
├── css/
│   └── styles.css      # Sistema de diseño (variables, Grid, base 8px)
├── js/
│   ├── data.js         # Semilla del catálogo (20 productos)
│   └── app.js          # Lógica: auth, carrito, pedidos, admin, tienda
├── img/
│   ├── capturas/       # Evidencias visuales del README
│   └── placeholder.webp
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
| `localStorage` para carrito y usuarios | Persistencia sin backend ni costos (equivalente funcional a las tablas) |
| Hash SHA-256 + salt para contraseñas | Nunca se almacenan en texto plano (RNF-05) |
| Control de acceso por rol en rutas admin | Impide acceso no autorizado (RNF-04, RF-30) |

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

### 📄 Ficha de producto
![Ficha de producto](img/capturas/03-producto.png)

### ⚖️ Comparador
![Comparador](img/capturas/04-comparador.png)

### 🛒 Carrito y pago
![Carrito](img/capturas/05-carrito.png)

### ✅ Confirmación de pedido
![Confirmación](img/capturas/06-pago.png)

### 🔐 Login y registro
![Login](img/capturas/07-login.png)

### 🛠️ Panel de administración
![Admin](img/capturas/08-admin.png)

### 📊 Dashboard
![Dashboard](img/capturas/09-dashboard.png)

---

## 👤 Autores

**Joan Esteban Bermúdez · Jan Pool Ramos · Johan Manuel Vasquez**
Programa de formación en Análisis y Desarrollo de Software (ADSO)
SENA — CBI Palmira · 2026
GitHub: [@joaovasquez685-cmd](https://github.com/joaovasquez685-cmd)

## 📝 Créditos y licencia

Imágenes de producto obtenidas de bancos gratuitos (Unsplash / Pexels) con fines educativos.
Proyecto didáctico SENA — metodología SCRUM gestionada en Taiga.io — libre para fines académicos.

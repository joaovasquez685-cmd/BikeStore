# 🚴 Veloce Bikes — Tienda Web de Bicicletas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-2088FF?style=flat&logo=github)

**Veloce Bikes** es un e-commerce de bicicletas desarrollado como proyecto formativo del **SENA**, construido 100% con tecnologías web nativas (sin frameworks ni dependencias), enfocado en rendimiento, accesibilidad y SEO técnico.

🔗 **Demo en vivo:** https://joaovasquez685-cmd.github.io/BikeStore/

---

## ✨ Funcionalidades

- 🛒 **Catálogo de 20 bicicletas** en 6 categorías: montaña, ruta, urbana, eléctrica, BMX e infantil.
- 🔍 **Filtros combinados**: categoría, marca, precio, talla, color y tipo de frenos + ordenamiento y buscador con autocompletado.
- 📄 **Ficha de producto dinámica** (por URL `?id=`): galería con zoom, selector de color con stock en tiempo real, selector de talla con guía interactiva y tabla de especificaciones técnicas completas.
- ⚖️ **Comparador** de hasta 3 bicicletas lado a lado.
- 🛍️ **Carrito persistente** con `localStorage` y checkout simulado por pasos.
- ⭐ **Reseñas y calificaciones** con datos estructurados Schema.org (`Product`, `Offer`, `AggregateRating`).
- 📱 **Diseño mobile-first** responsive (1 → 4 columnas) y accesible (ARIA, contraste WCAG, navegación por teclado).

## 🗂️ Estructura del proyecto

BikeStore/
├── index.html          # Home: hero, categorías y más vendidas
├── catalogo.html       # Catálogo con filtros y comparador
├── producto.html       # Ficha de producto dinámica (?id=)
├── carrito.html        # Carrito y checkout simulado
├── css/
│   └── styles.css      # Sistema de diseño (variables, Grid, base 8px)
├── js/
│   ├── data.js         # Catálogo de 20 productos (mock data)
│   └── app.js          # Lógica: carrito, PDP, filtros, comparador
├── img/
│   └── placeholder.webp
├── sitemap.xml         # Mapa del sitio para buscadores
├── robots.txt          # Reglas para robots de indexación
└── README.md

## 🚀 Cómo ejecutarlo localmente

1. Clona o descarga este repositorio.
2. Abre `index.html` directamente en tu navegador, **o** usa la extensión *Live Server* de VS Code.
3. No requiere instalación de dependencias ni servidor backend.

## 🌐 Publicación en GitHub Pages

1. Sube el proyecto a un repositorio público llamado `BikeStore`.
2. Ve a **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Tu sitio quedará en `https://joaovasquez685-cmd.github.io/BikeStore/`.

##  Decisiones técnicas destacadas

| Decisión | Motivo |
|---|---|
| HTML/CSS/JS puro (sin frameworks) | Cero bundle size: carga instantánea y mejor LCP (Core Web Vitals) |
| `loading="lazy"` en imágenes | Ahorra datos y acelera el primer render |
| `aspect-ratio` en imágenes | Evita saltos de layout (mejora CLS) |
| JSON-LD Schema.org dinámico | Google muestra precio, stock y estrellas en resultados |
| Sistema de espaciado base 8px | Consistencia visual y mantenimiento fácil |
| `localStorage` para el carrito | Persistencia sin backend ni costos |

## 📷 Capturas de pantalla

*(Agrega aquí tus capturas: crea la carpeta `img/capturas/` y reemplaza)*
<!-- ![Home](img/capturas/home.png) -->

## 👤 Autor

Joan Esteban Bermúdez - Jan Pool Ramos - Johan Manuel Vasquez
— Programa de formación en Desarrollo de Software
SENA — Regional [Tu Regional] · 2026
GitHub: [@joaovasquez685-cmd](https://github.com/joaovasquez685-cmd)

## 📝 Créditos y licencia

Imágenes de producto obtenidas de bancos gratuitos (Unsplash / Pexels) con fines educativos.
Proyecto de uso formativo — libre para fines académicos.

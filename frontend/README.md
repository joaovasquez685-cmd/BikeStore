# 🚴 Veloce Bikes — React + Vite

Migración del sitio HTML/CSS/JS puro (`D:\DESARROLLO_WEB\BikeStore`) a **React 19 + Vite**, conservando el diseño (mismo `styles.css`) y todas las funcionalidades.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # producción en /dist
VITE_BASE=/BikeStore/ npm run build   # para GitHub Pages
```

Credenciales demo (modo local): `admin@veloce.com` / valor de `VITE_DEMO_ADMIN_PASSWORD` en `.env`.

## Estructura (Diseño Atómico)

```
src/
├── components/
│   ├── atoms/        Button, Logo, Icons, Stars, Price, Tag, ProductImage, FormGroup, Select, VSelect
│   ├── molecules/    ProductCard, SearchBox, FilterField, ColorSwatches, SizeSelector, QtyControl, CartItem,
│   │                 ReviewCard, KpiCard, Breadcrumbs, SectionHead, Modal, PayPills, NewsletterForm, CompareBar
│   ├── organisms/    Header, Footer, Hero, ProductGrid, BikeFilters, AccessoryFilters, SubTiles, CategoryGrid,
│   │                 PromoBanner, TrustBlock, ProductPurchasePanel, SpecsTable, CartList, CheckoutPanel,
│   │                 OrderConfirmation, AuthCard, ServicePlans, BookingForm, CompareModal, SizeGuideModal,
│   │                 Admin{Products,Users,Appointments,Receipts}Panel, ProductFormModal, DashboardPanel
│   └── templates/    MainLayout, AdminOnly (guard de rol)
├── pages/            Home, Catalog, Accessories, ProductDetail, Cart, Login, Maintenance, Admin, Dashboard, NotFound
├── context/          Auth, Products, Cart, Compare, Ui  (+ AppProviders)
├── services/         ← capa de acceso a datos (ver abajo)
│   ├── index.js      elige local | http según VITE_USE_API
│   ├── local/        adaptadores localStorage (modo demo, igual que el original)
│   └── http/         httpClient + adaptadores REST (contrato documentado en http/index.js)
├── hooks/            useAuth, useCart, useProducts, useCompare, useUi, usePageMeta
├── routes/           AppRouter (rutas + redirecciones de las URLs .html antiguas)
├── data/             products.js (semilla), services.js (planes de mantenimiento)
├── utils/            format, validators, shipping, reviews, receipts, notify
└── styles/global.css (el CSS original + subtiles de accesorios + 4 reglas nuevas)
```

## Cómo conectar el backend / API

1. Implementa los endpoints listados en `src/services/http/index.js`.
2. En `.env`: `VITE_USE_API=true` y `VITE_API_URL=https://tu-api/api`.
3. Nada más cambia: páginas y componentes solo hablan con **contextos → services**; los contextos nunca tocan `localStorage` ni `fetch`.

Flujo: `Componente → hook (useCart…) → Context → services/index.js → local | http → BD`.

Reglas que deben pasar al backend (hoy se simulan en el cliente): hash de contraseñas (bcrypt/argon2), JWT/cookie httpOnly,
autorización por rol, cálculo de totales y descuento de stock transaccional en `POST /orders`, pasarela de pago (jamás recibir el CVV).

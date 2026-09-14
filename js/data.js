/* ========= VELOCE BIKES - Catálogo (20 bicicletas + 30 accesorios = 50 productos) ========= */
const IMG = "https://image.qwenlm.ai/public_source/c4e4968e-2348-4ce3-95ae-1397f6d95640/";
const PH = "https://placehold.co/800x600/"; /* Imágenes remotas que SIEMPRE cargan (sin descargar nada) */

const productos = [
  /* ---------- MONTAÑA ---------- */
  { id:"mtb-001", nombre:"Veloce Trailblazer X1", categoria:"montaña", marca:"Veloce", precio:2850000, precioAnterior:null, stock:12, popularidad:98, fecha:"2026-02-10", badge:"Más Vendida", imagen:IMG+"5c3569782-1f9f-49fd-a96f-cf9d7962e9602128.png",
    colores:["#1A1A2E","#E63946"], nombresColores:["Negro Mate","Rojo Racing"], stockPorColor:[8,4], tallas:["S","M","L","XL"],
    specs:{ cuadro:"Aluminio 6061 hidroformado", suspension:"Delantera 120 mm con bloqueo remoto", velocidades:"1x12 (12 velocidades)", frenos:"Disco hidráulico", rueda:'29"', peso:"12.5 kg", componentes:"Shimano Deore M6100", horquilla:"Aire con rebote ajustable", cargaMax:"120 kg" },
    descripcion:"Dominarás cualquier sendero con la Trailblazer X1: tracción, control y geometría moderna para terrenos técnicos.", reviews:{ promedio:4.8, total:124 } },

  { id:"mtb-002", nombre:"Trek Marlin 7", categoria:"montaña", marca:"Trek", precio:3400000, precioAnterior:null, stock:7, popularidad:91, fecha:"2026-01-15", badge:"", imagen:IMG+"7c3569782-1f9f-49fd-a96f-cf9d7962e9602570.png",
    colores:["#F8F9FA","#2A9D8F"], nombresColores:["Blanco Perla","Verde Bosque"], stockPorColor:[4,3], tallas:["S","M","L","XL"],
    specs:{ cuadro:"Aluminio Alpha Silver", suspension:"RockShox Judy 100 mm", velocidades:"1x10 (10 velocidades)", frenos:"Disco hidráulico", rueda:'29"', peso:"13.1 kg", componentes:"Shimano Deore M5100", horquilla:"Muelle helicoidal con bloqueo", cargaMax:"130 kg" },
    descripcion:"La puerta de entrada al mundo Trek: fiable, versátil y lista para senderos y ciudad.", reviews:{ promedio:4.7, total:86 } },

  { id:"mtb-003", nombre:"Specialized Rockhopper Comp", categoria:"montaña", marca:"Specialized", precio:3100000, precioAnterior:null, stock:5, popularidad:88, fecha:"2025-11-20", badge:"Últimas unidades", imagen:IMG+"0c3569782-1f9f-49fd-a96f-cf9d7962e9604954.png",
    colores:["#1A1A2E","#6C757D"], nombresColores:["Negro","Gris Titanio"], stockPorColor:[3,2], tallas:["S","M","L","XL"],
    specs:{ cuadro:"Aluminio A1 Premium", suspension:"SR Suntour XCM 100 mm", velocidades:"1x9 (9 velocidades)", frenos:"Disco hidráulico", rueda:'29"', peso:"13.8 kg", componentes:"Shimano Altus M2000", horquilla:"Muelle con bloqueo", cargaMax:"120 kg" },
    descripcion:"Un clásico del cross-country recreativo: duradera, cómoda y con frenos hidráulicos de serie.", reviews:{ promedio:4.6, total:54 } },

  { id:"mtb-004", nombre:"GW Raptor 29", categoria:"montaña", marca:"GW", precio:1950000, precioAnterior:2300000, stock:20, popularidad:85, fecha:"2025-09-05", badge:"Oferta", imagen:IMG+"2c3569782-1f9f-49fd-a96f-cf9d7962e9606375.png",
    colores:["#E63946","#1A1A2E"], nombresColores:["Rojo","Negro"], stockPorColor:[12,8], tallas:["S","M","L"],
    specs:{ cuadro:"Aluminio 6061 doble pared", suspension:"Zoom CH-565 100 mm", velocidades:"3x7 (21 velocidades)", frenos:"Disco mecánico", rueda:'29"', peso:"14.2 kg", componentes:"Shimano Tourney TZ500", horquilla:"Muelle con bloqueo", cargaMax:"110 kg" },
    descripcion:"La montaña colombiana más vendida: repuestos económicos y resistencia para el día a día.", reviews:{ promedio:4.4, total:210 } },

  { id:"mtb-005", nombre:"Veloce Enduro Pro Carbon", categoria:"montaña", marca:"Veloce", precio:8900000, precioAnterior:null, stock:3, popularidad:79, fecha:"2026-07-01", badge:"Novedad", imagen:IMG+"8c3569782-1f9f-49fd-a96f-cf9d7962e9607049.png",
    colores:["#1A1A2E","#FF5722"], nombresColores:["Negro","Naranja"], stockPorColor:[2,1], tallas:["M","L","XL"],
    specs:{ cuadro:"Carbono T800 doble suspensión", suspension:"Full suspension 160 mm", velocidades:"1x12 (12 velocidades)", frenos:"Disco hidráulico 200 mm", rueda:'29"', peso:"14.0 kg", componentes:"SRAM GX Eagle", horquilla:"Fox Float 36 Performance", cargaMax:"130 kg" },
    descripcion:"Doble suspensión de carbono para enduro agresivo: bajadas rápidas con control total.", reviews:{ promedio:4.9, total:31 } },

  /* ---------- RUTA ---------- */
  { id:"ruta-001", nombre:"Veloce AeroSpeed Pro", categoria:"ruta", marca:"Veloce", precio:4200000, precioAnterior:null, stock:9, popularidad:93, fecha:"2026-03-12", badge:"Novedad", imagen:IMG+"1c3569782-1f9f-49fd-a96f-cf9d7962e9609134.png",
    colores:["#F8F9FA","#1A1A2E"], nombresColores:["Blanco","Negro"], stockPorColor:[5,4], tallas:["48","52","54","56"],
    specs:{ cuadro:"Carbono T800 aerodinámico", suspension:"Rígida", velocidades:"2x11 (22 velocidades)", frenos:"Disco hidráulico", rueda:"700c", peso:"8.4 kg", componentes:"Shimano 105 R7000", horquilla:"Carbono cónica", cargaMax:"100 kg" },
    descripcion:"Aerodinámica y ligereza para romper tus marcas personales en asfalto.", reviews:{ promedio:4.9, total:67 } },

  { id:"ruta-002", nombre:"Trek Domane AL 2", categoria:"ruta", marca:"Trek", precio:5600000, precioAnterior:null, stock:6, popularidad:84, fecha:"2025-12-01", badge:"", imagen:IMG+"2c3569782-1f9f-49fd-a96f-cf9d7962e9603058.png",
    colores:["#1A1A2E","#0EA5E9"], nombresColores:["Negro","Azul"], stockPorColor:[3,3], tallas:["48","52","54","56"],
    specs:{ cuadro:"Aluminio 100 Series Alpha", suspension:"Rígida (horquilla carbono)", velocidades:"2x8 (16 velocidades)", frenos:"Disco mecánico", rueda:"700c", peso:"9.5 kg", componentes:"Shimano Claris R2000", horquilla:"Carbono Domane", cargaMax:"105 kg" },
    descripcion:"Ruta de resistencia: geometría cómoda para rodadas largas y pavimento irregular.", reviews:{ promedio:4.7, total:42 } },

  { id:"ruta-003", nombre:"Specialized Tarmac SL6 Sport", categoria:"ruta", marca:"Specialized", precio:9800000, precioAnterior:null, stock:4, popularidad:81, fecha:"2026-05-20", badge:"", imagen:IMG+"3c3569782-1f9f-49fd-a96f-cf9d7962e9602018.png",
    colores:["#1A1A2E","#E63946"], nombresColores:["Negro","Rojo"], stockPorColor:[2,2], tallas:["48","52","54","56"],
    specs:{ cuadro:"Carbono FACT 9r", suspension:"Rígida", velocidades:"2x11 (22 velocidades)", frenos:"Zapata (rim)", rueda:"700c", peso:"7.8 kg", componentes:"Shimano 105 R7000", horquilla:"Carbono FACT", cargaMax:"100 kg" },
    descripcion:"Máquina de competición: rígida, ligera y explosiva en cada ataque.", reviews:{ promedio:4.8, total:29 } },

  { id:"ruta-004", nombre:"GW Vento 105", categoria:"ruta", marca:"GW", precio:4700000, precioAnterior:5200000, stock:10, popularidad:76, fecha:"2025-10-10", badge:"Oferta", imagen:IMG+"0c3569782-1f9f-49fd-a96f-cf9d7962e9604297.png",
    colores:["#F8F9FA","#722F37"], nombresColores:["Blanco","Vino tinto"], stockPorColor:[6,4], tallas:["48","52","54"],
    specs:{ cuadro:"Aluminio triple butted", suspension:"Rígida", velocidades:"2x11 (22 velocidades)", frenos:"Disco mecánico", rueda:"700c", peso:"9.0 kg", componentes:"Shimano 105 R7000", horquilla:"Carbono full", cargaMax:"100 kg" },
    descripcion:"Grupo Shimano 105 completo a precio imbatible: la ruta seria empieza aquí.", reviews:{ promedio:4.5, total:58 } },

  /* ---------- URBANA ---------- */
  { id:"urb-001", nombre:"Veloce City Commuter", categoria:"urbana", marca:"Veloce", precio:1250000, precioAnterior:null, stock:25, popularidad:90, fecha:"2025-08-15", badge:"Más Vendida", imagen:"img/city-commuter.png",
    colores:["#1A1A2E","#2A9D8F"], nombresColores:["Negro","Verde"], stockPorColor:[15,10], tallas:["M","L"],
    specs:{ cuadro:"Aluminio 6061 urbano", suspension:"Rígida", velocidades:"1x7 (7 velocidades)", frenos:"V-Brake", rueda:"700c", peso:"13.2 kg", componentes:"Microshift Advent", horquilla:"Aluminio con anclajes", cargaMax:"130 kg" },
    descripcion:"Incluye guardabarros, luces y portaequipajes: lista para rodar la ciudad desde el día uno.", reviews:{ promedio:4.5, total:180 } },

  { id:"urb-002", nombre:"Oxford Nexus 3", categoria:"urbana", marca:"Oxford", precio:1600000, precioAnterior:null, stock:14, popularidad:74, fecha:"2026-04-02", badge:"", imagen:IMG+"6c3569782-1f9f-49fd-a96f-cf9d7962e9603560.png",
    colores:["#0EA5E9","#6C757D"], nombresColores:["Azul","Gris"], stockPorColor:[8,6], tallas:["M","L"],
    specs:{ cuadro:"Aluminio urbano paso bajo", suspension:"Rígida", velocidades:"3 velocidades internas", frenos:"V-Brake", rueda:"700c", peso:"13.5 kg", componentes:"Shimano Nexus 3", horquilla:"Aluminio", cargaMax:"125 kg" },
    descripcion:"Cambios internos sin mantenimiento: ideal para el tráfico y la lluvia.", reviews:{ promedio:4.4, total:63 } },

  { id:"urb-003", nombre:"Veloce Retro Classic", categoria:"urbana", marca:"Veloce", precio:1450000, precioAnterior:null, stock:11, popularidad:70, fecha:"2026-06-18", badge:"Novedad", imagen:IMG+"0c3569782-1f9f-49fd-a96f-cf9d7962e9603836.png",
    colores:["#722F37","#1A1A2E"], nombresColores:["Vino tinto","Negro"], stockPorColor:[6,5], tallas:["M","L"],
    specs:{ cuadro:"Acero Hi-Ten clásico", suspension:"Rígida", velocidades:"1 velocidad (single speed)", frenos:"Zapata (caliper)", rueda:"700c", peso:"12.8 kg", componentes:"Maza sellada single speed", horquilla:"Acero cromado", cargaMax:"120 kg" },
    descripcion:"Estética vintage con mecánica mínima: cero mantenimiento, máximo estilo.", reviews:{ promedio:4.6, total:47 } },

  { id:"urb-004", nombre:"Trek FX 2 Disc", categoria:"urbana", marca:"Trek", precio:2900000, precioAnterior:null, stock:8, popularidad:87, fecha:"2026-01-25", badge:"", imagen:IMG+"7c3569782-1f9f-49fd-a96f-cf9d7962e9607381.png",
    colores:["#F8F9FA","#1A1A2E"], nombresColores:["Blanco","Negro"], stockPorColor:[4,4], tallas:["S","M","L","XL"],
    specs:{ cuadro:"Aluminio Alpha Gold", suspension:"Rígida", velocidades:"1x9 (9 velocidades)", frenos:"Disco hidráulico", rueda:"700c", peso:"11.9 kg", componentes:"Shimano Alivio M3100", horquilla:"Aluminio con anclaje rack", cargaMax:"135 kg" },
    descripcion:"Híbrida ligera para commute rápido y ejercicio: la más versátil de la línea FX.", reviews:{ promedio:4.8, total:95 } },

  /* ---------- ELÉCTRICA ---------- */
  { id:"ele-001", nombre:"Veloce E-Power Urban", categoria:"eléctrica", marca:"Veloce", precio:6500000, precioAnterior:null, stock:6, popularidad:92, fecha:"2026-05-05", badge:"Más Vendida", imagen:IMG+"3c3569782-1f9f-49fd-a96f-cf9d7962e9607739.png",
    colores:["#1A1A2E","#FF5722"], nombresColores:["Negro","Naranja"], stockPorColor:[4,2], tallas:["M","L"],
    specs:{ cuadro:"Aluminio 6061 batería integrada", suspension:"Rígida", velocidades:"1x8 (8 velocidades)", frenos:"Disco hidráulico", rueda:"700c", peso:"21.0 kg", componentes:"Motor Bafang 250W · Batería 468 Wh", horquilla:"Aluminio", cargaMax:"120 kg", motor:"250 W (asistencia hasta 25 km/h)", autonomia:"80 km por carga" },
    descripcion:"Llega al trabajo sin sudar: asistencia inteligente y batería extraíble para cargar en casa.", reviews:{ promedio:4.7, total:73 } },

  { id:"ele-002", nombre:"Trek Verve+ 2", categoria:"eléctrica", marca:"Trek", precio:9200000, precioAnterior:null, stock:5, popularidad:80, fecha:"2025-11-08", badge:"", imagen:IMG+"0c3569782-1f9f-49fd-a96f-cf9d7962e9601948.png",
    colores:["#6C757D","#2A9D8F"], nombresColores:["Gris","Verde"], stockPorColor:[3,2], tallas:["S","M","L"],
    specs:{ cuadro:"Aluminio hidroformado", suspension:"Rígida", velocidades:"1x9 (9 velocidades)", frenos:"Disco hidráulico", rueda:"700c", peso:"22.4 kg", componentes:"Bosch Active Line Plus · Batería 400 Wh", horquilla:"Aluminio", cargaMax:"136 kg", motor:"Bosch 250 W (50 Nm)", autonomia:"90 km por carga" },
    descripcion:"Confort total con motor Bosch: postura erguida y asistencia suave para toda la familia.", reviews:{ promedio:4.6, total:38 } },

  { id:"ele-003", nombre:"Specialized Turbo Vado 4.0", categoria:"eléctrica", marca:"Specialized", precio:12500000, precioAnterior:null, stock:2, popularidad:77, fecha:"2026-08-01", badge:"Últimas unidades", imagen:IMG+"2c3569782-1f9f-49fd-a96f-cf9d7962e9604651.png",
    colores:["#2A9D8F","#1A1A2E"], nombresColores:["Verde","Negro"], stockPorColor:[1,1], tallas:["S","M","L"],
    specs:{ cuadro:"Aluminio E5", suspension:"Delantera 80 mm", velocidades:"1x11 (11 velocidades)", frenos:"Disco hidráulico 180 mm", rueda:'27.5" (650b)', peso:"23.0 kg", componentes:"Specialized 2.0 · Batería 500 Wh", horquilla:"SR Suntour MOBIE", cargaMax:"140 kg", motor:"Specialized 2.0 (70 Nm)", autonomia:"100 km por carga" },
    descripcion:"La e-bike urbana definitiva: potencia de sobra para cuestas empinadas con carga completa.", reviews:{ promedio:4.9, total:22 } },

  /* ---------- BMX ---------- */
  { id:"bmx-001", nombre:"Veloce Street King 20", categoria:"bmx", marca:"Veloce", precio:980000, precioAnterior:null, stock:18, popularidad:72, fecha:"2025-07-22", badge:"", imagen:IMG+"1c3569782-1f9f-49fd-a96f-cf9d7962e9601054.png",
    colores:["#1A1A2E","#FF5722"], nombresColores:["Negro","Naranja"], stockPorColor:[10,8], tallas:["Única"],
    specs:{ cuadro:"Acero Cr-Mo 4130", suspension:"Rígida", velocidades:"1 velocidad", frenos:"U-Brake", rueda:'20"', peso:"11.5 kg", componentes:"Rodamientos sellados", horquilla:"Cr-Mo rígida", cargaMax:"100 kg" },
    descripcion:"Geometría de street para parques y rampas: resistente a impactos y trucos diarios.", reviews:{ promedio:4.5, total:88 } },

  { id:"bmx-002", nombre:"GW Freestyle Pro", categoria:"bmx", marca:"GW", precio:1150000, precioAnterior:null, stock:12, popularidad:68, fecha:"2026-02-27", badge:"Novedad", imagen:IMG+"5c3569782-1f9f-49fd-a96f-cf9d7962e9604705.png",
    colores:["#2A9D8F","#1A1A2E"], nombresColores:["Verde","Negro"], stockPorColor:[7,5], tallas:["Única"],
    specs:{ cuadro:"Cr-Mo 4130 doble pared", suspension:"Rígida", velocidades:"1 velocidad", frenos:"U-Brake", rueda:'20"', peso:"11.0 kg", componentes:"Rodamientos sellados + pegs incluidos", horquilla:"Cr-Mo cónica", cargaMax:"100 kg" },
    descripcion:"Freestyle de serie con pegs: lista para moler barandas y bordes desde el primer día.", reviews:{ promedio:4.6, total:41 } },

  /* ---------- INFANTIL ---------- */
  { id:"inf-001", nombre:"Veloce Kids Explorer 16", categoria:"infantil", marca:"Veloce", precio:620000, precioAnterior:null, stock:22, popularidad:83, fecha:"2025-06-30", badge:"Más Vendida", imagen:IMG+"0c3569782-1f9f-49fd-a96f-cf9d7962e9608494.png",
    colores:["#E63946","#0EA5E9"], nombresColores:["Rojo","Azul"], stockPorColor:[12,10], tallas:["Única"],
    specs:{ cuadro:"Aluminio infantil", suspension:"Rígida", velocidades:"1 velocidad + contrapedal", frenos:"V-Brake + contrapedal", rueda:'16"', peso:"8.5 kg", componentes:"Ruedas entrenadoras incluidas", horquilla:"Aluminio", cargaMax:"40 kg" },
    descripcion:"Primera bici de verdad: ultraligera, con rueditas entrenadoras y frenos fáciles de alcanzar.", reviews:{ promedio:4.8, total:132 } },

  { id:"inf-002", nombre:"Oxford Junior 20", categoria:"infantil", marca:"Oxford", precio:780000, precioAnterior:890000, stock:16, popularidad:75, fecha:"2026-03-30", badge:"Oferta", imagen:IMG+"4c3569782-1f9f-49fd-a96f-cf9d7962e9609131.png",
    colores:["#E63946","#1A1A2E"], nombresColores:["Rojo","Negro"], stockPorColor:[9,7], tallas:["Única"],
    specs:{ cuadro:"Aluminio junior", suspension:"Rígida", velocidades:"1x6 (6 velocidades)", frenos:"V-Brake", rueda:'20"', peso:"10.2 kg", componentes:"Shimano Tourney TY21", horquilla:"Aluminio", cargaMax:"50 kg" },
    descripcion:"Para niños de 6 a 9 años que ya dominan el pedaleo: cambios reales y frenos de palanca.", reviews:{ promedio:4.6, total:76 } },

  /* ---------- ACCESORIOS: CASCOS (4) ---------- */
  { id:"acc-001", nombre:"Casco Veloce Pro MIPS", categoria:"accesorios", subcategoria:"cascos", marca:"Veloce", precio:285000, precioAnterior:null, stock:15, popularidad:95, fecha:"2026-01-15", badge:"Más Vendida", imagen:PH+"1A1A2E/FF4D00?text=Casco+Pro+MIPS",
    colores:["#1A1A2E","#E63946"], nombresColores:["Negro","Rojo"], stockPorColor:[8,7], tallas:["S","M","L"],
    specs:{ talla:"S: 51-57 cm, M: 55-59 cm, L: 59-63 cm", peso:"285 g", certificacion:"CPSC, CE", ventilacion:"18 ventilaciones" },
    descripcion:"Casco con tecnología MIPS para máxima protección en caídas. Ventilación superior y rueda de ajuste milimétrico.", reviews:{ promedio:4.8, total:94 } },

  { id:"acc-002", nombre:"Casco Urbano Retro LED", categoria:"accesorios", subcategoria:"cascos", marca:"Veloce", precio:165000, precioAnterior:null, stock:20, popularidad:82, fecha:"2026-03-02", badge:"", imagen:PH+"1A1A2E/FF4D00?text=Casco+Urbano+Retro",
    colores:["#722F37","#1A1A2E"], nombresColores:["Vino tinto","Negro"], stockPorColor:[10,10], tallas:["M","L"],
    specs:{ talla:"M: 54-58 cm, L: 58-62 cm", peso:"340 g", extra:"Luz trasera LED integrada", certificacion:"CE" },
    descripcion:"Estética vintage con luz LED trasera integrada para rodar seguro en la ciudad de noche.", reviews:{ promedio:4.5, total:61 } },

  { id:"acc-003", nombre:"Casco Ruta Aero Carbon", categoria:"accesorios", subcategoria:"cascos", marca:"Specialized", precio:520000, precioAnterior:null, stock:8, popularidad:78, fecha:"2026-05-11", badge:"Novedad", imagen:PH+"1A1A2E/FF4D00?text=Casco+Aero+Carbon",
    colores:["#F8F9FA","#1A1A2E"], nombresColores:["Blanco","Negro"], stockPorColor:[4,4], tallas:["S","M","L"],
    specs:{ talla:"S: 51-55 cm, M: 55-59 cm, L: 59-63 cm", peso:"230 g", certificacion:"CPSC, CE", ventilacion:"14 ventilaciones aero" },
    descripcion:"Aerodinámica de contrarreloj con refuerzos internos de carbono: el casco de los escapistas.", reviews:{ promedio:4.9, total:27 } },

  { id:"acc-004", nombre:"Casco Infantil Explorers", categoria:"accesorios", subcategoria:"cascos", marca:"Veloce", precio:98000, precioAnterior:120000, stock:25, popularidad:86, fecha:"2025-11-19", badge:"Oferta", imagen:PH+"1A1A2E/FF4D00?text=Casco+Infantil",
    colores:["#E63946","#0EA5E9"], nombresColores:["Rojo","Azul"], stockPorColor:[13,12], tallas:["Única"],
    specs:{ talla:"48-52 cm (4-8 años)", peso:"240 g", certificacion:"CE", extra:"Visera desmontable y red anti-insectos" },
    descripcion:"Protección ligera y divertida para los primeros pedaleos, con visera y ajuste de ruleta fácil.", reviews:{ promedio:4.7, total:118 } },

  /* ---------- ACCESORIOS: GUANTES (3) ---------- */
  { id:"acc-005", nombre:"Guantes Veloce Gel", categoria:"accesorios", subcategoria:"guantes", marca:"Veloce", precio:65000, precioAnterior:null, stock:30, popularidad:88, fecha:"2026-02-20", badge:"", imagen:PH+"2A9D8F/FFFFFF?text=Guantes+Gel",
    colores:["#1A1A2E","#2A9D8F"], nombresColores:["Negro","Verde"], stockPorColor:[18,12], tallas:["S","M","L","XL"],
    specs:{ material:"Lycra transpirable", palmilla:"Gel antiderrapante", cierre:"Velcro ajustable", lavado:"A mano" },
    descripcion:"Palmilla de gel que absorbe vibraciones en rodadas largas; dorso transpirable y secado rápido.", reviews:{ promedio:4.6, total:67 } },

  { id:"acc-006", nombre:"Guantes Largos Invierno", categoria:"accesorios", subcategoria:"guantes", marca:"Veloce", precio:89000, precioAnterior:null, stock:18, popularidad:74, fecha:"2025-10-05", badge:"", imagen:PH+"2A9D8F/FFFFFF?text=Guantes+Invierno",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[18], tallas:["S","M","L","XL"],
    specs:{ material:"Softshell cortaviento", interior:"Forro polar térmico", extra:"Índice táctil para pantalla", impermeabilidad:"Resistente a llovizna" },
    descripcion:"Manos calientes y secas en climas fríos: cortaviento, forro polar y punta táctil para el celular.", reviews:{ promedio:4.4, total:39 } },

  { id:"acc-007", nombre:"Guantes MTB Pro Grip", categoria:"accesorios", subcategoria:"guantes", marca:"Specialized", precio:78000, precioAnterior:null, stock:22, popularidad:80, fecha:"2026-04-14", badge:"", imagen:PH+"2A9D8F/FFFFFF?text=Guantes+MTB+Pro",
    colores:["#FF5722","#1A1A2E"], nombresColores:["Naranja","Negro"], stockPorColor:[12,10], tallas:["S","M","L","XL"],
    specs:{ material:"Poliéster reforzado", proteccion:"Nudillos con espuma TPR", palma:"Silicona antideslizante", cierre:"Velcro" },
    descripcion:"Agarre total en manubrio con protección de nudillos para senderos técnicos y enduro.", reviews:{ promedio:4.6, total:52 } },

  /* ---------- ACCESORIOS: ROPA (5) ---------- */
  { id:"acc-008", nombre:"Jersey Ruta Aero 2026", categoria:"accesorios", subcategoria:"ropa", marca:"Veloce", precio:145000, precioAnterior:null, stock:16, popularidad:84, fecha:"2026-06-01", badge:"Novedad", imagen:PH+"E63946/FFFFFF?text=Jersey+Ruta+Aero",
    colores:["#E63946","#1A1A2E","#F8F9FA"], nombresColores:["Rojo","Negro","Blanco"], stockPorColor:[6,5,5], tallas:["S","M","L","XL"],
    specs:{ material:"Poliéster técnico transpirable", bolsillos:"3 traseros + 1 con cierre", proteccion:"UPF 50+", cierre:"YKK completo" },
    descripcion:"Corte aero, tela que expulsa el sudor y tres bolsillos traseros: el jersey de tus rodadas de domingo.", reviews:{ promedio:4.7, total:45 } },

  { id:"acc-009", nombre:"Badana Corta con Tirantes", categoria:"accesorios", subcategoria:"ropa", marca:"Specialized", precio:185000, precioAnterior:null, stock:12, popularidad:79, fecha:"2026-02-08", badge:"", imagen:PH+"E63946/FFFFFF?text=Badana+Corta",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[12], tallas:["S","M","L","XL"],
    specs:{ material:"Lycra compresiva", badana:"Densidad dual 8 horas", costuras:"Planas anti-roce", tirantes:"Malla transpirable" },
    descripcion:"Comodidad de 8 horas sobre el sillín: compresión muscular y badana de densidad dual.", reviews:{ promedio:4.6, total:38 } },

  { id:"acc-010", nombre:"Chaqueta Impermeable Packable", categoria:"accesorios", subcategoria:"ropa", marca:"Trek", precio:265000, precioAnterior:null, stock:10, popularidad:76, fecha:"2025-09-25", badge:"", imagen:PH+"E63946/FFFFFF?text=Chaqueta+Impermeable",
    colores:["#FFB020","#1A1A2E"], nombresColores:["Amarillo","Negro"], stockPorColor:[6,4], tallas:["S","M","L","XL"],
    specs:{ material:"Nylon ripstop 2.5 capas", columna:"10.000 mm", peso:"180 g", extra:"Se guarda en su propio bolsillo" },
    descripcion:"Cabe en un bolsillo y aguanta aguaceros: costuras selladas y espalda con ventilación.", reviews:{ promedio:4.5, total:29 } },

  { id:"acc-011", nombre:"Medias Compresión Ciclismo", categoria:"accesorios", subcategoria:"ropa", marca:"Veloce", precio:45000, precioAnterior:null, stock:40, popularidad:71, fecha:"2026-01-30", badge:"", imagen:PH+"E63946/FFFFFF?text=Medias+Compresion",
    colores:["#F8F9FA","#1A1A2E","#E63946"], nombresColores:["Blanco","Negro","Rojo"], stockPorColor:[16,12,12], tallas:["S/M","L/XL"],
    specs:{ material:"Nylon compresivo", altura:"Media caña", extra:"Zona de arco reforzada", lavado:"Máquina suave" },
    descripcion:"Compresión graduada que reduce fatiga en gemelos y le da estilo pro a tu pinta.", reviews:{ promedio:4.4, total:57 } },

  { id:"acc-012", nombre:"Pantaloneta MTB con Badana", categoria:"accesorios", subcategoria:"ropa", marca:"GW", precio:165000, precioAnterior:null, stock:14, popularidad:77, fecha:"2026-03-22", badge:"", imagen:PH+"E63946/FFFFFF?text=Pantaloneta+MTB",
    colores:["#1A1A2E","#6C757D"], nombresColores:["Negro","Gris"], stockPorColor:[8,6], tallas:["S","M","L","XL"],
    specs:{ material:"Poliéster 4-way stretch", badana:"Incluida desmontable", bolsillos:"2 laterales con cierre", cintura:"Elástica con velcro" },
    descripcion:"Libertad de movimiento en el sendero con badana interna y bolsillos que no saltan.", reviews:{ promedio:4.5, total:33 } },

  /* ---------- ACCESORIOS: ILUMINACIÓN (4) ---------- */
  { id:"acc-013", nombre:"Set Luces LED USB", categoria:"accesorios", subcategoria:"iluminacion", marca:"Veloce", precio:125000, precioAnterior:145000, stock:25, popularidad:92, fecha:"2026-03-10", badge:"Oferta", imagen:PH+"FFB020/1A1A2E?text=Set+Luces+LED",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[25], tallas:["Única"],
    specs:{ luminosidad:"400 lúmenes (delantera)", autonomia:"8 horas", carga:"USB recargable", resistencia:"IPX4" },
    descripcion:"Set delantero y trasero recargable por USB con soportes universales sin herramientas.", reviews:{ promedio:4.7, total:83 } },

  { id:"acc-014", nombre:"Faro Delantero 1000 Lúmenes", categoria:"accesorios", subcategoria:"iluminacion", marca:"Veloce", precio:198000, precioAnterior:null, stock:12, popularidad:81, fecha:"2026-05-28", badge:"", imagen:PH+"FFB020/1A1A2E?text=Faro+1000+Lumenes",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[12], tallas:["Única"],
    specs:{ luminosidad:"1000 lúmenes", autonomia:"4 h en modo alto", modos:"5 (incluye intermitente)", montaje:"Manubrio 22-35 mm" },
    descripcion:"Ilumina trochas oscuras como de día: haz amplio con corte anti-encandilamiento.", reviews:{ promedio:4.8, total:44 } },

  { id:"acc-015", nombre:"Luz Trasera Smart Freno", categoria:"accesorios", subcategoria:"iluminacion", marca:"Specialized", precio:85000, precioAnterior:null, stock:28, popularidad:85, fecha:"2026-04-20", badge:"", imagen:PH+"FFB020/1A1A2E?text=Luz+Trasera+Smart",
    colores:["#E63946"], nombresColores:["Rojo"], stockPorColor:[28], tallas:["Única"],
    specs:{ luminosidad:"80 lúmenes", sensor:"Acelerómetro de freno", autonomia:"12 horas", carga:"USB-C" },
    descripcion:"Brilla más fuerte cuando detecta que estás frenando: seguridad inteligente desde atrás.", reviews:{ promedio:4.7, total:66 } },

  { id:"acc-016", nombre:"Kit Luces + Reflectivos", categoria:"accesorios", subcategoria:"iluminacion", marca:"GW", precio:155000, precioAnterior:null, stock:18, popularidad:73, fecha:"2025-12-12", badge:"", imagen:PH+"FFB020/1A1A2E?text=Kit+Reflectivos",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[18], tallas:["Única"],
    specs:{ incluye:"2 luces + 4 rayos reflectivos + 2 tobilleras", luminosidad:"250 lúmenes", carga:"USB", resistencia:"IPX4" },
    descripcion:"Visibilidad 360° para el commute urbano: luces y reflectivos en un solo kit.", reviews:{ promedio:4.4, total:41 } },

  /* ---------- ACCESORIOS: SEGURIDAD (3) ---------- */
  { id:"acc-017", nombre:"Candado U-Lock con Cable", categoria:"accesorios", subcategoria:"seguridad", marca:"Veloce", precio:95000, precioAnterior:null, stock:20, popularidad:85, fecha:"2026-01-25", badge:"", imagen:PH+"0B1220/FFB020?text=Candado+U-Lock",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[20], tallas:["Única"],
    specs:{ material:"Acero endurecido 13 mm", longitud:"Cable 1.2 m", llaves:"3 incluidas", soporte:"De marco incluido" },
    descripcion:"U de acero endurecido más cable extensible: asegura cuadro y rueda en un solo gesto.", reviews:{ promedio:4.5, total:56 } },

  { id:"acc-018", nombre:"Candado Cadena Reforzada 1.5 m", categoria:"accesorios", subcategoria:"seguridad", marca:"Trek", precio:125000, precioAnterior:null, stock:15, popularidad:72, fecha:"2025-11-02", badge:"", imagen:PH+"0B1220/FFB020?text=Cadena+Reforzada",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[15], tallas:["Única"],
    specs:{ material:"Eslabones 8 mm acero", longitud:"1.5 m", funda:"Tela anti-rayas", llaves:"2 + cilindro anti-ganzúa" },
    descripcion:"Largo suficiente para poste grueso: eslabones de 8 mm con cilindro de seguridad.", reviews:{ promedio:4.4, total:37 } },

  { id:"acc-019", nombre:"Chaleco Reflectivo Certificado", categoria:"accesorios", subcategoria:"seguridad", marca:"Veloce", precio:58000, precioAnterior:null, stock:35, popularidad:69, fecha:"2026-02-14", badge:"", imagen:PH+"0B1220/FFB020?text=Chaleco+Reflectivo",
    colores:["#FFB020"], nombresColores:["Amarillo"], stockPorColor:[35], tallas:["S/M","L/XL"],
    specs:{ norma:"EN 471 clase 2", material:"Poliéster con bandas reflectivas", ajuste:"Elástico lateral", extra:"Bolsillo interno" },
    descripcion:"Hazte visible a 150 metros: obligatorio para rodar de noche en vía urbana.", reviews:{ promedio:4.3, total:48 } },

  /* ---------- ACCESORIOS: HIDRATACIÓN (3) ---------- */
  { id:"acc-020", nombre:"Mochila Hidratación 2L", categoria:"accesorios", subcategoria:"hidratacion", marca:"CamelBak", precio:185000, precioAnterior:null, stock:12, popularidad:79, fecha:"2026-04-05", badge:"Novedad", imagen:PH+"0EA5E9/FFFFFF?text=Mochila+Hidratacion",
    colores:["#1A1A2E","#E63946","#2A9D8F"], nombresColores:["Negro","Rojo","Verde"], stockPorColor:[5,4,3], tallas:["Única"],
    specs:{ capacidad:"Reservoir 2 L", peso:"320 g vacía", bolsillos:"3 compartimentos", extra:"Porta-herramientas integrado" },
    descripcion:"Bebe sin detenerte: manguera con válvula mordible y espacio para herramienta y snacks.", reviews:{ promedio:4.6, total:41 } },

  { id:"acc-021", nombre:"Botella Térmica 620 ml", categoria:"accesorios", subcategoria:"hidratacion", marca:"Veloce", precio:42000, precioAnterior:null, stock:45, popularidad:75, fecha:"2025-10-18", badge:"", imagen:PH+"0EA5E9/FFFFFF?text=Botella+Termica",
    colores:["#0EA5E9","#1A1A2E","#F8F9FA"], nombresColores:["Azul","Negro","Blanco"], stockPorColor:[15,15,15], tallas:["Única"],
    specs:{ capacidad:"620 ml", aislamiento:"Mantiene frío 4 h", material:"Libre de BPA", tapa:"Boquilla de alto flujo" },
    descripcion:"Agua fría hasta el final de la rodada: doble pared y boquilla que no gotea.", reviews:{ promedio:4.5, total:72 } },

  { id:"acc-022", nombre:"Portabotellas Aluminio CNC", categoria:"accesorios", subcategoria:"hidratacion", marca:"GW", precio:35000, precioAnterior:null, stock:50, popularidad:66, fecha:"2025-08-08", badge:"", imagen:PH+"0EA5E9/FFFFFF?text=Portabotellas+CNC",
    colores:["#1A1A2E","#E63946"], nombresColores:["Negro","Rojo"], stockPorColor:[30,20], tallas:["Única"],
    specs:{ material:"Aluminio 6061 CNC", peso:"48 g", tornilleria:"Incluida", compatibilidad:"Cuadros con 2 orificios" },
    descripcion:"Sujeción firme incluso en trocha: aluminio ligero con agarre antideslizante.", reviews:{ promedio:4.3, total:51 } },

  /* ---------- ACCESORIOS: HERRAMIENTAS (4) ---------- */
  { id:"acc-023", nombre:"Multifunción 16-en-1", categoria:"accesorios", subcategoria:"herramientas", marca:"Park Tool", precio:78000, precioAnterior:null, stock:18, popularidad:81, fecha:"2026-02-15", badge:"", imagen:PH+"6C757D/FFFFFF?text=Multifuncion+16en1",
    colores:["#2A9D8F"], nombresColores:["Verde"], stockPorColor:[18], tallas:["Única"],
    specs:{ herramientas:"16 funciones", peso:"145 g", material:"Acero cromado", incluye:"Allen 2-8 mm, Torx, destornilladores" },
    descripcion:"El taller en tu bolsillo: todo lo necesario para ajustes de emergencia en la vía.", reviews:{ promedio:4.7, total:52 } },

  { id:"acc-024", nombre:"Bomba de Piso con Manómetro", categoria:"accesorios", subcategoria:"herramientas", marca:"Veloce", precio:115000, precioAnterior:null, stock:14, popularidad:78, fecha:"2025-12-05", badge:"", imagen:PH+"6C757D/FFFFFF?text=Bomba+de+Piso",
    colores:["#1A1A2E","#E63946"], nombresColores:["Negro","Rojo"], stockPorColor:[8,6], tallas:["Única"],
    specs:{ presion:"Hasta 160 psi", manometro:"Analógico 2.5\"", cabezal:"Presta y Schrader", base:"Acero antideslizante" },
    descripcion:"Infla preciso y rápido: manómetro grande y cabezal doble para cualquier válvula.", reviews:{ promedio:4.6, total:46 } },

  { id:"acc-025", nombre:"Kit Parches + Palancas", categoria:"accesorios", subcategoria:"herramientas", marca:"Park Tool", precio:28000, precioAnterior:null, stock:60, popularidad:70, fecha:"2025-07-14", badge:"", imagen:PH+"6C757D/FFFFFF?text=Kit+Parches",
    colores:["#FFB020"], nombresColores:["Amarillo"], stockPorColor:[60], tallas:["Única"],
    specs:{ incluye:"6 parches, lija, 3 palancas, estuche", peso:"65 g", montaje:"Sin pegamento (autoadhesivos)", extra:"Estuche bajo sillín" },
    descripcion:"Repara un pinchazo en 5 minutos: cabe debajo del sillín y no necesita pegamento.", reviews:{ promedio:4.4, total:89 } },

  { id:"acc-026", nombre:"Mini Bomba CO2 + Cartuchos", categoria:"accesorios", subcategoria:"herramientas", marca:"Specialized", precio:92000, precioAnterior:null, stock:20, popularidad:74, fecha:"2026-06-10", badge:"", imagen:PH+"6C757D/FFFFFF?text=Bomba+CO2",
    colores:["#1A1A2E"], nombresColores:["Negro"], stockPorColor:[20], tallas:["Única"],
    specs:{ incluye:"Inflador + 2 cartuchos 16 g", peso:"95 g con cartucho", cabezal:"Presta y Schrader", extra:"Soporte de marco" },
    descripcion:"Infla una llanta en 10 segundos: el seguro de velocidad para rodadas largas.", reviews:{ promedio:4.5, total:35 } },

  /* ---------- ACCESORIOS: COMPONENTES (4) ---------- */
  { id:"acc-027", nombre:"Cadena Shimano CN-HG54 10v", categoria:"accesorios", subcategoria:"componentes", marca:"Shimano", precio:88000, precioAnterior:null, stock:24, popularidad:76, fecha:"2025-09-15", badge:"", imagen:PH+"722F37/FFFFFF?text=Cadena+Shimano",
    colores:["#6C757D"], nombresColores:["Gris"], stockPorColor:[24], tallas:["Única"],
    specs:{ velocidades:"10 velocidades", eslabones:"116 con cierre rápido", tratamiento:"Cromado anti-corrosión", compatibilidad:"HG-X 10v" },
    descripcion:"Cambios suaves y duraderos: cadena original Shimano con cierre rápido incluido.", reviews:{ promedio:4.7, total:63 } },

  { id:"acc-028", nombre:"Cassette 9V 11-34", categoria:"accesorios", subcategoria:"componentes", marca:"Shimano", precio:105000, precioAnterior:null, stock:16, popularidad:72, fecha:"2026-01-08", badge:"", imagen:PH+"722F37/FFFFFF?text=Cassette+9V",
    colores:["#6C757D"], nombresColores:["Gris"], stockPorColor:[16], tallas:["Única"],
    specs:{ velocidades:"9 velocidades", rango:"11-34 dientes", material:"Acero niquelado", compatibilidad:"Núcleo HG estándar" },
    descripcion:"Rango amplio para subir cualquier cuesta: piñones niquelados de larga vida.", reviews:{ promedio:4.6, total:42 } },

  { id:"acc-029", nombre:"Pedales Plataforma Aluminio", categoria:"accesorios", subcategoria:"componentes", marca:"GW", precio:72000, precioAnterior:null, stock:26, popularidad:73, fecha:"2025-11-25", badge:"", imagen:PH+"722F37/FFFFFF?text=Pedales+Plataforma",
    colores:["#1A1A2E","#E63946"], nombresColores:["Negro","Rojo"], stockPorColor:[16,10], tallas:["Única"],
    specs:{ material:"Aluminio con pines", rodamientos:"Sellados", peso:"380 g el par", rosca:"9/16 estándar" },
    descripcion:"Plataforma ancha con pines que no sueltan tu zapato ni en barro.", reviews:{ promedio:4.5, total:58 } },

  { id:"acc-030", nombre:"Sillín Gel Confort Urbano", categoria:"accesorios", subcategoria:"componentes", marca:"Veloce", precio:96000, precioAnterior:null, stock:22, popularidad:80, fecha:"2026-02-25", badge:"Más Vendida", imagen:PH+"722F37/FFFFFF?text=Sillin+Gel",
    colores:["#1A1A2E","#722F37"], nombresColores:["Negro","Vino tinto"], stockPorColor:[14,8], tallas:["Única"],
    specs:{ material:"Gel + espuma de alta densidad", riel:"Acero universal", ancho:"24 cm", extra:"Canal central de alivio" },
    descripcion:"Dile adiós al dolor urbano: gel ancho con canal de alivio y riel universal.", reviews:{ promedio:4.6, total:97 } }
];

/* ========= FOTOS REALES DE ACCESORIOS (remotas, sin descargar) ========= */
const FOTOS_REALES = {
  "acc-001": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f5231.png",
  "acc-002": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f9798.png",
  "acc-003": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/541e31e99-324a-4a79-9598-51761e42764f7316.png",
  "acc-004": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f7365.png",
  "acc-005": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/441e31e99-324a-4a79-9598-51761e42764f8841.png",
  "acc-006": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/441e31e99-324a-4a79-9598-51761e42764f9890.png",
  "acc-007": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f1510.png",
  "acc-008": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/841e31e99-324a-4a79-9598-51761e42764f1182.png",
  "acc-009": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/341e31e99-324a-4a79-9598-51761e42764f2675.png",
  "acc-010": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f2545.png",
  "acc-011": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/141e31e99-324a-4a79-9598-51761e42764f9673.png",
  "acc-012": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f5544.png",
  "acc-013": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/441e31e99-324a-4a79-9598-51761e42764f1059.png",
  "acc-014": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/341e31e99-324a-4a79-9598-51761e42764f9955.png",
  "acc-015": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/541e31e99-324a-4a79-9598-51761e42764f9225.png",
  "acc-016": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/241e31e99-324a-4a79-9598-51761e42764f3010.png",
  "acc-017": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/241e31e99-324a-4a79-9598-51761e42764f7038.png",
  "acc-018": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/541e31e99-324a-4a79-9598-51761e42764f1190.png",
  "acc-019": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/341e31e99-324a-4a79-9598-51761e42764f7614.png",
  "acc-020": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/441e31e99-324a-4a79-9598-51761e42764f5519.png",
  "acc-021": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/141e31e99-324a-4a79-9598-51761e42764f2461.png",
  "acc-022": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f9266.png",
  "acc-023": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f6207.png",
  "acc-024": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f2742.png",
  "acc-025": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f7193.png",
  "acc-026": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/241e31e99-324a-4a79-9598-51761e42764f4320.png",
  "acc-027": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/641e31e99-324a-4a79-9598-51761e42764f6461.png",
  "acc-028": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/741e31e99-324a-4a79-9598-51761e42764f9772.png",
  "acc-029": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/041e31e99-324a-4a79-9598-51761e42764f6955.png",
  "acc-030": "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/441e31e99-324a-4a79-9598-51761e42764f6563.png"
};

/* Aplica las fotos al catálogo en memoria */
productos.forEach(p => { if (FOTOS_REALES[p.id]) p.imagen = FOTOS_REALES[p.id]; });

/* Sincroniza también la copia guardada en localStorage para que no
   queden las imágenes viejas (evita tener que limpiar el navegador) */
try {
  const guardados = JSON.parse(localStorage.getItem("veloce_products"));
  if (guardados) {
    guardados.forEach(p => { if (FOTOS_REALES[p.id]) p.imagen = FOTOS_REALES[p.id]; });
    localStorage.setItem("veloce_products", JSON.stringify(guardados));
  }
} catch (e) { /* si falla, no importa: la próxima carga se corrige solo */ }

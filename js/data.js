/* ========= VELOCE BIKES - Catálogo (20 productos) ========= */
const IMG = "https://image.qwenlm.ai/public_source/c4e4968e-2348-4ce3-95ae-1397f6d95640/";

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
    descripcion:"Para niños de 6 a 9 años que ya dominan el pedaleo: cambios reales y frenos de palanca.", reviews:{ promedio:4.6, total:76 } }
];
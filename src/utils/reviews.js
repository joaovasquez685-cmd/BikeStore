const AUTORES = ["Carlos M.","Laura G.","Andrés P.","Mariana R.","Jorge C.","Camila T.","Felipe V.","Diana S.","Ricardo B.","Paula H.","Sergio L.","Valentina O."]
const FECHAS = ["08/09/2026","21/08/2026","02/07/2026","15/06/2026","28/04/2026","11/03/2026","19/01/2026","05/12/2025"]
const PLANTILLAS = {
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
}
const FRASE_SUB = {
  cascos:"El ajuste de ruleta queda firme y la ventilación se agradece en clima cálido.",
  guantes:"La palmilla amortigua muy bien las vibraciones del manubrio.",
  ropa:"El corte queda entallado sin apretar y la tela seca rápido.",
  iluminacion:"La potencia lumínica es real: manejo de noche totalmente tranquilo.",
  seguridad:"Se siente sólido al asegurar la bici en la calle o el trabajo.",
  hidratacion:"La válvula no gotea y se bebe sin soltar el manubrio.",
  herramientas:"Me salvó de un ajuste en plena rodada: indispensable en la mochila.",
  componentes:"La instalación fue directa y el funcionamiento es silencioso."
}
function hashStr(s){ let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
function rellenar(t, p){
  const s = p.specs || {}
  const n = 30 + (hashStr(p.id + "n") % 60)
  return t.replace(/\{nombre\}/g, p.nombre).replace(/\{marca\}/g, p.marca)
    .replace(/\{frenos\}/g, s.frenos || "sistema de frenos").replace(/\{velocidades\}/g, s.velocidades || "sus cambios")
    .replace(/\{suspension\}/g, s.suspension || "suspensión").replace(/\{rueda\}/g, s.rueda || "rueda")
    .replace(/\{peso\}/g, s.peso || "su peso").replace(/\{n\}/g, n)
}
/** Reseñas deterministas (ficticias, igual que el original). Futuro: GET /products/:id/reviews. */
export function generarResenas(p){
  const seed = hashStr(p.id)
  const pool = PLANTILLAS[p.categoria] || PLANTILLAS.accesorios
  const base = p.reviews?.promedio ?? 4.5
  const combos = base >= 4.7 ? [5,5,4] : base >= 4.4 ? [5,4,4] : [4,4,3]
  const extra = FRASE_SUB[p.subcategoria] || ""
  return [0, 1, 2].map(i => ({
    autor: AUTORES[(seed + i * 5) % AUTORES.length],
    fecha: FECHAS[(seed + i * 2) % FECHAS.length],
    rating: combos[(seed + i) % 3],
    texto: rellenar(pool[(seed + i * 3) % pool.length], p) + (i === 0 && extra ? " " + extra : "")
  }))
}

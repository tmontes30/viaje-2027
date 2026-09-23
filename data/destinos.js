// Catálogo de destinos, conexiones y plan sugerido.
// Clima: valores aproximados promedio (lluvia mm/mes, días de lluvia, temp. máx °C).
// rating: "good" | "ok" | "bad"

window.DESTINOS = [
  // ---------------- FILIPINAS ----------------
  {
    id: "manila", name: "Manila", country: "Filipinas", island: "luzon",
    lat: 14.5086, lng: 121.0194, gateway: 0, kind: "transito",
    nights: [1, 1],
    verdict: "Solo como escala para cortar el vuelo largo. No vale la pena quedarse más de 1 noche.",
    desc: "Puerta de entrada a Filipinas. Ideal para dormir cerca del aeropuerto (zona Newport/Pasay) y seguir viaje al día siguiente.",
    weather: {
      may: { rating: "ok", rain: 120, days: 9, temp: 34, note: "Muy caluroso, primeras tormentas de tarde." },
      jun: { rating: "bad", rain: 250, days: 17, temp: 33, note: "Empieza la temporada de lluvias." }
    },
    highlights: ["Dormir cerca del aeropuerto (NAIA)", "Si sobra tiempo: Intramuros y Binondo (comida china)"],
    zonas: ["Newport City / Pasay (5 min del aeropuerto)", "Makati / BGC si quieren salir a cenar"],
    lodging: [
      { name: "Hilton Manila (Newport)", level: "$$$", note: "Conectado a la terminal 3" },
      { name: "Belmont Hotel Manila", level: "$$", note: "Frente al aeropuerto" }
    ]
  },
  {
    id: "elnido", name: "El Nido", country: "Filipinas", island: "palawan",
    lat: 11.1956, lng: 119.4075, gateway: 3, kind: "base",
    nights: [4, 6],
    verdict: "Imprescindible. Lagunas turquesa entre acantilados de caliza. Vayan en la PRIMERA mitad de mayo, antes del monzón.",
    desc: "El paraíso de Palawan: archipiélago de Bacuit con lagunas escondidas, playas de arena blanca y atardeceres increíbles. El pueblo es chico y movido; para relax conviene dormir en Lio, Corong Corong o directamente en un resort en una isla.",
    weather: {
      may: { rating: "good", rain: 110, days: 8, temp: 32, note: "Seco y caluroso; alguna tormenta corta hacia fin de mes. Mar calmo." },
      jun: { rating: "ok", rain: 230, days: 16, temp: 31, note: "Llega el habagat (monzón SO): más lluvia, mar picado y algunos tours cancelados, sobre todo desde mediados de junio." }
    },
    highlights: [
      "Tour A (Big & Small Lagoon, Secret Lagoon) y Tour C (Hidden Beach, Matinloc Shrine)",
      "Tour privado en bangka para evitar multitudes (salir 7 am)",
      "Nacpan Beach: 4 km de arena casi vacía",
      "Atardecer en Las Cabañas Beach / Corong Corong",
      "Kayak en Big Lagoon temprano"
    ],
    zonas: ["Lio Beach (tranquilo, cerca del aeropuerto)", "Corong Corong (atardeceres, 10 min del pueblo)", "Resort en isla privada (Lagen, Pangulasian, Cauayan) para 2-3 noches de lujo"],
    lodging: [
      { name: "El Nido Resorts Pangulasian Island", level: "$$$$", note: "Isla privada, el más romántico" },
      { name: "El Nido Resorts Lagen Island", level: "$$$$", note: "Sobre una laguna, rodeado de selva" },
      { name: "Cauayan Island Resort", level: "$$$$", note: "Villas con pileta privada" },
      { name: "Hotel Covo (Lio)", level: "$$$", note: "Diseño, frente a Lio Beach" },
      { name: "Qi Palawan", level: "$$$", note: "Frente a Nacpan, muy tranquilo" }
    ]
  },
  {
    id: "coron", name: "Coron", country: "Filipinas", island: "busuanga",
    lat: 12.0058, lng: 120.2044, gateway: 3.5, kind: "opcional",
    nights: [2, 3],
    verdict: "Opcional. Espectacular (lagos y naufragios), pero es más de excursión. Si quieren más relax, mejor sumar noches en El Nido.",
    desc: "Al norte de El Nido, famoso por el lago Kayangan, el lago Barracuda y naufragios japoneses de la Segunda Guerra (ideal snorkel/buceo). El pueblo es feo; lo lindo está en el agua.",
    weather: {
      may: { rating: "good", rain: 140, days: 10, temp: 32, note: "Bueno, algo más de tormentas que El Nido." },
      jun: { rating: "ok", rain: 290, days: 18, temp: 31, note: "Monzón: el ferry desde El Nido puede cancelarse." }
    },
    highlights: ["Lago Kayangan (mirador icónico)", "Lago Barracuda", "Twin Lagoon", "Snorkel en naufragio Skeleton Wreck", "Aguas termales Maquinit al atardecer"],
    zonas: ["Resort en isla (Two Seasons, Busuanga Bay)", "Pueblo de Coron (práctico pero sin encanto)"],
    lodging: [
      { name: "Two Seasons Coron Island Resort", level: "$$$$", note: "Isla privada, todo incluido" },
      { name: "Busuanga Bay Lodge", level: "$$$", note: "Tranquilo, frente a la bahía" }
    ]
  },
  {
    id: "siargao", name: "Siargao", country: "Filipinas", island: "siargao",
    lat: 9.7870, lng: 126.1560, gateway: 3.5, kind: "extra",
    nights: [4, 5],
    verdict: "Alternativa si quieren otra isla filipina (palmeras, surf, onda relajada). Implica volver a Manila/Cebu; no prioritario.",
    desc: "Isla de palmeras y surf en el este de Filipinas. Ambiente relajado y joven, excursiones a islas (Daku, Naked, Guyam) y piscinas naturales.",
    weather: {
      may: { rating: "ok", rain: 150, days: 12, temp: 31, note: "Aceptable: este de Filipinas tiene otro patrón de lluvias." },
      jun: { rating: "ok", rain: 150, days: 12, temp: 31, note: "Similar a mayo." }
    },
    highlights: ["Tour a Daku, Naked y Guyam", "Magpupungko Rock Pools (con marea baja)", "Mirador de palmeras en moto"],
    zonas: ["General Luna / Cloud 9", "Pacifico (más aislado)"],
    lodging: [
      { name: "Nay Palad Hideaway", level: "$$$$", note: "Uno de los mejores de Asia" },
      { name: "Isla Cabana Resort", level: "$$$", note: "Frente al mar" }
    ]
  },

  // ---------------- INDONESIA · BALI ----------------
  {
    id: "ubud", name: "Ubud", country: "Indonesia", island: "bali",
    lat: -8.5069, lng: 115.2625, gateway: 1.5, kind: "base",
    nights: [3, 4],
    verdict: "Sí. El corazón cultural y verde de Bali. Una villa con pileta privada en la selva es EL momento luna de miel.",
    desc: "Selva, arrozales en terrazas, templos, spas y muy buena gastronomía. No tiene playa: es el contrapunto verde. Conviene dormir un poco afuera del centro (Sayan, Tegallalang) para tener vista a la selva.",
    weather: {
      may: { rating: "good", rain: 110, days: 8, temp: 29, note: "Estación seca; alguna lluvia corta. Noches frescas." },
      jun: { rating: "good", rain: 70, days: 6, temp: 28, note: "Seco y agradable." }
    },
    highlights: [
      "Arrozales de Tegallalang temprano (o Jatiluwih, patrimonio UNESCO, más tranquilo)",
      "Campuhan Ridge Walk al amanecer",
      "Templo de agua Tirta Empul",
      "Cascadas: Tibumana, Kanto Lampo, Tukad Cepung",
      "Masaje balinés para dos / flower bath",
      "Cena en Locavore NXT o Mozaic"
    ],
    zonas: ["Sayan / valle del río Ayung (villas top con vista)", "Tegallalang (arrozales)", "Centro de Ubud (caminable, más ruido)"],
    lodging: [
      { name: "Mandapa, a Ritz-Carlton Reserve", level: "$$$$", note: "Junto al río, lujo absoluto" },
      { name: "Viceroy Bali", level: "$$$$", note: "Villas con pileta sobre el valle" },
      { name: "Hanging Gardens of Bali", level: "$$$$", note: "La pileta infinita famosa" },
      { name: "Kamandalu Ubud", level: "$$$", note: "Villas con pileta, muy buen precio/calidad" },
      { name: "Alaya Resort Ubud", level: "$$", note: "Céntrico y lindo" }
    ]
  },
  {
    id: "sidemen", name: "Sidemen", country: "Indonesia", island: "bali",
    lat: -8.4833, lng: 115.4333, gateway: 2, kind: "extra",
    nights: [1, 2],
    verdict: "Joya escondida: arrozales sin turistas y vista al volcán Agung. Buena escala de 1-2 noches entre Ubud y el barco a Gili.",
    desc: "El Bali de hace 20 años: valle verde, pueblitos de tejido y cero tráfico. Queda de camino a Padangbai, de donde salen los barcos a Gili.",
    weather: {
      may: { rating: "good", rain: 110, days: 8, temp: 29, note: "Seco." },
      jun: { rating: "good", rain: 80, days: 6, temp: 28, note: "Seco." }
    },
    highlights: ["Caminata por los arrozales", "Templo Lempuyang (Puertas del Cielo) al amanecer", "Palacio de agua Tirta Gangga"],
    zonas: ["Valle de Sidemen"],
    lodging: [
      { name: "Samanvaya", level: "$$$", note: "Pileta infinita frente al valle" },
      { name: "Wapa di Ume Sidemen", level: "$$$", note: "Villas entre arrozales" }
    ]
  },
  {
    id: "amed", name: "Amed", country: "Indonesia", island: "bali",
    lat: -8.3480, lng: 115.6560, gateway: 3, kind: "extra",
    nights: [2, 3],
    verdict: "Opcional para snorkel y buceo tranquilo (naufragio USAT Liberty). Queda lejos y no suma mucho si ya van a Gili.",
    desc: "Costa este de Bali, playas de arena negra, pueblos de pescadores y excelente snorkel desde la orilla.",
    weather: {
      may: { rating: "good", rain: 50, days: 4, temp: 30, note: "La zona más seca de Bali." },
      jun: { rating: "good", rain: 30, days: 3, temp: 29, note: "Muy seco." }
    },
    highlights: ["Snorkel en Jemeluk Bay", "Naufragio USAT Liberty (Tulamben)", "Amanecer con el Agung de fondo"],
    zonas: ["Jemeluk", "Lipah"],
    lodging: [{ name: "Blue Earth Village", level: "$$", note: "Bungalows con vista" }]
  },
  {
    id: "canggu", name: "Canggu", country: "Indonesia", island: "bali",
    lat: -8.6478, lng: 115.1385, gateway: 0.8, kind: "extra",
    nights: [2, 3],
    verdict: "Opcional. Cafés, surf y nómades digitales: muy movido y con tráfico. No es lo más relajado para luna de miel.",
    desc: "Zona de moda en la costa oeste: cafés de especialidad, beach clubs, surf y atardeceres en la playa de Echo Beach o Batu Bolong.",
    weather: {
      may: { rating: "good", rain: 80, days: 6, temp: 30, note: "Seco." },
      jun: { rating: "good", rain: 50, days: 4, temp: 29, note: "Seco." }
    },
    highlights: ["Atardecer en Batu Bolong", "Templo Tanah Lot (20 min)", "Beach club La Brisa / The Lawn"],
    zonas: ["Berawa", "Batu Bolong"],
    lodging: [{ name: "COMO Uma Canggu", level: "$$$", note: "Frente al mar" }]
  },
  {
    id: "seminyak", name: "Seminyak", country: "Indonesia", island: "bali",
    lat: -8.6913, lng: 115.1682, gateway: 0.5, kind: "extra",
    nights: [2, 3],
    verdict: "Opcional. Más urbano: restaurantes, shopping y beach clubs. Cómodo para la última noche si el vuelo sale temprano.",
    desc: "Zona elegante de Bali con muchos restaurantes y boutiques. Playa amplia pero no la más linda.",
    weather: {
      may: { rating: "good", rain: 80, days: 6, temp: 30, note: "Seco." },
      jun: { rating: "good", rain: 50, days: 4, temp: 29, note: "Seco." }
    },
    highlights: ["Potato Head Beach Club", "Cena en Sarong o Merah Putih", "Atardecer en Ku De Ta"],
    zonas: ["Seminyak / Petitenget"],
    lodging: [{ name: "The Legian Seminyak", level: "$$$$", note: "Frente al mar" }]
  },
  {
    id: "uluwatu", name: "Uluwatu", country: "Indonesia", island: "bali",
    lat: -8.8291, lng: 115.0849, gateway: 0.6, kind: "base", endFriendly: true,
    nights: [3, 5],
    verdict: "Sí, como cierre. Los mejores resorts de acantilado, playas escondidas y atardeceres. A 30-45 min del aeropuerto.",
    desc: "Península de Bukit, al sur de Bali: acantilados sobre el océano, calas de arena blanca (Padang Padang, Bingin, Melasti), beach clubs y surf de primer nivel. El lugar ideal para terminar descansando.",
    weather: {
      may: { rating: "good", rain: 60, days: 5, temp: 30, note: "Seco y soleado." },
      jun: { rating: "good", rain: 40, days: 3, temp: 29, note: "Seco; buen oleaje para surf." }
    },
    highlights: [
      "Danza Kecak al atardecer en el templo de Uluwatu",
      "Playas Padang Padang, Bingin, Melasti y Nyang Nyang",
      "Beach clubs: Sundays, El Kabron, Single Fin",
      "Cena romántica en el acantilado",
      "Clase de surf juntos en Padang Padang"
    ],
    zonas: ["Uluwatu / Pecatu (acantilados)", "Bingin (más bohemio)", "Jimbaran (cenas de mariscos en la playa)"],
    lodging: [
      { name: "Six Senses Uluwatu", level: "$$$$", note: "Pileta infinita sobre el acantilado" },
      { name: "Alila Villas Uluwatu", level: "$$$$", note: "Villas con pileta privada" },
      { name: "Bulgari Resort Bali", level: "$$$$", note: "Lujo total" },
      { name: "Anantara Uluwatu", level: "$$$", note: "Vista al atardecer" },
      { name: "Uluwatu Surf Villas", level: "$$", note: "Villas sobre el acantilado" }
    ]
  },

  // ---------------- INDONESIA · NUSA ----------------
  {
    id: "lembongan", name: "Nusa Lembongan", country: "Indonesia", island: "nusa",
    lat: -8.6800, lng: 115.4500, gateway: 1.5, kind: "base",
    nights: [2, 3],
    verdict: "Sí. Base relajada para nadar con mantarrayas y hacer excursión de un día a Nusa Penida.",
    desc: "Isla chica frente a Bali: aguas cristalinas, manglares, el puente amarillo a Nusa Ceningan y el Devil's Tear. Mucho más tranquila que Penida para dormir.",
    weather: {
      may: { rating: "good", rain: 60, days: 5, temp: 30, note: "Seco; mar generalmente bueno." },
      jun: { rating: "good", rain: 40, days: 3, temp: 29, note: "Seco; algo más de viento." }
    },
    highlights: [
      "Snorkel con mantarrayas (Manta Point) + Crystal Bay",
      "Excursión de un día a Nusa Penida: Kelingking, Diamond Beach, Broken Beach",
      "Manglares en kayak o canoa",
      "Blue Lagoon en Nusa Ceningan",
      "Atardecer en Sunset Point / Devil's Tear"
    ],
    zonas: ["Jungutbatu (práctico)", "Mushroom Bay y Sandy Bay (más lindas y tranquilas)"],
    lodging: [
      { name: "Batu Karang Lembongan Resort", level: "$$$", note: "Solo adultos, vista al mar" },
      { name: "Lembongan Beach Club & Resort", level: "$$$", note: "Frente a la playa" },
      { name: "Coconuts Beach Resort", level: "$$", note: "Buen precio/calidad" }
    ]
  },
  {
    id: "penida", name: "Nusa Penida", country: "Indonesia", island: "nusa",
    lat: -8.7275, lng: 115.5444, gateway: 2, kind: "opcional",
    nights: [1, 2],
    verdict: "Mejor como excursión desde Lembongan. Dormir ahí tiene sentido solo si quieren fotos al amanecer sin gente.",
    desc: "La hermana grande y salvaje: los miradores más famosos de Bali (Kelingking T-Rex), pero caminos malos y trayectos largos.",
    weather: {
      may: { rating: "good", rain: 60, days: 5, temp: 30, note: "Seco." },
      jun: { rating: "good", rain: 40, days: 3, temp: 29, note: "Seco." }
    },
    highlights: ["Kelingking Beach", "Diamond Beach y Atuh", "Broken Beach y Angel's Billabong"],
    zonas: ["Este de Penida (cerca de Diamond Beach)"],
    lodging: [
      { name: "Maua Nusa Penida", level: "$$$", note: "Villas con vista al mar" },
      { name: "Semabu Hills", level: "$$", note: "Entre colinas" }
    ]
  },

  // ---------------- INDONESIA · LOMBOK & GILIS ----------------
  {
    id: "giliair", name: "Gili Air", country: "Indonesia", island: "gili",
    lat: -8.3578, lng: 116.0822, gateway: 3.5, kind: "base",
    nights: [3, 4],
    verdict: "Sí. La Gili ideal para parejas: sin autos ni motos, tranquila pero con buena comida y ambiente lindo.",
    desc: "Isla chiquita que se recorre en bici o caminando. Agua turquesa, tortugas marinas a metros de la orilla, hamacas y atardeceres con el volcán Agung de fondo.",
    weather: {
      may: { rating: "good", rain: 70, days: 5, temp: 30, note: "Seco y soleado." },
      jun: { rating: "good", rain: 30, days: 3, temp: 29, note: "Muy seco, mar calmo." }
    },
    highlights: [
      "Snorkel con tortugas (tour de las 3 Gilis)",
      "Vuelta a la isla en bici",
      "Atardecer en el lado oeste con swing en el agua",
      "Bautismo de buceo o curso Open Water juntos",
      "Día en Gili Meno (estatuas submarinas)"
    ],
    zonas: ["Costa este (más movida, restaurantes)", "Costa oeste/norte (atardeceres, más tranquila)"],
    lodging: [
      { name: "Gili Air Lagoon Resort", level: "$$$", note: "Frente a la playa, pileta grande" },
      { name: "Sejuk Cottages", level: "$$", note: "Lumbung con pileta, encantador" },
      { name: "Captain Coconuts", level: "$$", note: "Bungalows boutique" }
    ]
  },
  {
    id: "gilimeno", name: "Gili Meno", country: "Indonesia", island: "gili",
    lat: -8.3500, lng: 116.0590, gateway: 3.5, kind: "extra",
    nights: [2, 3],
    verdict: "La más romántica y silenciosa de las tres. Poca oferta: buena para combinar 2 noches con Gili Air.",
    desc: "La Gili del medio: casi sin gente, playas enteras para ustedes y las estatuas submarinas (Nest).",
    weather: {
      may: { rating: "good", rain: 70, days: 5, temp: 30, note: "Seco." },
      jun: { rating: "good", rain: 30, days: 3, temp: 29, note: "Muy seco." }
    },
    highlights: ["Estatuas submarinas 'Nest'", "Playas vacías", "Lago salado al atardecer"],
    zonas: ["Costa oeste"],
    lodging: [{ name: "Mahamaya", level: "$$$", note: "Boutique frente al atardecer" }]
  },
  {
    id: "gilit", name: "Gili Trawangan", country: "Indonesia", island: "gili",
    lat: -8.3500, lng: 116.0400, gateway: 3.5, kind: "extra",
    nights: [2, 3],
    verdict: "La más grande y fiestera. Para luna de miel conviene más Gili Air o Meno (se puede visitar en el día).",
    desc: "Mucha vida nocturna, mercado nocturno de comida y el columpio famoso del atardecer.",
    weather: {
      may: { rating: "good", rain: 70, days: 5, temp: 30, note: "Seco." },
      jun: { rating: "good", rain: 30, days: 3, temp: 29, note: "Muy seco." }
    },
    highlights: ["Night market", "Atardecer en el lado oeste", "Buceo"],
    zonas: ["Lado oeste (tranquilo)", "Lado este (fiesta)"],
    lodging: [{ name: "Pearl of Trawangan", level: "$$$", note: "Frente a la playa" }]
  },
  {
    id: "lombok", name: "Lombok sur (Kuta)", country: "Indonesia", island: "lombok",
    lat: -8.8950, lng: 116.2770, gateway: 3.5, kind: "base",
    nights: [2, 3],
    verdict: "Recomendado para playas vírgenes y espacio. Si hay que recortar días, es el segundo en salir (después de Coron).",
    desc: "El Bali de hace 30 años: bahías de arena blanca rodeadas de colinas verdes, casi sin construcciones. Se recorre en moto o con chofer. Lombok es mayormente musulmán: vestir más cubierto fuera de la playa.",
    weather: {
      may: { rating: "good", rain: 80, days: 6, temp: 31, note: "Seco, colinas todavía verdes." },
      jun: { rating: "good", rain: 35, days: 3, temp: 30, note: "Muy seco." }
    },
    highlights: [
      "Playas Tanjung Aan, Mawun, Selong Belanak y Mandalika",
      "Mirador Bukit Merese al atardecer",
      "Clase de surf en Selong Belanak (olas suaves)",
      "Pueblo sasak de Sade"
    ],
    zonas: ["Kuta Lombok (restaurantes)", "Selong Belanak (más tranquilo y lindo)"],
    lodging: [
      { name: "Selong Selo Resort & Residences", level: "$$$$", note: "Villas en la colina de Selong Belanak" },
      { name: "Pullman Lombok Mandalika", level: "$$$", note: "Frente a la playa" },
      { name: "Novotel Lombok Resort & Villas", level: "$$", note: "Arquitectura sasak, playa" }
    ]
  },

  // ---------------- INDONESIA · FLORES ----------------
  {
    id: "labuanbajo", name: "Labuan Bajo (Komodo)", country: "Indonesia", island: "flores",
    lat: -8.4964, lng: 119.8877, gateway: 2.5, kind: "extra",
    nights: [3, 4],
    verdict: "Extra top si quieren algo único: dragones de Komodo, Pink Beach y barco de lujo 2-3 días. Vuelo de 1 h desde Bali. Es el lugar más seco de la lista.",
    desc: "Puerta al Parque Nacional Komodo: islas secas y doradas, mantarrayas, playas rosadas y los dragones. Lo mejor es dormir 1-2 noches en un phinisi (velero tradicional) privado.",
    weather: {
      may: { rating: "good", rain: 40, days: 3, temp: 31, note: "Muy seco." },
      jun: { rating: "good", rain: 15, days: 1, temp: 30, note: "Casi sin lluvia." }
    },
    highlights: ["Dragones en Rinca/Komodo", "Mirador de Padar al amanecer", "Pink Beach", "Snorkel con mantas en Manta Point", "Noche en phinisi"],
    zonas: ["Labuan Bajo (pueblo)", "Barco (liveaboard)"],
    lodging: [
      { name: "AYANA Komodo Waecicu Beach", level: "$$$$", note: "El mejor resort de la zona" },
      { name: "Plataran Komodo", level: "$$$", note: "Villas frente al mar" }
    ]
  }
];

// Conexiones conocidas (simétricas). hours = puerta a puerta aprox. cost = USD por persona aprox.
window.CONEXIONES = [
  { a: "manila", b: "elnido", mode: "flight", hours: 3, cost: 180, how: "Vuelo directo AirSWIFT Manila → El Nido (aeropuerto de Lio, 15 min del pueblo). Opción barata: vuelo a Puerto Princesa + van de 5-6 h." },
  { a: "manila", b: "coron", mode: "flight", hours: 3.5, cost: 90, how: "Vuelo a Busuanga (USU) + van de 40 min a Coron." },
  { a: "manila", b: "siargao", mode: "flight", hours: 3.5, cost: 110, how: "Vuelo directo a Siargao (IAO)." },
  { a: "elnido", b: "coron", mode: "boat", hours: 4.5, cost: 40, how: "Ferry rápido a la mañana (~4 h). En junio puede cancelarse por mar picado. Alternativa de aventura: expedición en barco de 3-5 días con Tao Philippines." },
  { a: "ubud", b: "giliair", mode: "boat", hours: 3.5, cost: 45, how: "Auto a Padangbai (1 h) + fast boat (1,5-2 h). Muchos operadores incluyen el traslado desde el hotel." },
  { a: "ubud", b: "gilimeno", mode: "boat", hours: 3.5, cost: 45, how: "Auto a Padangbai + fast boat." },
  { a: "ubud", b: "gilit", mode: "boat", hours: 3.5, cost: 45, how: "Auto a Padangbai + fast boat." },
  { a: "ubud", b: "lombok", mode: "flight", hours: 4.5, cost: 90, how: "Auto al aeropuerto (1,5 h) + vuelo Bali → Lombok (40 min) + auto a Kuta (30 min)." },
  { a: "ubud", b: "lembongan", mode: "boat", hours: 2, cost: 25, how: "Auto a Sanur (45 min) + fast boat (30-40 min)." },
  { a: "ubud", b: "penida", mode: "boat", hours: 2.2, cost: 25, how: "Auto a Sanur + fast boat (45 min)." },
  { a: "ubud", b: "uluwatu", mode: "car", hours: 1.5, cost: 20, how: "Auto con chofer (1,5 h con tráfico)." },
  { a: "ubud", b: "sidemen", mode: "car", hours: 1.2, cost: 20, how: "Auto con chofer; se puede parar en Tirta Empul o Kerta Gosa en el camino." },
  { a: "sidemen", b: "lembongan", mode: "boat", hours: 2.5, cost: 30, how: "Auto a Sanur (1,5 h) + fast boat (30-40 min)." },
  { a: "sidemen", b: "lombok", mode: "boat", hours: 5, cost: 55, how: "Auto a Bangsal (2 h) + fast boat a Padangbai (1,5-2 h) + auto a Sidemen (40 min)." },
  { a: "sidemen", b: "uluwatu", mode: "car", hours: 2, cost: 30, how: "Auto con chofer (~2 h)." },
  { a: "sidemen", b: "amed", mode: "car", hours: 1.3, cost: 25, how: "Auto con chofer, pasando por Tirta Gangga." },
  { a: "ubud", b: "amed", mode: "car", hours: 2.5, cost: 35, how: "Auto con chofer (~2,5 h)." },
  { a: "sidemen", b: "giliair", mode: "boat", hours: 2.5, cost: 45, how: "Auto a Padangbai (40 min) + fast boat." },
  { a: "sidemen", b: "gilimeno", mode: "boat", hours: 2.5, cost: 45, how: "Auto a Padangbai (40 min) + fast boat." },
  { a: "amed", b: "giliair", mode: "boat", hours: 1.5, cost: 40, how: "Fast boat directo desde Amed (~1 h)." },
  { a: "giliair", b: "lombok", mode: "car", hours: 2.5, cost: 35, how: "Bote público a Bangsal (15 min) + auto con chofer a Kuta (2 h)." },
  { a: "giliair", b: "gilimeno", mode: "boat", hours: 0.3, cost: 5, how: "Bote de island hopping (salen varias veces por día)." },
  { a: "giliair", b: "gilit", mode: "boat", hours: 0.3, cost: 5, how: "Bote de island hopping." },
  { a: "gilimeno", b: "gilit", mode: "boat", hours: 0.2, cost: 5, how: "Bote de island hopping." },
  { a: "giliair", b: "lembongan", mode: "boat", hours: 2, cost: 45, how: "Fast boat directo Gili → Nusa Lembongan (algunos operadores; reservar con anticipación)." },
  { a: "gilimeno", b: "lembongan", mode: "boat", hours: 2.2, cost: 45, how: "Fast boat Gili → Lembongan." },
  { a: "gilit", b: "lembongan", mode: "boat", hours: 2, cost: 45, how: "Fast boat directo Gili T → Lembongan." },
  { a: "giliair", b: "uluwatu", mode: "boat", hours: 4, cost: 50, how: "Fast boat a Padangbai o Serangan + auto (1-1,5 h)." },
  { a: "giliair", b: "penida", mode: "boat", hours: 2.2, cost: 45, how: "Fast boat Gili → Penida (vía Lembongan)." },
  { a: "lombok", b: "lembongan", mode: "boat", hours: 4.5, cost: 55, how: "Auto a Bangsal/Teluk Kode (2-2,5 h) + fast boat (1,5-2 h)." },
  { a: "lombok", b: "uluwatu", mode: "flight", hours: 3.5, cost: 80, how: "Auto al aeropuerto de Lombok (30 min) + vuelo a Bali (40 min) + auto a Uluwatu (45 min)." },
  { a: "lombok", b: "labuanbajo", mode: "flight", hours: 4, cost: 120, how: "Vuelo Lombok → Labuan Bajo (a veces con escala en Bali)." },
  { a: "lembongan", b: "penida", mode: "boat", hours: 0.5, cost: 10, how: "Bote local desde Lembongan (15 min)." },
  { a: "lembongan", b: "uluwatu", mode: "boat", hours: 2, cost: 30, how: "Fast boat a Sanur (30-40 min) + auto a Uluwatu (1 h)." },
  { a: "penida", b: "uluwatu", mode: "boat", hours: 2.2, cost: 30, how: "Fast boat a Sanur + auto (1 h)." },
  { a: "uluwatu", b: "canggu", mode: "car", hours: 1.2, cost: 20, how: "Auto con chofer (mucho tráfico)." },
  { a: "uluwatu", b: "seminyak", mode: "car", hours: 1, cost: 18, how: "Auto con chofer." },
  { a: "uluwatu", b: "labuanbajo", mode: "flight", hours: 3.5, cost: 110, how: "Auto al aeropuerto (40 min) + vuelo Bali → Labuan Bajo (1 h)." },
  { a: "ubud", b: "labuanbajo", mode: "flight", hours: 4.5, cost: 110, how: "Auto al aeropuerto (1,5 h) + vuelo Bali → Labuan Bajo (1 h)." }
];

// Entre países distintos: vuelo vía Manila ↔ Bali (Philippine Airlines / Cebu Pacific tienen directo MNL–DPS ~4 h).
// hours = base + gateway(origen) + gateway(destino)
window.CONEXION_INTERNACIONAL = {
  mode: "flight", baseHours: 7, cost: 330,
  how: "Vuelo al hub (Manila) + vuelo directo Manila → Bali (~4 h) + traslado. Es un día entero de viaje: conviene salir temprano o dormir una noche en Manila."
};

// Husos horarios (UTC). Chile continental está en UTC-4 (horario de invierno) entre abril y septiembre.
// Filipinas y Bali/Lombok están en UTC+8.
window.ZONAS = { home: -4, homeName: "Chile", dest: 8, destName: "Filipinas y Bali" };

// Vuelos internacionales por defecto (precios estimados por persona, en USD: editables).
// Aeropuerto vacío = automático según el primer/último destino del itinerario.
window.AEROPUERTOS = { Filipinas: "Manila (MNL)", Indonesia: "Bali (DPS)" };
window.VUELOS_DEFAULT = {
  out: { from: "Santiago (SCL)", to: "", date: "2027-05-15", time: "08:00", hours: 32, price: 900,
         notes: "Rutas típicas: vía Sídney/Melbourne (LATAM + Philippine Airlines/Qantas), vía Auckland o vía EE.UU. (LAX + Philippine Airlines)." },
  back: { from: "", to: "Santiago (SCL)", time: "10:00", hours: 32, price: 900,
          notes: "Buscar como multidestino: Santiago → Manila y Bali → Santiago. Vía Sídney suele ser lo más corto." }
};

// Plan sugerido (el que queda cargado la primera vez)
window.PLAN_SUGERIDO = {
  travelers: 2,
  stops: [
    { id: "manila", nights: 1 },
    { id: "elnido", nights: 5 },
    { id: "coron", nights: 3 },
    { id: "ubud", nights: 4 },
    { id: "lembongan", nights: 3 },
    { id: "giliair", nights: 4 },
    { id: "lombok", nights: 3 },
    { id: "uluwatu", nights: 5 }
  ]
};

window.TIPS = [
  { t: "Orden por clima", d: "Filipinas primero (El Nido en mayo, antes del monzón de mediados de junio) e Indonesia después: en Bali, Lombok y las Gili, mayo y junio son estación seca, ideal." },
  { t: "Vuelos desde Santiago", d: "Busquen un pasaje multidestino: Santiago → Manila de ida y Bali → Santiago de vuelta (así no tienen que volver a Manila). Las rutas más cortas suelen ir vía Sídney o Auckland; vía EE.UU. también existe pero es más larga." },
  { t: "Diferencia horaria y jet lag", d: "Filipinas y Bali están 12 h adelante de Chile. A la ida \"pierden\" un día (salen sábado y llegan lunes de madrugada); a la vuelta lo recuperan (el vuelo dura ~32 h pero llegan ~20 h después según el reloj). El primer día en Manila, descansen." },
  { t: "Avisen que es luna de miel", d: "Cuando reserven, escríbanlo en la reserva: muchos hoteles en Bali y Palawan regalan upgrades, decoración con flores, cena o torta." },
  { t: "Entrada a Filipinas", d: "Registro online obligatorio eTravel (gratis) dentro de las 72 h previas. Con pasaporte chileno o argentino, en general se entra sin visa por 30 días (verificar según su pasaporte antes de viajar)." },
  { t: "Entrada a Indonesia", d: "Visa on arrival / e-VOA (~IDR 500.000 p/p, se tramita online), declaración de aduana online (All Indonesia) y tasa turística de Bali (IDR 150.000 p/p). Verificar requisitos vigentes." },
  { t: "Fast boats", d: "Reservar con operadores conocidos y con buenas reseñas recientes; salir a la mañana (el mar está más calmo). Llevar las valijas medianas: se cargan a mano en la playa." },
  { t: "Vuelos internos", d: "AirSWIFT (El Nido) tiene límite de equipaje de 10 kg en bodega en tarifas básicas: comprar kilos extra por adelantado." },
  { t: "Plata", d: "Llevar efectivo (pesos filipinos en El Nido y rupias en Gili/Lombok), hay pocos cajeros y a veces sin plata. En Bali se paga con tarjeta casi en todos lados." },
  { t: "Salud", d: "Seguro de viaje con cobertura de buceo si van a bucear. Tomar agua embotellada (evitar el 'Bali belly'). Protector solar reef-safe." },
  { t: "Enchufes", d: "Filipinas: tipo A/B (como EE.UU.). Indonesia: tipo C/F (europeo). Llevar adaptador universal." },
  { t: "Traslados en Bali", d: "Contratar chofer por día (~USD 40-50/día) es cómodo y barato; también Grab / Gojek (apps tipo Uber)." },
  { t: "Feriados", d: "Idul Adha cae cerca del 16-17 de mayo de 2027: en Lombok puede haber algo más de movimiento local, pero no afecta al turismo." },
  { t: "Llegada de madrugada", d: "Muchos vuelos llegan a Manila de madrugada: si llegan a Manila a las 4-5 am, reserven el hotel desde la noche anterior para poder dormir apenas llegan (o pidan early check-in)." }
];

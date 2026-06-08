/**
 * Seed bilingual blog articles (EN + ES) into Sanity.
 *
 * SCOPE: this script writes ONLY `blogArticle` documents. It reads existing
 * `blogCategory` docs to reference them, but never creates or modifies any
 * other document type. (A hard guard before the write loop enforces this.)
 *
 * Usage:
 *   1. SANITY_API_TOKEN in .env.local (Editor token)
 *   2. npx tsx src/sanity/seed/seedBlog.ts   (or: npm run seed:blog)
 *
 * Idempotent — createOrReplace keyed on deterministic _ids.
 * Featured & OG images are intentionally omitted — upload via Studio.
 */
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN. Create one at sanity.io/manage → API → Tokens (Editor or higher).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-19",
  token,
  useCdn: false,
});

// =============================================================================
// Portable Text helpers
// =============================================================================

let keyCounter = 0;
const k = () => `b${(keyCounter += 1)}`;

function para(text: string) {
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  };
}

function heading(text: string, style: "h2" | "h3") {
  return {
    _type: "block",
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  };
}

function quote(text: string) {
  return {
    _type: "block",
    _key: k(),
    style: "blockquote",
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  };
}

function bullets(items: string[]) {
  return items.map((text) => ({
    _type: "block",
    _key: k(),
    style: "normal",
    level: 1,
    listItem: "bullet",
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  }));
}

// =============================================================================
// Article factory
// =============================================================================

interface Seo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}

interface ArticleInput {
  group: string;
  lang: "en" | "es";
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  categorySlug: string;
  body: object[];
  seo: Seo;
}

function article(input: ArticleInput, categoryRefBySlug: Record<string, string>) {
  const categoryId = categoryRefBySlug[input.categorySlug];
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.excerpt,
    inLanguage: input.lang,
    datePublished: input.publishedAt,
    author: { "@type": "Organization", name: "Punta Cana Private Excursions" },
    publisher: {
      "@type": "Organization",
      name: "Punta Cana Private Excursions",
    },
  });

  return {
    _id: `blogArticle-${input.group}-${input.lang}`,
    _type: "blogArticle",
    language: input.lang,
    translationGroup: input.group,
    slug: { _type: "slug", current: input.slug },
    title: input.title,
    excerpt: input.excerpt,
    publishedAt: input.publishedAt,
    readingTime: input.readingTime,
    ...(categoryId
      ? { category: { _type: "reference", _ref: categoryId } }
      : {}),
    body: input.body,
    seo: {
      _type: "seoSingleLanguage",
      metaTitle: input.seo.metaTitle,
      metaDescription: input.seo.metaDescription,
      keywords: input.seo.keywords,
      ogTitle: input.seo.ogTitle,
      ogDescription: input.seo.ogDescription,
      twitterCard: "summary_large_image",
      structuredData,
      noIndex: false,
      noFollow: false,
    },
  };
}

// =============================================================================
// Content — 5 translation groups × EN + ES
// =============================================================================

function buildArticles(catMap: Record<string, string>) {
  const make = (i: ArticleInput) => article(i, catMap);

  return [
    // 1 — Travel Tips ────────────────────────────────────────────────────────
    make({
      group: "best-time-to-visit",
      lang: "en",
      slug: "best-time-to-visit-punta-cana",
      title: "The Best Time to Visit Punta Cana",
      excerpt:
        "Sun, sea, and savings — here's how to pick the perfect window for your private Punta Cana escape.",
      publishedAt: "2026-05-18",
      readingTime: 6,
      categorySlug: "travel-tips",
      seo: {
        metaTitle: "Best Time to Visit Punta Cana | Season-by-Season Guide",
        metaDescription:
          "When to visit Punta Cana for the best weather, fewest crowds, and lowest prices — a concierge's month-by-month breakdown.",
        keywords: [
          "best time to visit punta cana",
          "punta cana weather",
          "punta cana travel guide",
          "dominican republic seasons",
        ],
        ogTitle: "The Best Time to Visit Punta Cana",
        ogDescription:
          "A month-by-month guide to weather, crowds, and prices on the Dominican coast.",
      },
      body: [
        para(
          "Punta Cana is a year-round destination, but the right month depends on what you're chasing — flawless beach weather, fewer crowds, or the best value on a private charter.",
        ),
        heading("Peak season: December to April", "h2"),
        para(
          "This is the dry season, with warm days, low humidity, and barely a cloud. It's also the busiest and priciest stretch, so book private excursions well in advance.",
        ),
        heading("Shoulder season: May and November", "h2"),
        para(
          "Our favourite secret. You still get gorgeous weather, the sea is calm and clear for diving, and both hotels and excursions are noticeably easier on the wallet.",
        ),
        heading("What to keep in mind", "h3"),
        ...bullets([
          "Hurricane season runs June–November, but direct hits are rare and we monitor conditions daily.",
          "Sea visibility for diving is best from March to June.",
          "Whale watching off Samaná peaks January–March.",
        ]),
        quote(
          "If you want our honest pick: come in late April or early November. You get peak-season weather at shoulder-season prices.",
        ),
        para(
          "Whenever you arrive, our concierge tailors every day to the conditions — so you're always somewhere beautiful, at the right time.",
        ),
      ],
    }),
    make({
      group: "best-time-to-visit",
      lang: "es",
      slug: "mejor-epoca-para-visitar-punta-cana",
      title: "La Mejor Época para Visitar Punta Cana",
      excerpt:
        "Sol, mar y ahorro — así eliges la ventana perfecta para tu escapada privada a Punta Cana.",
      publishedAt: "2026-05-18",
      readingTime: 6,
      categorySlug: "travel-tips",
      seo: {
        metaTitle: "Mejor Época para Visitar Punta Cana | Guía por Temporada",
        metaDescription:
          "Cuándo visitar Punta Cana para el mejor clima, menos multitudes y mejores precios — una guía mes a mes de nuestra conserjería.",
        keywords: [
          "mejor epoca para visitar punta cana",
          "clima punta cana",
          "guia de viaje punta cana",
          "temporadas republica dominicana",
        ],
        ogTitle: "La Mejor Época para Visitar Punta Cana",
        ogDescription:
          "Una guía mes a mes del clima, las multitudes y los precios en la costa dominicana.",
      },
      body: [
        para(
          "Punta Cana es un destino para todo el año, pero el mejor mes depende de lo que busques — clima de playa perfecto, menos gente o el mejor precio en un charter privado.",
        ),
        heading("Temporada alta: diciembre a abril", "h2"),
        para(
          "Es la temporada seca, con días cálidos, poca humedad y apenas una nube. También es la más concurrida y cara, así que reserva las excursiones privadas con antelación.",
        ),
        heading("Temporada media: mayo y noviembre", "h2"),
        para(
          "Nuestro secreto favorito. Sigues teniendo un clima precioso, el mar está tranquilo y claro para bucear, y tanto los hoteles como las excursiones cuestan bastante menos.",
        ),
        heading("Qué tener en cuenta", "h3"),
        ...bullets([
          "La temporada de huracanes va de junio a noviembre, pero los impactos directos son raros y vigilamos las condiciones a diario.",
          "La visibilidad del mar para bucear es mejor de marzo a junio.",
          "El avistamiento de ballenas en Samaná es mejor de enero a marzo.",
        ]),
        quote(
          "Si quieres nuestra opinión sincera: ven a finales de abril o principios de noviembre. Tienes clima de temporada alta a precios de temporada media.",
        ),
        para(
          "Cuando sea que llegues, nuestra conserjería adapta cada día a las condiciones — para que siempre estés en un lugar hermoso, en el momento justo.",
        ),
      ],
    }),

    // 2 — Marine Life ──────────────────────────────────────────────────────────
    make({
      group: "underwater-punta-cana",
      lang: "en",
      slug: "what-you-see-diving-punta-cana",
      title: "What You'll See Underwater in Punta Cana",
      excerpt:
        "Reefs, wrecks, and the residents that call them home — a diver's preview of the Dominican deep.",
      publishedAt: "2026-05-25",
      readingTime: 7,
      categorySlug: "marine-life",
      seo: {
        metaTitle: "Marine Life in Punta Cana | What You'll See Diving",
        metaDescription:
          "Sea turtles, nurse sharks, coral gardens and historic wrecks — the marine life you'll encounter diving in Punta Cana.",
        keywords: [
          "punta cana marine life",
          "diving punta cana",
          "caribbean reef fish",
          "punta cana snorkeling",
        ],
        ogTitle: "What You'll See Underwater in Punta Cana",
        ogDescription:
          "A diver's preview of the reefs, wrecks, and residents of the Dominican deep.",
      },
      body: [
        para(
          "The water off Punta Cana is warm, clear, and alive. Whether you're snorkeling your first reef or diving a deep wreck, here's who you're likely to meet.",
        ),
        heading("On the reefs", "h2"),
        para(
          "Healthy coral gardens shelter a riot of colour — parrotfish, angelfish, sergeant majors, and the occasional shy octopus tucked into the rock.",
        ),
        ...bullets([
          "Green and hawksbill sea turtles grazing the sea grass",
          "Southern stingrays gliding over the sand",
          "Nurse sharks resting under ledges",
          "Schools of blue tang and grunts",
        ]),
        heading("On the wrecks", "h2"),
        para(
          "The Monica and the St. George have become thriving artificial reefs, drawing barracuda, groupers, and clouds of baitfish that swirl through their hulls.",
        ),
        quote(
          "Nothing prepares you for your first turtle encounter — they're curious, unhurried, and utterly unbothered by their audience.",
        ),
        para(
          "Every dive is guided by a PADI pro who knows exactly where the residents are hiding, so you spend less time searching and more time watching.",
        ),
      ],
    }),
    make({
      group: "underwater-punta-cana",
      lang: "es",
      slug: "que-veras-buceando-en-punta-cana",
      title: "Lo Que Verás Bajo el Agua en Punta Cana",
      excerpt:
        "Arrecifes, naufragios y los residentes que los habitan — un adelanto para buzos del fondo dominicano.",
      publishedAt: "2026-05-25",
      readingTime: 7,
      categorySlug: "marine-life",
      seo: {
        metaTitle: "Vida Marina en Punta Cana | Qué Verás Buceando",
        metaDescription:
          "Tortugas marinas, tiburones gata, jardines de coral y naufragios históricos — la vida marina que encontrarás buceando en Punta Cana.",
        keywords: [
          "vida marina punta cana",
          "buceo punta cana",
          "peces de arrecife del caribe",
          "snorkel punta cana",
        ],
        ogTitle: "Lo Que Verás Bajo el Agua en Punta Cana",
        ogDescription:
          "Un adelanto para buzos de los arrecifes, naufragios y residentes del fondo dominicano.",
      },
      body: [
        para(
          "El agua de Punta Cana es cálida, clara y está llena de vida. Ya sea que hagas snorkel en tu primer arrecife o bucees un naufragio profundo, esto es a quién probablemente conocerás.",
        ),
        heading("En los arrecifes", "h2"),
        para(
          "Saludables jardines de coral albergan una explosión de color — peces loro, peces ángel, sargentos y algún tímido pulpo escondido en la roca.",
        ),
        ...bullets([
          "Tortugas verdes y carey pastando en la hierba marina",
          "Rayas látigo deslizándose sobre la arena",
          "Tiburones gata descansando bajo las cornisas",
          "Cardúmenes de navajón azul y roncadores",
        ]),
        heading("En los naufragios", "h2"),
        para(
          "El Monica y el St. George se han convertido en prósperos arrecifes artificiales, atrayendo barracudas, meros y nubes de peces carnada que giran entre sus cascos.",
        ),
        quote(
          "Nada te prepara para tu primer encuentro con una tortuga — son curiosas, tranquilas y totalmente indiferentes a su público.",
        ),
        para(
          "Cada inmersión es guiada por un profesional PADI que sabe exactamente dónde se esconden los residentes, para que pases menos tiempo buscando y más tiempo observando.",
        ),
      ],
    }),

    // 3 — Local Culture ─────────────────────────────────────────────────────────
    make({
      group: "dominican-culture",
      lang: "en",
      slug: "dominican-culture-beyond-the-resort",
      title: "A Taste of Dominican Culture Beyond the Resort",
      excerpt:
        "Merengue, mamajuana, and the warmth of the campo — how to meet the real Dominican Republic.",
      publishedAt: "2026-06-01",
      readingTime: 5,
      categorySlug: "local-culture",
      seo: {
        metaTitle: "Dominican Culture Beyond the Resort | Local Guide",
        metaDescription:
          "Music, food, and traditions worth leaving the resort for — a local's guide to authentic Dominican culture near Punta Cana.",
        keywords: [
          "dominican culture",
          "punta cana local experiences",
          "dominican food",
          "merengue bachata",
        ],
        ogTitle: "A Taste of Dominican Culture Beyond the Resort",
        ogDescription:
          "How to meet the real Dominican Republic — music, food, and the warmth of the campo.",
      },
      body: [
        para(
          "The resort strip is beautiful, but the heart of the Dominican Republic beats a little further inland — in its music, its food, and its people.",
        ),
        heading("The soundtrack", "h2"),
        para(
          "Merengue and bachata aren't just genres here, they're a way of moving through the day. Don't be surprised if a roadside colmado turns into an impromptu dance floor.",
        ),
        heading("The flavours", "h2"),
        ...bullets([
          "La bandera — rice, beans, and stewed meat, the everyday national dish",
          "Tostones and fresh-caught fish on the beach",
          "Mamajuana, the local herbal rum infusion",
          "Cacao and coffee straight from the campo",
        ]),
        quote(
          "Ask any Dominican what they're proudest of and the answer is almost always the same: the people.",
        ),
        para(
          "We can weave a cultural detour into any day — a family-run lunch, a cacao farm, a town that never sees a tour bus.",
        ),
      ],
    }),
    make({
      group: "dominican-culture",
      lang: "es",
      slug: "cultura-dominicana-mas-alla-del-resort",
      title: "Un Sabor de la Cultura Dominicana Más Allá del Resort",
      excerpt:
        "Merengue, mamajuana y la calidez del campo — cómo conocer la verdadera República Dominicana.",
      publishedAt: "2026-06-01",
      readingTime: 5,
      categorySlug: "local-culture",
      seo: {
        metaTitle: "Cultura Dominicana Más Allá del Resort | Guía Local",
        metaDescription:
          "Música, comida y tradiciones por las que vale la pena salir del resort — una guía local de la auténtica cultura dominicana cerca de Punta Cana.",
        keywords: [
          "cultura dominicana",
          "experiencias locales punta cana",
          "comida dominicana",
          "merengue bachata",
        ],
        ogTitle: "Un Sabor de la Cultura Dominicana Más Allá del Resort",
        ogDescription:
          "Cómo conocer la verdadera República Dominicana — música, comida y la calidez del campo.",
      },
      body: [
        para(
          "La zona de resorts es preciosa, pero el corazón de la República Dominicana late un poco más hacia el interior — en su música, su comida y su gente.",
        ),
        heading("La banda sonora", "h2"),
        para(
          "El merengue y la bachata no son solo géneros aquí, son una forma de moverse por el día. No te sorprendas si un colmado a la orilla del camino se convierte en una pista de baile improvisada.",
        ),
        heading("Los sabores", "h2"),
        ...bullets([
          "La bandera — arroz, habichuelas y carne guisada, el plato nacional de cada día",
          "Tostones y pescado recién capturado en la playa",
          "Mamajuana, la infusión local de ron con hierbas",
          "Cacao y café directo del campo",
        ]),
        quote(
          "Pregúntale a cualquier dominicano de qué está más orgulloso y la respuesta casi siempre es la misma: la gente.",
        ),
        para(
          "Podemos integrar un desvío cultural en cualquier día — un almuerzo en familia, una finca de cacao, un pueblo que nunca ve un autobús turístico.",
        ),
      ],
    }),

    // 4 — Adventure ─────────────────────────────────────────────────────────────
    make({
      group: "saona-island-day-trip",
      lang: "en",
      slug: "saona-island-day-trip-guide",
      title: "Saona Island: The Ultimate Day Trip",
      excerpt:
        "Turquoise shallows, starfish, and a beach lunch under the palms — why Saona earns its postcard reputation.",
      publishedAt: "2026-06-04",
      readingTime: 6,
      categorySlug: "adventure",
      seo: {
        metaTitle: "Saona Island Day Trip Guide | Punta Cana",
        metaDescription:
          "Everything to know about a Saona Island day trip from Punta Cana — the natural pool, beaches, lunch, and how to do it privately.",
        keywords: [
          "saona island",
          "saona island day trip",
          "punta cana excursions",
          "natural pool saona",
        ],
        ogTitle: "Saona Island: The Ultimate Day Trip",
        ogDescription:
          "Why Saona earns its postcard reputation — and how to do it on your own schedule.",
      },
      body: [
        para(
          "If you only take one trip beyond the resort, make it Saona. This protected island in the Cotubanamá National Park is the Caribbean of the brochures — only real.",
        ),
        heading("The natural pool", "h2"),
        para(
          "Halfway across, the boat stops at a shallow turquoise sandbank far from shore, where you can stand waist-deep in warm water surrounded by starfish.",
        ),
        heading("The island", "h2"),
        ...bullets([
          "Long palm-fringed beaches with room to breathe",
          "A freshly grilled lunch in the shade",
          "Calm, swimmable water all day",
          "Snorkeling and diving on the way",
        ]),
        quote(
          "Go private and you skip the crowds entirely — your own boat, your own pace, the natural pool to yourselves.",
        ),
        para(
          "It's a long, rewarding day. We handle the logistics end to end so all you do is show up and enjoy it.",
        ),
      ],
    }),
    make({
      group: "saona-island-day-trip",
      lang: "es",
      slug: "guia-excursion-isla-saona",
      title: "Isla Saona: La Mejor Excursión de un Día",
      excerpt:
        "Aguas turquesas, estrellas de mar y un almuerzo en la playa bajo las palmeras — por qué Saona merece su fama de postal.",
      publishedAt: "2026-06-04",
      readingTime: 6,
      categorySlug: "adventure",
      seo: {
        metaTitle: "Guía Excursión a Isla Saona | Punta Cana",
        metaDescription:
          "Todo lo que debes saber sobre una excursión de un día a Isla Saona desde Punta Cana — la piscina natural, las playas, el almuerzo y cómo hacerla en privado.",
        keywords: [
          "isla saona",
          "excursion isla saona",
          "excursiones punta cana",
          "piscina natural saona",
        ],
        ogTitle: "Isla Saona: La Mejor Excursión de un Día",
        ogDescription:
          "Por qué Saona merece su fama de postal — y cómo hacerla a tu propio ritmo.",
      },
      body: [
        para(
          "Si solo haces una excursión más allá del resort, que sea Saona. Esta isla protegida en el Parque Nacional Cotubanamá es el Caribe de los folletos — pero real.",
        ),
        heading("La piscina natural", "h2"),
        para(
          "A mitad de camino, el barco se detiene en un banco de arena turquesa poco profundo lejos de la costa, donde puedes estar de pie con el agua a la cintura rodeado de estrellas de mar.",
        ),
        heading("La isla", "h2"),
        ...bullets([
          "Largas playas bordeadas de palmeras con espacio para respirar",
          "Un almuerzo recién hecho a la sombra",
          "Agua tranquila y apta para nadar todo el día",
          "Snorkel y buceo en el camino",
        ]),
        quote(
          "Hazlo en privado y te saltas las multitudes por completo — tu propio barco, tu propio ritmo, la piscina natural para ustedes solos.",
        ),
        para(
          "Es un día largo y gratificante. Nos encargamos de toda la logística para que lo único que hagas sea llegar y disfrutarlo.",
        ),
      ],
    }),

    // 5 — Family ────────────────────────────────────────────────────────────────
    make({
      group: "punta-cana-with-kids",
      lang: "en",
      slug: "punta-cana-with-kids-family-guide",
      title: "Punta Cana With Kids: A Family Guide",
      excerpt:
        "Calm beaches, gentle adventures, and zero stress — how to plan a Punta Cana trip the whole family loves.",
      publishedAt: "2026-06-06",
      readingTime: 6,
      categorySlug: "family",
      seo: {
        metaTitle: "Punta Cana With Kids | Family Travel Guide",
        metaDescription:
          "Family-friendly beaches, excursions, and tips for visiting Punta Cana with children — a concierge's stress-free planning guide.",
        keywords: [
          "punta cana with kids",
          "family travel punta cana",
          "kid friendly excursions",
          "dominican republic family vacation",
        ],
        ogTitle: "Punta Cana With Kids: A Family Guide",
        ogDescription:
          "How to plan a Punta Cana trip the whole family loves — calm beaches and gentle adventures.",
      },
      body: [
        para(
          "Punta Cana is a dream with kids — warm shallow water, short travel times, and excursions that work for little legs as well as big ones.",
        ),
        heading("Easy wins", "h2"),
        ...bullets([
          "Calm, gradual beaches ideal for first-time swimmers",
          "A private catamaran with shade and snacks",
          "Snorkeling in waist-deep water with a guide",
          "Buggy rides and a cenote swim for older kids",
        ]),
        heading("Planning tips", "h2"),
        para(
          "Build in downtime, time excursions around naps and meals, and let us pack the cooler with kid-friendly food and plenty of water.",
        ),
        quote(
          "Private is the secret to travelling with children — no schedules to keep, no crowds to manage, and a guide who adapts to your family's pace.",
        ),
        para(
          "Tell us your kids' ages and we'll shape a day that keeps everyone — parents included — happy.",
        ),
      ],
    }),
    make({
      group: "punta-cana-with-kids",
      lang: "es",
      slug: "punta-cana-con-ninos-guia-familiar",
      title: "Punta Cana con Niños: Una Guía Familiar",
      excerpt:
        "Playas tranquilas, aventuras suaves y cero estrés — cómo planear un viaje a Punta Cana que toda la familia adore.",
      publishedAt: "2026-06-06",
      readingTime: 6,
      categorySlug: "family",
      seo: {
        metaTitle: "Punta Cana con Niños | Guía de Viaje Familiar",
        metaDescription:
          "Playas, excursiones y consejos aptos para familias que visitan Punta Cana con niños — una guía de planificación sin estrés de nuestra conserjería.",
        keywords: [
          "punta cana con niños",
          "viaje familiar punta cana",
          "excursiones para niños",
          "vacaciones familiares republica dominicana",
        ],
        ogTitle: "Punta Cana con Niños: Una Guía Familiar",
        ogDescription:
          "Cómo planear un viaje a Punta Cana que toda la familia adore — playas tranquilas y aventuras suaves.",
      },
      body: [
        para(
          "Punta Cana es un sueño con niños — agua cálida y poco profunda, trayectos cortos y excursiones que funcionan tanto para piernas pequeñas como grandes.",
        ),
        heading("Aciertos fáciles", "h2"),
        ...bullets([
          "Playas tranquilas y de pendiente suave, ideales para quienes nadan por primera vez",
          "Un catamarán privado con sombra y aperitivos",
          "Snorkel en agua a la cintura con un guía",
          "Paseos en buggy y un baño en cenote para los más grandes",
        ]),
        heading("Consejos de planificación", "h2"),
        para(
          "Incluye tiempo de descanso, organiza las excursiones en torno a siestas y comidas, y déjanos llenar la nevera con comida apta para niños y mucha agua.",
        ),
        quote(
          "Lo privado es el secreto para viajar con niños — sin horarios que cumplir, sin multitudes que gestionar y un guía que se adapta al ritmo de tu familia.",
        ),
        para(
          "Cuéntanos las edades de tus niños y diseñaremos un día que mantenga a todos — padres incluidos — felices.",
        ),
      ],
    }),
  ];
}

// =============================================================================
// Run
// =============================================================================

async function seed() {
  console.log(`📝 Seeding blog articles into ${projectId} / ${dataset}\n`);

  // Read-only: map existing blog categories by slug → _id (never written to)
  const cats = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "blogCategory" && defined(slug.current)]{ _id, "slug": slug.current }`,
  );
  const catMap: Record<string, string> = {};
  for (const c of cats) catMap[c.slug] = c._id;
  console.log(`Found ${cats.length} blog categories to reference.\n`);

  const all = buildArticles(catMap);

  // Safety guard — this script may ONLY write blogArticle documents.
  if (!all.every((d) => d._type === "blogArticle")) {
    console.error("Refusing to run: a non-blogArticle document was generated.");
    process.exit(1);
  }

  let i = 0;
  for (const doc of all) {
    i += 1;
    process.stdout.write(`[${i}/${all.length}] blogArticle (${doc._id})... `);
    try {
      await client.createOrReplace(doc as never);
      console.log("✓");
    } catch (err) {
      console.log("✗");
      console.error(err);
      process.exit(1);
    }
  }

  console.log(`\n✅ Seeded ${all.length} blog articles (5 topics × EN/ES).`);
  console.log(
    "\nNote: featured & OG images were intentionally omitted. Upload them via Studio at /studio.",
  );
}

seed();

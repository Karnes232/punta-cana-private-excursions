/**
 * Seed ONE blog article — "What to Pack for a Punta Cana Excursion: The
 * Complete List" — in all six supported locales (EN, ES, FR, DE, PT, IT).
 *
 * Built on the same long-form template as seedBlogMarineLife.ts.
 *
 * LINKS: inline links via the `link` markDef. Internal links are RELATIVE and
 * point ONLY to stable destinations (category filters, /scuba-diving, /faq,
 * /contact) — NO /excursions/[slug] detail pages. Cross-site links and external
 * citations are ABSOLUTE.
 *
 *   NOTE: links only render as <a> tags if your BlockContent renderer defines a
 *   serializer for the `link` mark in @portabletext/react.
 *
 * SAFETY: uses `createIfNotExists` — never overwrites an existing blogArticle,
 * and only READS blogCategory docs to find a reference.
 *
 * Usage:
 *   1. SANITY_API_TOKEN in .env.local (Editor token)
 *   2. npx tsx scripts/seed/seedBlogWhatToPack.ts
 *
 * Featured & OG images are intentionally omitted — upload via Studio at /studio.
 */
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

import { ALL_LOCALES, type BlogLocale } from "../../i18n/blogLocales";

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
// Per-article constants
// =============================================================================

const GROUP = "what-to-pack-punta-cana-excursion";
const PUBLISHED_AT = "2026-05-05";
const READING_TIME = 8;
const CATEGORY_SLUG = "travel-tips"; // → blogCategory with slug.current === "travel-tips"

// Internal (RELATIVE — no /excursions/[slug]) + cross-site link targets
const LINKS = {
  diveCenter: "https://grandbay-puntacana.com", // sister site — dive center / gear provided
  publicSite: "https://puntacana-excursions.com", // sister site — shared/group excursions
  islandTours: "/excursions?category=island-tours",
  catamarans: "/excursions?category=catamarans",
  adventure: "/excursions?category=adventure",
  scubaDiving: "/scuba-diving",
  faq: "/faq",
  contact: "/contact",
};

// External citations (authoritative, NON-competitor sources only)
const CITATIONS = {
  noaaSunscreen: "https://oceanservice.noaa.gov/news/sunscreen-corals-noaa-studies.html", // NOAA
  cdcDominican:
    "https://wwwnc.cdc.gov/travel/destinations/traveler/none/dominican-republic", // CDC Travelers' Health
};

// =============================================================================
// Portable Text helpers (inline-link aware)
// =============================================================================

let keyCounter = 0;
const k = () => `b${(keyCounter += 1)}`;

type Segment = string | { text: string; href: string };

function block(
  style: "normal" | "h2" | "h3" | "blockquote",
  segments: Segment[],
  list?: { listItem: "bullet" | "number"; level?: number },
) {
  const markDefs: { _type: "link"; _key: string; href: string }[] = [];
  const children = segments.map((seg) => {
    if (typeof seg === "string") {
      return { _type: "span", _key: k(), text: seg, marks: [] as string[] };
    }
    const key = k();
    markDefs.push({ _type: "link", _key: key, href: seg.href });
    return { _type: "span", _key: k(), text: seg.text, marks: [key] };
  });
  return {
    _type: "block",
    _key: k(),
    style,
    markDefs,
    children,
    ...(list ? { listItem: list.listItem, level: list.level ?? 1 } : {}),
  };
}

const para = (segments: Segment[]) => block("normal", segments);
const h2 = (text: string) => block("h2", [text]);
const h3 = (text: string) => block("h3", [text]);
const quote = (text: string) => block("blockquote", [text]);
const li = (segments: Segment[]) =>
  block("normal", segments, { listItem: "bullet", level: 1 });

// =============================================================================
// Types
// =============================================================================

interface Seo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}

interface ArticleMeta {
  lang: BlogLocale;
  slug: string;
  title: string;
  excerpt: string;
  seo: Seo;
  body: ReturnType<typeof block>[];
}

// =============================================================================
// Content — one article in 6 languages
// =============================================================================

const CONTENT: ArticleMeta[] = [
  // ── English ────────────────────────────────────────────────────────────────
  {
    lang: "en",
    slug: "what-to-pack-punta-cana-excursion",
    title: "What to Pack for a Punta Cana Excursion: The Complete List",
    excerpt:
      "Forget the sunscreen and you're miserable by noon; over-pack and you're hauling a suitcase onto a catamaran. A local team's no-fluff packing list for every kind of Punta Cana excursion — and what to leave behind.",
    seo: {
      metaTitle: "What to Pack for a Punta Cana Excursion | Complete List",
      metaDescription:
        "The no-fluff packing list for Punta Cana excursions: essentials, water-day and adventure-day gear, tropical sun and bug protection, reef-safe sunscreen, and what to leave at the resort.",
      keywords: [
        "what to pack punta cana excursion",
        "punta cana packing list",
        "reef safe sunscreen punta cana",
        "what to bring saona island",
        "catamaran packing list",
        "punta cana travel tips",
      ],
      ogTitle: "What to Pack for a Punta Cana Excursion: The Complete List",
      ogDescription:
        "A no-fluff packing list for every kind of Punta Cana excursion — and what to leave at the resort.",
    },
    body: [
      para([
        "A great excursion day in Punta Cana lives or dies by what's in your bag. Forget the sunscreen and you're miserable by noon; over-pack and you're hauling a suitcase onto a catamaran. After thousands of days on this coast, we've watched the same handful of things get forgotten — and just as many get needlessly lugged along.",
      ]),
      para([
        "Here's the no-fluff packing list for a Punta Cana excursion: what to bring for every kind of day, what the tropical climate demands, and what to leave at the resort.",
      ]),

      h2("The essentials — for every excursion"),
      para(["Whatever you've booked, these come along:"]),
      li(["Reef-safe sunscreen (more on this below) and a wide-brimmed hat."]),
      li(["Sunglasses — ideally with a strap for the boat."]),
      li(["A refillable water bottle; the heat is dehydrating."]),
      li(["Cash in small bills, in both US dollars and pesos — handy for tips and any balance due on the day."]),
      li(["Your phone in a waterproof pouch, plus a screenshot of your booking."]),
      li(["A light cover-up or rash guard for shade between activities."]),

      h2("For water days — catamaran, snorkel, Saona and dive trips"),
      para(["If your day involves the sea, add:"]),
      li(["Swimsuit worn under your clothes — changing rooms aren't always handy."]),
      li(["A quick-dry travel towel, lighter than a beach towel."]),
      li(["Water shoes for rocky entries and hot decks."]),
      li(["A dry bag for phones, cash and keys."]),
      li(["Motion-sickness tablets if you're prone — take them before you board."]),
      li(["A GoPro or floating phone case for the snorkel stop."]),
      para([
        "On most of our ",
        { text: "catamaran days", href: LINKS.catamarans },
        " and ",
        { text: "diving and snorkelling", href: LINKS.scubaDiving },
        " trips, the gear is already aboard — check the listing before you over-pack.",
      ]),

      h2("For land and adventure days — buggies, ATVs, ziplines and the cenote"),
      para(["If your day is on dry land, swap in:"]),
      li(["Closed, over-the-ankle shoes you don't mind ruining."]),
      li(["A bandana or buff for the dust on buggy trails."]),
      li(["Eye protection — essential behind the wheel of an ATV."]),
      li(["Clothes you're happy to retire; mud is part of the fun."]),
      li(["A small backpack for layers and water."]),
      para([
        "Each ",
        { text: "adventure tour", href: LINKS.adventure },
        " lists exactly what to wear and any age or height rules — worth a read before you go.",
      ]),

      h2("The tropical climate — pack for the sun and the bugs"),
      para([
        "Two things catch visitors out: the strength of the sun and, away from the breezy coast, the mosquitoes. The ",
        {
          text: "CDC's travel-health guidance for the Dominican Republic",
          href: CITATIONS.cdcDominican,
        },
        " recommends broad-spectrum sunscreen, a hat and plenty of fluids against the heat, plus an EPA-registered insect repellent (DEET or picaridin) and covering up at dawn and dusk — especially in the rainier months from May to November. Tuck a small repellent and any personal medication into your bag and you've covered the basics.",
      ]),

      h2("A quick word on sunscreen"),
      para([
        "Please make it reef-safe. The chemicals in many ordinary sunscreens — oxybenzone and octinoxate above all — are toxic to coral even in tiny amounts, ",
        { text: "according to NOAA", href: CITATIONS.noaaSunscreen },
        ", which is why several destinations have banned them. Look for a mineral formula with non-nano zinc oxide or titanium dioxide. The reefs you're about to snorkel will thank you.",
      ]),

      h2("What to leave at the resort"),
      para(["Lighter is better. Skip:"]),
      li(["Valuables and expensive jewellery — there's nowhere safe for them on a boat."]),
      li(["Anything you couldn't bear to lose to water, sand or theft."]),
      li(["Single-use plastics; bring a refillable bottle instead."]),
      li(["A giant beach bag — a small dry bag does the job."]),
      li(["A drone, unless you've confirmed it's permitted where you're going."]),

      h2("Pack light — we bring the rest"),
      para([
        "On a private day with us, the heavy gear is already handled: snorkel equipment, water, towels and shade come standard, so you really only need yourself, your swimsuit and sunscreen. You'll find what's included on each of our ",
        { text: "island tours", href: LINKS.islandTours },
        ", and the deposit-and-balance details on our ",
        { text: "FAQ", href: LINKS.faq },
        ". Booked a shared group tour instead? Our sister site ",
        { text: "Punta Cana Excursions", href: LINKS.publicSite },
        " lists what those include too, and our original ",
        { text: "dive center", href: LINKS.diveCenter },
        " provides all the gear on water days.",
      ]),

      quote("The best-packed bag is the one you barely notice you're carrying."),

      para([
        "Not sure what your day actually calls for? Tell us what you've booked — or what you're dreaming of — and we'll send a tailored packing list along with it. ",
        { text: "Talk to our concierge", href: LINKS.contact },
        " and we'll handle the rest.",
      ]),
    ],
  },

  // ── Spanish ────────────────────────────────────────────────────────────────
  {
    lang: "es",
    slug: "que-llevar-excursion-punta-cana",
    title: "Qué Llevar a una Excursión en Punta Cana: La Lista Completa",
    excerpt:
      "Olvida el protector solar y estarás incómodo al mediodía; lleva de más y acabarás subiendo una maleta al catamarán. La lista de equipaje sin relleno de un equipo local para cada tipo de excursión en Punta Cana, y lo que debes dejar atrás.",
    seo: {
      metaTitle: "Qué Llevar a una Excursión en Punta Cana | Lista Completa",
      metaDescription:
        "La lista de equipaje directa para excursiones en Punta Cana: esenciales, equipo para días de agua y de aventura, protección solar y antimosquitos, protector reef-safe y qué dejar en el resort.",
      keywords: [
        "qué llevar excursión punta cana",
        "lista de equipaje punta cana",
        "protector solar reef safe punta cana",
        "qué llevar isla saona",
        "lista catamarán",
        "consejos de viaje punta cana",
      ],
      ogTitle: "Qué Llevar a una Excursión en Punta Cana: La Lista Completa",
      ogDescription:
        "Una lista de equipaje sin relleno para cada tipo de excursión en Punta Cana, y lo que debes dejar en el resort.",
    },
    body: [
      para([
        "Un buen día de excursión en Punta Cana depende de lo que lleves en la mochila. Olvida el protector solar y estarás incómodo al mediodía; lleva de más y acabarás subiendo una maleta al catamarán. Tras miles de días en esta costa, hemos visto olvidar siempre las mismas cosas, y cargar de más otras tantas.",
      ]),
      para([
        "Esta es la lista de equipaje sin relleno para una excursión en Punta Cana: qué llevar para cada tipo de día, qué exige el clima tropical y qué dejar en el resort.",
      ]),

      h2("Lo esencial — para cualquier excursión"),
      para(["Hayas reservado lo que hayas reservado, esto te acompaña:"]),
      li(["Protector solar reef-safe (más sobre esto abajo) y un sombrero de ala ancha."]),
      li(["Gafas de sol, mejor con cordón para el barco."]),
      li(["Una botella de agua reutilizable; el calor deshidrata."]),
      li(["Efectivo en billetes pequeños, en dólares y en pesos: útil para propinas y para cualquier saldo a pagar ese día."]),
      li(["El móvil en una funda estanca, más una captura de tu reserva."]),
      li(["Una prenda ligera o licra de protección para resguardarte entre actividades."]),

      h2("Para días de agua — catamarán, snorkel, Saona y buceo"),
      para(["Si tu día incluye mar, añade:"]),
      li(["Bañador puesto bajo la ropa: no siempre hay vestuarios a mano."]),
      li(["Una toalla de secado rápido, más ligera que una de playa."]),
      li(["Escarpines para entradas con rocas y cubiertas calientes."]),
      li(["Una bolsa estanca para móvil, dinero y llaves."]),
      li(["Pastillas para el mareo si eres propenso: tómalas antes de embarcar."]),
      li(["Una GoPro o funda flotante para la parada de snorkel."]),
      para([
        "En la mayoría de nuestros ",
        { text: "días de catamarán", href: LINKS.catamarans },
        " y de ",
        { text: "buceo y snorkel", href: LINKS.scubaDiving },
        ", el equipo ya va a bordo: revisa la ficha antes de cargar de más.",
      ]),

      h2("Para días de tierra y aventura — buggies, ATV, tirolinas y el cenote"),
      para(["Si tu día es en tierra firme, cambia a:"]),
      li(["Calzado cerrado por encima del tobillo que no te importe arruinar."]),
      li(["Un pañuelo o buff para el polvo de los caminos en buggy."]),
      li(["Protección ocular: imprescindible al volante de un ATV."]),
      li(["Ropa que estés dispuesto a jubilar; el barro es parte de la diversión."]),
      li(["Una mochila pequeña para capas de ropa y agua."]),
      para([
        "Cada ",
        { text: "tour de aventura", href: LINKS.adventure },
        " indica exactamente qué ponerte y las normas de edad o altura: vale la pena leerlo antes de salir.",
      ]),

      h2("El clima tropical — prepárate para el sol y los mosquitos"),
      para([
        "Dos cosas pillan desprevenidos a los visitantes: la fuerza del sol y, lejos de la brisa de la costa, los mosquitos. La ",
        {
          text: "guía de salud para viajeros del CDC sobre la República Dominicana",
          href: CITATIONS.cdcDominican,
        },
        " recomienda protector solar de amplio espectro, sombrero y muchos líquidos frente al calor, además de un repelente registrado por la EPA (DEET o picaridina) y cubrirse al amanecer y al atardecer, sobre todo en los meses más lluviosos, de mayo a noviembre. Mete un repelente pequeño y tu medicación personal en la bolsa y tendrás lo básico cubierto.",
      ]),

      h2("Unas palabras sobre el protector solar"),
      para([
        "Por favor, que sea reef-safe. Los químicos de muchos protectores corrientes —la oxibenzona y el octinoxato sobre todo— son tóxicos para el coral incluso en cantidades mínimas, ",
        { text: "según la NOAA", href: CITATIONS.noaaSunscreen },
        ", razón por la que varios destinos los han prohibido. Busca una fórmula mineral con óxido de zinc o dióxido de titanio no nano. Los arrecifes que vas a explorar te lo agradecerán.",
      ]),

      h2("Qué dejar en el resort"),
      para(["Cuanto más ligero, mejor. Sáltate:"]),
      li(["Objetos de valor y joyas caras: en un barco no hay dónde guardarlos a salvo."]),
      li(["Cualquier cosa que no soportarías perder en el agua, la arena o por un robo."]),
      li(["Plásticos de un solo uso; lleva una botella reutilizable."]),
      li(["Un bolso de playa enorme: una pequeña bolsa estanca hace el trabajo."]),
      li(["Un dron, salvo que hayas confirmado que está permitido a donde vas."]),

      h2("Viaja ligero — nosotros llevamos el resto"),
      para([
        "En un día privado con nosotros, el equipo pesado ya está resuelto: equipo de snorkel, agua, toallas y sombra van incluidos, así que solo te necesitas a ti, tu bañador y el protector. Verás lo que incluye cada una de nuestras ",
        { text: "excursiones de isla", href: LINKS.islandTours },
        ", y los detalles de depósito y saldo en nuestras ",
        { text: "preguntas frecuentes", href: LINKS.faq },
        ". ¿Reservaste un tour de grupo compartido? Nuestro sitio hermano ",
        { text: "Punta Cana Excursions", href: LINKS.publicSite },
        " también detalla lo que incluyen, y nuestro centro original ",
        { text: "de buceo", href: LINKS.diveCenter },
        " aporta todo el equipo en los días de agua.",
      ]),

      quote("La mejor mochila es la que casi ni notas que llevas."),

      para([
        "¿No sabes qué requiere tu día? Cuéntanos qué reservaste —o qué sueñas— y te enviaremos una lista de equipaje a medida junto con ello. ",
        { text: "Habla con nuestro concierge", href: LINKS.contact },
        " y nosotros nos encargamos del resto.",
      ]),
    ],
  },

  // ── French ─────────────────────────────────────────────────────────────────
  {
    lang: "fr",
    slug: "que-emporter-excursion-punta-cana",
    title: "Que Emporter pour une Excursion à Punta Cana : La Liste Complète",
    excerpt:
      "Oubliez la crème solaire et vous serez misérable à midi ; surchargez votre sac et vous hisserez une valise sur un catamaran. La liste de bagages sans superflu d'une équipe locale pour chaque type d'excursion à Punta Cana — et ce qu'il faut laisser.",
    seo: {
      metaTitle: "Que Emporter pour une Excursion à Punta Cana | Liste Complète",
      metaDescription:
        "La liste de bagages directe pour les excursions à Punta Cana : essentiels, équipement pour journées eau et aventure, protection soleil et moustiques, crème reef-safe et ce qu'il faut laisser au resort.",
      keywords: [
        "que emporter excursion punta cana",
        "liste de bagages punta cana",
        "crème solaire reef safe punta cana",
        "que emporter île de saona",
        "liste catamaran",
        "conseils de voyage punta cana",
      ],
      ogTitle: "Que Emporter pour une Excursion à Punta Cana : La Liste Complète",
      ogDescription:
        "Une liste de bagages sans superflu pour chaque type d'excursion à Punta Cana — et ce qu'il faut laisser au resort.",
    },
    body: [
      para([
        "Une belle journée d'excursion à Punta Cana se joue sur le contenu de votre sac. Oubliez la crème solaire et vous serez misérable à midi ; surchargez et vous hisserez une valise sur un catamaran. Après des milliers de journées sur cette côte, nous avons vu oublier toujours les mêmes choses — et en trimballer tout autant pour rien.",
      ]),
      para([
        "Voici la liste de bagages sans superflu pour une excursion à Punta Cana : quoi emporter selon le type de journée, ce qu'exige le climat tropical et ce qu'il faut laisser au resort.",
      ]),

      h2("Les essentiels — pour toute excursion"),
      para(["Quoi que vous ayez réservé, ceci vous suit :"]),
      li(["Crème solaire reef-safe (on y revient plus bas) et un chapeau à large bord."]),
      li(["Lunettes de soleil — idéalement avec un cordon pour le bateau."]),
      li(["Une gourde réutilisable ; la chaleur déshydrate."]),
      li(["Du liquide en petites coupures, en dollars US et en pesos — pratique pour les pourboires et tout solde dû le jour même."]),
      li(["Votre téléphone dans une pochette étanche, plus une capture d'écran de votre réservation."]),
      li(["Un haut léger ou un lycra anti-UV pour s'abriter entre les activités."]),

      h2("Pour les journées eau — catamaran, snorkeling, Saona et plongée"),
      para(["Si votre journée se passe en mer, ajoutez :"]),
      li(["Maillot porté sous les vêtements — les vestiaires ne sont pas toujours à portée."]),
      li(["Une serviette de voyage à séchage rapide, plus légère qu'une serviette de plage."]),
      li(["Des chaussures d'eau pour les entrées rocheuses et les ponts brûlants."]),
      li(["Un sac étanche pour téléphone, argent et clés."]),
      li(["Des comprimés contre le mal de mer si vous y êtes sujet — à prendre avant d'embarquer."]),
      li(["Une GoPro ou une coque flottante pour l'arrêt snorkeling."]),
      para([
        "Sur la plupart de nos ",
        { text: "journées en catamaran", href: LINKS.catamarans },
        " et de ",
        { text: "plongée et snorkeling", href: LINKS.scubaDiving },
        ", l'équipement est déjà à bord — vérifiez la fiche avant de trop charger.",
      ]),

      h2("Pour les journées terre et aventure — buggys, quads, tyroliennes et cénote"),
      para(["Si votre journée est au sec, troquez pour :"]),
      li(["Des chaussures fermées et montantes que vous ne craignez pas d'abîmer."]),
      li(["Un bandana ou un buff pour la poussière des pistes en buggy."]),
      li(["Une protection des yeux — essentielle au volant d'un quad."]),
      li(["Des vêtements bons à mettre à la retraite ; la boue fait partie du jeu."]),
      li(["Un petit sac à dos pour les couches et l'eau."]),
      para([
        "Chaque ",
        { text: "tour aventure", href: LINKS.adventure },
        " précise exactement quoi porter et les règles d'âge ou de taille — à lire avant de partir.",
      ]),

      h2("Le climat tropical — préparez le soleil et les moustiques"),
      para([
        "Deux choses prennent les visiteurs au dépourvu : la force du soleil et, loin de la brise côtière, les moustiques. Les ",
        {
          text: "conseils santé-voyage du CDC pour la République dominicaine",
          href: CITATIONS.cdcDominican,
        },
        " recommandent une crème large spectre, un chapeau et beaucoup de liquides contre la chaleur, ainsi qu'un répulsif homologué par l'EPA (DEET ou picaridine) et de se couvrir à l'aube et au crépuscule — surtout pendant les mois plus pluvieux, de mai à novembre. Glissez un petit répulsif et vos médicaments personnels dans le sac et vous aurez l'essentiel.",
      ]),

      h2("Un mot sur la crème solaire"),
      para([
        "De grâce, prenez-la reef-safe. Les produits chimiques de bien des crèmes ordinaires — l'oxybenzone et l'octinoxate avant tout — sont toxiques pour le corail même en quantités infimes, ",
        { text: "selon la NOAA", href: CITATIONS.noaaSunscreen },
        ", ce qui explique que plusieurs destinations les aient interdits. Cherchez une formule minérale à l'oxyde de zinc ou au dioxyde de titane non nano. Les récifs que vous allez explorer vous remercieront.",
      ]),

      h2("Ce qu'il faut laisser au resort"),
      para(["Plus léger, c'est mieux. Laissez :"]),
      li(["Objets de valeur et bijoux coûteux — nulle part où les mettre en sûreté sur un bateau."]),
      li(["Tout ce que vous ne supporteriez pas de perdre dans l'eau, le sable ou un vol."]),
      li(["Le plastique à usage unique ; emportez une gourde réutilisable."]),
      li(["Un sac de plage géant — un petit sac étanche suffit."]),
      li(["Un drone, sauf à avoir confirmé qu'il est autorisé là où vous allez."]),

      h2("Voyagez léger — nous apportons le reste"),
      para([
        "Lors d'une journée privée avec nous, l'équipement lourd est déjà géré : matériel de snorkeling, eau, serviettes et ombre sont inclus, si bien qu'il ne vous faut vraiment que vous-même, votre maillot et votre crème. Vous trouverez ce qui est inclus sur chacune de nos ",
        { text: "excursions d'île", href: LINKS.islandTours },
        ", et les détails d'acompte et de solde sur notre ",
        { text: "FAQ", href: LINKS.faq },
        ". Vous avez réservé un tour de groupe partagé ? Notre site jumeau ",
        { text: "Punta Cana Excursions", href: LINKS.publicSite },
        " indique aussi ce qu'ils incluent, et notre centre d'origine ",
        { text: "de plongée", href: LINKS.diveCenter },
        " fournit tout le matériel les jours en mer.",
      ]),

      quote("Le sac le mieux préparé est celui qu'on remarque à peine porter."),

      para([
        "Pas sûr de ce que votre journée exige ? Dites-nous ce que vous avez réservé — ou ce dont vous rêvez — et nous vous enverrons une liste de bagages sur mesure avec. ",
        { text: "Parlez à notre concierge", href: LINKS.contact },
        " et nous nous occupons du reste.",
      ]),
    ],
  },

  // ── German ─────────────────────────────────────────────────────────────────
  {
    lang: "de",
    slug: "was-einpacken-punta-cana-ausflug",
    title: "Was für einen Ausflug in Punta Cana einpacken: Die Komplette Liste",
    excerpt:
      "Vergessen Sie die Sonnencreme, und mittags ist es vorbei; packen Sie zu viel, und Sie schleppen einen Koffer auf den Katamaran. Die schnörkellose Packliste eines lokalen Teams für jede Art von Ausflug in Punta Cana — und was Sie zurücklassen.",
    seo: {
      metaTitle: "Was für einen Punta-Cana-Ausflug einpacken | Komplette Liste",
      metaDescription:
        "Die schnörkellose Packliste für Ausflüge in Punta Cana: Grundausstattung, Ausrüstung für Wasser- und Abenteuertage, Sonnen- und Mückenschutz, rifffreundliche Sonnencreme und was im Resort bleibt.",
      keywords: [
        "was einpacken punta cana ausflug",
        "packliste punta cana",
        "rifffreundliche sonnencreme punta cana",
        "was mitnehmen insel saona",
        "katamaran packliste",
        "reisetipps punta cana",
      ],
      ogTitle: "Was für einen Ausflug in Punta Cana einpacken: Die Komplette Liste",
      ogDescription:
        "Eine schnörkellose Packliste für jede Art von Ausflug in Punta Cana — und was im Resort bleibt.",
    },
    body: [
      para([
        "Ein gelungener Ausflugstag in Punta Cana steht und fällt mit dem, was in Ihrer Tasche ist. Vergessen Sie die Sonnencreme, und mittags ist es vorbei; packen Sie zu viel, und Sie schleppen einen Koffer auf den Katamaran. Nach Tausenden von Tagen an dieser Küste haben wir immer dieselbe Handvoll Dinge vergessen gesehen — und ebenso viele unnötig mitgeschleppt.",
      ]),
      para([
        "Hier ist die schnörkellose Packliste für einen Ausflug in Punta Cana: was Sie für jede Art von Tag mitnehmen, was das tropische Klima verlangt und was Sie im Resort lassen.",
      ]),

      h2("Die Grundausstattung — für jeden Ausflug"),
      para(["Egal, was Sie gebucht haben, das kommt mit:"]),
      li(["Rifffreundliche Sonnencreme (mehr dazu unten) und ein breitkrempiger Hut."]),
      li(["Sonnenbrille — idealerweise mit Band fürs Boot."]),
      li(["Eine wiederbefüllbare Wasserflasche; die Hitze entzieht Flüssigkeit."]),
      li(["Bargeld in kleinen Scheinen, in US-Dollar und Pesos — praktisch für Trinkgeld und einen am Tag fälligen Restbetrag."]),
      li(["Ihr Handy in einer wasserdichten Hülle, dazu ein Screenshot Ihrer Buchung."]),
      li(["Ein leichtes Überteil oder ein UV-Shirt zum Schutz zwischen den Aktivitäten."]),

      h2("Für Wassertage — Katamaran, Schnorcheln, Saona und Tauchgänge"),
      para(["Wenn Ihr Tag aufs Meer führt, packen Sie zusätzlich:"]),
      li(["Badekleidung unter der Kleidung — Umkleiden sind nicht immer zur Hand."]),
      li(["Ein schnelltrocknendes Reisehandtuch, leichter als ein Strandtuch."]),
      li(["Wasserschuhe für felsige Einstiege und heiße Decks."]),
      li(["Einen wasserdichten Beutel für Handy, Geld und Schlüssel."]),
      li(["Tabletten gegen Seekrankheit, wenn Sie anfällig sind — vor dem Einsteigen einnehmen."]),
      li(["Eine GoPro oder schwimmfähige Handyhülle für den Schnorchelstopp."]),
      para([
        "Auf den meisten unserer ",
        { text: "Katamaran-Tage", href: LINKS.catamarans },
        " und ",
        { text: "Tauch- und Schnorcheltouren", href: LINKS.scubaDiving },
        " ist die Ausrüstung schon an Bord — prüfen Sie die Beschreibung, bevor Sie zu viel einpacken.",
      ]),

      h2("Für Land- und Abenteuertage — Buggys, ATVs, Ziplines und das Cenote"),
      para(["Wenn Ihr Tag an Land stattfindet, tauschen Sie aus:"]),
      li(["Geschlossene, knöchelhohe Schuhe, die kaputtgehen dürfen."]),
      li(["Ein Bandana oder Buff gegen den Staub auf Buggy-Pisten."]),
      li(["Augenschutz — am Steuer eines ATV unverzichtbar."]),
      li(["Kleidung, die Sie in Rente schicken können; Schlamm gehört dazu."]),
      li(["Einen kleinen Rucksack für Kleidungsschichten und Wasser."]),
      para([
        "Jede ",
        { text: "Abenteuertour", href: LINKS.adventure },
        " nennt genau, was Sie anziehen sollten, sowie Alters- oder Größenregeln — vor dem Aufbruch lesenswert.",
      ]),

      h2("Das tropische Klima — packen Sie für Sonne und Mücken"),
      para([
        "Zwei Dinge erwischen Besucher: die Kraft der Sonne und, abseits der windigen Küste, die Mücken. Die ",
        {
          text: "reisemedizinischen Hinweise des CDC zur Dominikanischen Republik",
          href: CITATIONS.cdcDominican,
        },
        " empfehlen Breitband-Sonnencreme, einen Hut und reichlich Flüssigkeit gegen die Hitze, dazu ein EPA-registriertes Insektenschutzmittel (DEET oder Picaridin) und bedeckende Kleidung in der Dämmerung — besonders in den regenreicheren Monaten von Mai bis November. Stecken Sie ein kleines Repellent und Ihre persönlichen Medikamente ein, und das Wesentliche ist abgedeckt.",
      ]),

      h2("Ein kurzes Wort zur Sonnencreme"),
      para([
        "Bitte rifffreundlich. Die Chemikalien vieler gewöhnlicher Sonnencremes — allen voran Oxybenzon und Octinoxat — sind schon in winzigen Mengen giftig für Korallen, ",
        { text: "laut NOAA", href: CITATIONS.noaaSunscreen },
        ", weshalb mehrere Reiseziele sie verboten haben. Achten Sie auf eine mineralische Formel mit Non-Nano-Zinkoxid oder Titandioxid. Die Riffe, die Sie gleich beschnorcheln, werden es Ihnen danken.",
      ]),

      h2("Was im Resort bleibt"),
      para(["Leichter ist besser. Lassen Sie weg:"]),
      li(["Wertsachen und teuren Schmuck — auf einem Boot gibt es keinen sicheren Ort dafür."]),
      li(["Alles, dessen Verlust an Wasser, Sand oder Diebstahl Sie nicht verkraften."]),
      li(["Einwegplastik; nehmen Sie stattdessen eine wiederbefüllbare Flasche mit."]),
      li(["Eine riesige Strandtasche — ein kleiner wasserdichter Beutel reicht."]),
      li(["Eine Drohne, sofern Sie nicht bestätigt haben, dass sie am Zielort erlaubt ist."]),

      h2("Reisen Sie leicht — den Rest bringen wir"),
      para([
        "An einem privaten Tag mit uns ist die schwere Ausrüstung schon geregelt: Schnorchelausrüstung, Wasser, Handtücher und Schatten sind inklusive, sodass Sie wirklich nur sich selbst, Ihre Badekleidung und Sonnencreme brauchen. Was inbegriffen ist, finden Sie bei jedem unserer ",
        { text: "Inselausflüge", href: LINKS.islandTours },
        ", und die Anzahlungs- und Restbetragsdetails in unseren ",
        { text: "FAQ", href: LINKS.faq },
        ". Eine geteilte Gruppentour gebucht? Auch unsere Schwesterseite ",
        { text: "Punta Cana Excursions", href: LINKS.publicSite },
        " listet, was darin enthalten ist, und unser ursprüngliches ",
        { text: "Tauchcenter", href: LINKS.diveCenter },
        " stellt an Wassertagen die gesamte Ausrüstung.",
      ]),

      quote("Die am besten gepackte Tasche ist die, die man kaum zu tragen merkt."),

      para([
        "Nicht sicher, was Ihr Tag verlangt? Sagen Sie uns, was Sie gebucht haben — oder wovon Sie träumen — und wir schicken eine passende Packliste gleich mit. ",
        { text: "Sprechen Sie mit unserem Concierge", href: LINKS.contact },
        ", und wir übernehmen den Rest.",
      ]),
    ],
  },

  // ── Portuguese ───────────────────────────────────────────────────────────────
  {
    lang: "pt",
    slug: "o-que-levar-excursao-punta-cana",
    title: "O Que Levar para uma Excursão em Punta Cana: A Lista Completa",
    excerpt:
      "Esqueça o protetor solar e estará miserável ao meio-dia; leve a mais e acabará a içar uma mala para um catamarã. A lista de bagagem sem rodeios de uma equipa local para cada tipo de excursão em Punta Cana — e o que deixar para trás.",
    seo: {
      metaTitle: "O Que Levar para uma Excursão em Punta Cana | Lista Completa",
      metaDescription:
        "A lista de bagagem direta para excursões em Punta Cana: essenciais, equipamento para dias de água e de aventura, proteção solar e antimosquitos, protetor reef-safe e o que deixar no resort.",
      keywords: [
        "o que levar excursão punta cana",
        "lista de bagagem punta cana",
        "protetor solar reef safe punta cana",
        "o que levar ilha saona",
        "lista catamarã",
        "dicas de viagem punta cana",
      ],
      ogTitle: "O Que Levar para uma Excursão em Punta Cana: A Lista Completa",
      ogDescription:
        "Uma lista de bagagem sem rodeios para cada tipo de excursão em Punta Cana — e o que deixar no resort.",
    },
    body: [
      para([
        "Um bom dia de excursão em Punta Cana depende do que leva na mochila. Esqueça o protetor solar e estará miserável ao meio-dia; leve a mais e acabará a içar uma mala para um catamarã. Depois de milhares de dias nesta costa, vimos esquecer sempre as mesmas coisas — e carregar outras tantas sem necessidade.",
      ]),
      para([
        "Aqui está a lista de bagagem sem rodeios para uma excursão em Punta Cana: o que levar para cada tipo de dia, o que o clima tropical exige e o que deixar no resort.",
      ]),

      h2("O essencial — para qualquer excursão"),
      para(["Seja o que for que reservou, isto vai consigo:"]),
      li(["Protetor solar reef-safe (mais sobre isto abaixo) e um chapéu de aba larga."]),
      li(["Óculos de sol — de preferência com cordão para o barco."]),
      li(["Uma garrafa de água reutilizável; o calor desidrata."]),
      li(["Dinheiro em notas pequenas, em dólares e em pesos — útil para gorjetas e qualquer saldo a pagar no próprio dia."]),
      li(["O telemóvel numa bolsa estanque, mais uma captura de ecrã da sua reserva."]),
      li(["Uma peça leve ou licra de proteção para se abrigar entre atividades."]),

      h2("Para dias de água — catamarã, snorkel, Saona e mergulho"),
      para(["Se o seu dia inclui mar, acrescente:"]),
      li(["Fato de banho vestido por baixo da roupa — nem sempre há balneários à mão."]),
      li(["Uma toalha de viagem de secagem rápida, mais leve do que a de praia."]),
      li(["Sapatos de água para entradas com rochas e conveses quentes."]),
      li(["Um saco estanque para telemóvel, dinheiro e chaves."]),
      li(["Comprimidos para o enjoo se for propenso — tome-os antes de embarcar."]),
      li(["Uma GoPro ou capa flutuante para a paragem de snorkel."]),
      para([
        "Na maioria dos nossos ",
        { text: "dias de catamarã", href: LINKS.catamarans },
        " e de ",
        { text: "mergulho e snorkel", href: LINKS.scubaDiving },
        ", o equipamento já vai a bordo — confira a ficha antes de carregar a mais.",
      ]),

      h2("Para dias de terra e aventura — buggies, ATV, tirolesas e o cenote"),
      para(["Se o seu dia é em terra firme, troque por:"]),
      li(["Calçado fechado acima do tornozelo que não se importe de arruinar."]),
      li(["Um lenço ou buff para a poeira dos caminhos de buggy."]),
      li(["Proteção ocular — essencial ao volante de um ATV."]),
      li(["Roupa que esteja disposto a reformar; a lama faz parte da diversão."]),
      li(["Uma mochila pequena para camadas de roupa e água."]),
      para([
        "Cada ",
        { text: "tour de aventura", href: LINKS.adventure },
        " indica exatamente o que vestir e as regras de idade ou altura — vale a pena ler antes de sair.",
      ]),

      h2("O clima tropical — prepare-se para o sol e os mosquitos"),
      para([
        "Duas coisas apanham os visitantes desprevenidos: a força do sol e, longe da brisa da costa, os mosquitos. As ",
        {
          text: "orientações de saúde para viajantes do CDC sobre a República Dominicana",
          href: CITATIONS.cdcDominican,
        },
        " recomendam protetor de largo espetro, chapéu e muitos líquidos contra o calor, além de um repelente registado pela EPA (DEET ou picaridina) e de se cobrir ao amanhecer e ao anoitecer — sobretudo nos meses mais chuvosos, de maio a novembro. Meta um pequeno repelente e a sua medicação pessoal na mochila e terá o básico tratado.",
      ]),

      h2("Uma palavra sobre o protetor solar"),
      para([
        "Por favor, que seja reef-safe. Os químicos de muitos protetores comuns — a oxibenzona e o octinoxato acima de tudo — são tóxicos para o coral mesmo em quantidades mínimas, ",
        { text: "segundo a NOAA", href: CITATIONS.noaaSunscreen },
        ", razão pela qual vários destinos os proibiram. Procure uma fórmula mineral com óxido de zinco ou dióxido de titânio não nano. Os recifes que vai explorar vão agradecer-lhe.",
      ]),

      h2("O que deixar no resort"),
      para(["Mais leve é melhor. Salte:"]),
      li(["Objetos de valor e joias caras — num barco não há onde os guardar em segurança."]),
      li(["Tudo o que não suportaria perder na água, na areia ou por roubo."]),
      li(["Plásticos de uso único; leve uma garrafa reutilizável."]),
      li(["Um saco de praia enorme — um pequeno saco estanque resolve."]),
      li(["Um drone, a menos que tenha confirmado que é permitido para onde vai."]),

      h2("Viaje leve — nós levamos o resto"),
      para([
        "Num dia privado connosco, o equipamento pesado já está tratado: equipamento de snorkel, água, toalhas e sombra vão incluídos, por isso só precisa mesmo de si, do seu fato de banho e do protetor. Vai encontrar o que está incluído em cada uma das nossas ",
        { text: "excursões de ilha", href: LINKS.islandTours },
        ", e os detalhes de depósito e saldo nas nossas ",
        { text: "perguntas frequentes", href: LINKS.faq },
        ". Reservou um tour de grupo partilhado? O nosso site irmão ",
        { text: "Punta Cana Excursions", href: LINKS.publicSite },
        " também indica o que esses incluem, e o nosso centro original ",
        { text: "de mergulho", href: LINKS.diveCenter },
        " fornece todo o equipamento nos dias de água.",
      ]),

      quote("A melhor mochila é aquela que quase nem dá por que está a carregar."),

      para([
        "Não sabe o que o seu dia exige? Diga-nos o que reservou — ou o que sonha — e enviamos-lhe uma lista de bagagem à medida junto com isso. ",
        { text: "Fale com o nosso concierge", href: LINKS.contact },
        " e tratamos do resto.",
      ]),
    ],
  },

  // ── Italian ────────────────────────────────────────────────────────────────
  {
    lang: "it",
    slug: "cosa-portare-escursione-punta-cana",
    title: "Cosa Portare per un'Escursione a Punta Cana: La Lista Completa",
    excerpt:
      "Dimentica la crema solare e a mezzogiorno sarai a pezzi; carica troppo e ti ritroverai a issare una valigia su un catamarano. La lista bagagli senza fronzoli di un team locale per ogni tipo di escursione a Punta Cana — e cosa lasciare a casa.",
    seo: {
      metaTitle: "Cosa Portare per un'Escursione a Punta Cana | Lista Completa",
      metaDescription:
        "La lista bagagli diretta per le escursioni a Punta Cana: essenziali, attrezzatura per giornate in acqua e d'avventura, protezione sole e zanzare, crema reef-safe e cosa lasciare al resort.",
      keywords: [
        "cosa portare escursione punta cana",
        "lista bagagli punta cana",
        "crema solare reef safe punta cana",
        "cosa portare isola di saona",
        "lista catamarano",
        "consigli di viaggio punta cana",
      ],
      ogTitle: "Cosa Portare per un'Escursione a Punta Cana: La Lista Completa",
      ogDescription:
        "Una lista bagagli senza fronzoli per ogni tipo di escursione a Punta Cana — e cosa lasciare al resort.",
    },
    body: [
      para([
        "Una bella giornata d'escursione a Punta Cana dipende da cosa hai nella borsa. Dimentica la crema solare e a mezzogiorno sarai a pezzi; carica troppo e ti ritroverai a issare una valigia su un catamarano. Dopo migliaia di giornate su questa costa, abbiamo visto dimenticare sempre le stesse cose — e portarne altrettante senza motivo.",
      ]),
      para([
        "Ecco la lista bagagli senza fronzoli per un'escursione a Punta Cana: cosa portare per ogni tipo di giornata, cosa richiede il clima tropicale e cosa lasciare al resort.",
      ]),

      h2("Gli essenziali — per ogni escursione"),
      para(["Qualunque cosa tu abbia prenotato, questo viene con te:"]),
      li(["Crema solare reef-safe (ne parliamo sotto) e un cappello a tesa larga."]),
      li(["Occhiali da sole — meglio con il laccetto per la barca."]),
      li(["Una borraccia riutilizzabile; il caldo disidrata."]),
      li(["Contanti in banconote piccole, in dollari USA e in pesos — comodi per le mance e per eventuali saldi da pagare in giornata."]),
      li(["Il telefono in una custodia stagna, più uno screenshot della prenotazione."]),
      li(["Un capo leggero o una lycra anti-UV per ripararti tra un'attività e l'altra."]),

      h2("Per le giornate in acqua — catamarano, snorkeling, Saona e immersioni"),
      para(["Se la tua giornata è in mare, aggiungi:"]),
      li(["Costume indossato sotto i vestiti — gli spogliatoi non sono sempre a portata."]),
      li(["Un asciugamano da viaggio ad asciugatura rapida, più leggero di uno da spiaggia."]),
      li(["Scarpe da scoglio per gli ingressi rocciosi e i ponti roventi."]),
      li(["Una sacca stagna per telefono, soldi e chiavi."]),
      li(["Pastiglie per il mal di mare se ne soffri — prendile prima di salire a bordo."]),
      li(["Una GoPro o una custodia galleggiante per la sosta snorkeling."]),
      para([
        "Sulla maggior parte delle nostre ",
        { text: "giornate in catamarano", href: LINKS.catamarans },
        " e di ",
        { text: "immersioni e snorkeling", href: LINKS.scubaDiving },
        ", l'attrezzatura è già a bordo — controlla la scheda prima di caricare troppo.",
      ]),

      h2("Per le giornate di terra e avventura — buggy, ATV, zipline e cenote"),
      para(["Se la tua giornata è all'asciutto, sostituisci con:"]),
      li(["Scarpe chiuse e sopra la caviglia che non ti dispiace rovinare."]),
      li(["Un bandana o un buff per la polvere delle piste in buggy."]),
      li(["Protezione per gli occhi — essenziale al volante di un ATV."]),
      li(["Vestiti che puoi mandare in pensione; il fango fa parte del divertimento."]),
      li(["Uno zainetto per gli strati e l'acqua."]),
      para([
        "Ogni ",
        { text: "tour d'avventura", href: LINKS.adventure },
        " indica esattamente cosa indossare e le regole di età o altezza — da leggere prima di partire.",
      ]),

      h2("Il clima tropicale — prepara sole e zanzare"),
      para([
        "Due cose colgono i visitatori alla sprovvista: la forza del sole e, lontano dalla brezza della costa, le zanzare. Le ",
        {
          text: "indicazioni di salute per i viaggiatori del CDC sulla Repubblica Dominicana",
          href: CITATIONS.cdcDominican,
        },
        " raccomandano una crema ad ampio spettro, un cappello e molti liquidi contro il caldo, oltre a un repellente registrato dall'EPA (DEET o picaridina) e a coprirsi all'alba e al tramonto — soprattutto nei mesi più piovosi, da maggio a novembre. Infila un piccolo repellente e i tuoi farmaci personali nella borsa e avrai coperto l'essenziale.",
      ]),

      h2("Due parole sulla crema solare"),
      para([
        "Per favore, che sia reef-safe. Le sostanze chimiche di molte creme comuni — l'ossibenzone e l'octinoxate su tutte — sono tossiche per il corallo anche in quantità minime, ",
        { text: "secondo la NOAA", href: CITATIONS.noaaSunscreen },
        ", motivo per cui diverse destinazioni le hanno vietate. Cerca una formula minerale con ossido di zinco o biossido di titanio non nano. Le barriere che stai per esplorare ti ringrazieranno.",
      ]),

      h2("Cosa lasciare al resort"),
      para(["Più leggero è meglio. Salta:"]),
      li(["Oggetti di valore e gioielli costosi — su una barca non c'è dove tenerli al sicuro."]),
      li(["Tutto ciò che non sopporteresti di perdere in acqua, nella sabbia o per un furto."]),
      li(["Plastica monouso; porta invece una borraccia riutilizzabile."]),
      li(["Una borsa da spiaggia gigante — una piccola sacca stagna basta e avanza."]),
      li(["Un drone, a meno che tu non abbia confermato che è consentito dove vai."]),

      h2("Viaggia leggero — il resto lo portiamo noi"),
      para([
        "In una giornata privata con noi, l'attrezzatura pesante è già risolta: attrezzatura da snorkeling, acqua, asciugamani e ombra sono inclusi, quindi ti servi davvero solo tu, il costume e la crema. Trovi cosa è incluso in ciascuna delle nostre ",
        { text: "escursioni sulle isole", href: LINKS.islandTours },
        ", e i dettagli di acconto e saldo nelle nostre ",
        { text: "domande frequenti", href: LINKS.faq },
        ". Hai prenotato un tour di gruppo condiviso? Anche il nostro sito gemello ",
        { text: "Punta Cana Excursions", href: LINKS.publicSite },
        " indica cosa includono, e il nostro centro originario ",
        { text: "di immersioni", href: LINKS.diveCenter },
        " fornisce tutta l'attrezzatura nelle giornate in acqua.",
      ]),

      quote("La borsa preparata meglio è quella che quasi non ti accorgi di portare."),

      para([
        "Non sei sicuro di cosa richieda la tua giornata? Dicci cosa hai prenotato — o cosa sogni — e ti invieremo una lista bagagli su misura insieme. ",
        { text: "Parla con il nostro concierge", href: LINKS.contact },
        " e pensiamo noi al resto.",
      ]),
    ],
  },
];

// =============================================================================
// Article factory
// =============================================================================

function article(c: ArticleMeta, categoryId: string | undefined) {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: c.title,
    description: c.excerpt,
    inLanguage: c.lang,
    datePublished: PUBLISHED_AT,
    author: {
      "@type": "Organization",
      name: "Punta Cana Private Excursions",
      url: "https://www.puntacanaprivateexcursions.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Punta Cana Private Excursions",
      url: "https://www.puntacanaprivateexcursions.com",
    },
    citation: [
      {
        "@type": "CreativeWork",
        name: "Sunscreen Chemicals and Coral Reefs — NOAA",
        url: CITATIONS.noaaSunscreen,
      },
      {
        "@type": "CreativeWork",
        name: "Dominican Republic — CDC Travelers' Health",
        url: CITATIONS.cdcDominican,
      },
    ],
  });

  return {
    _id: `blogArticle-${GROUP}-${c.lang}`,
    _type: "blogArticle",
    language: c.lang,
    translationGroup: GROUP,
    slug: { _type: "slug", current: c.slug },
    title: c.title,
    excerpt: c.excerpt,
    publishedAt: PUBLISHED_AT,
    readingTime: READING_TIME,
    ...(categoryId
      ? { category: { _type: "reference", _ref: categoryId } }
      : {}),
    body: c.body,
    seo: {
      _type: "seoSingleLanguage",
      metaTitle: c.seo.metaTitle,
      metaDescription: c.seo.metaDescription,
      keywords: c.seo.keywords,
      ogTitle: c.seo.ogTitle,
      ogDescription: c.seo.ogDescription,
      twitterCard: "summary_large_image",
      structuredData,
      noIndex: false,
      noFollow: false,
    },
  };
}

// =============================================================================
// Run
// =============================================================================

async function seed() {
  console.log(`📝 Seeding blog article into ${projectId} / ${dataset}`);
  console.log(`   Translation group: ${GROUP}`);
  console.log(`   Languages: ${ALL_LOCALES.join(", ")}\n`);

  // Sanity check — content covers every supported locale, no duplicates.
  const contentLangs = CONTENT.map((c) => c.lang).sort();
  const expected = [...ALL_LOCALES].sort();
  if (contentLangs.join(",") !== expected.join(",")) {
    console.error(
      `Refusing to run: CONTENT must cover exactly ${expected.join(", ")}.`,
    );
    console.error(`  Got: ${contentLangs.join(", ")}`);
    process.exit(1);
  }

  // Read-only: look up the category _id by slug. We never write a category.
  const cats = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "blogCategory" && defined(slug.current)]{ _id, "slug": slug.current }`,
  );
  const catMap: Record<string, string> = {};
  for (const c of cats) catMap[c.slug] = c._id;
  const categoryId = catMap[CATEGORY_SLUG];
  if (!categoryId) {
    console.warn(
      `⚠️  Category "${CATEGORY_SLUG}" not found. Articles will be seeded without a category reference. Available: ${Object.keys(catMap).join(", ") || "(none)"}`,
    );
  } else {
    console.log(`Linked to category "${CATEGORY_SLUG}" (${categoryId}).\n`);
  }

  const docs = CONTENT.map((c) => article(c, categoryId));

  // Safety guard #1 — this script may ONLY write blogArticle documents.
  if (!docs.every((d) => d._type === "blogArticle")) {
    console.error("Refusing to run: a non-blogArticle document was generated.");
    process.exit(1);
  }

  // Safety guard #2 — every _id must belong to this translation group.
  const allowedIds = new Set(
    ALL_LOCALES.map((l) => `blogArticle-${GROUP}-${l}`),
  );
  if (!docs.every((d) => allowedIds.has(d._id))) {
    console.error(
      "Refusing to run: a doc was generated with an _id outside this seed's allowed set.",
    );
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let i = 0;
  for (const doc of docs) {
    i += 1;
    process.stdout.write(`[${i}/${docs.length}] ${doc._id} ... `);
    try {
      // createIfNotExists: leaves any existing doc at this _id untouched.
      const before = await client.fetch<{ _id: string } | null>(
        `*[_id == $id][0]{ _id }`,
        { id: doc._id },
      );
      await client.createIfNotExists(doc as never);
      if (before) {
        console.log("⏭  already exists — skipped");
        skipped += 1;
      } else {
        console.log("✓ created");
        created += 1;
      }
    } catch (err) {
      console.log("✗");
      console.error(err);
      process.exit(1);
    }
  }

  console.log(
    `\n✅ Done. Created ${created}, skipped ${skipped} (of ${docs.length} total).`,
  );
  console.log(
    "\nNote: featured & OG images were intentionally omitted. Upload them via Studio at /studio before publishing.",
  );
}

seed();
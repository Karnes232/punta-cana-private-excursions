/**
 * Seed ONE blog article — "Punta Cana Adventure Tours: Buggies, Zip-Lines &
 * Catamarans, Ranked" — in all six supported locales (EN, ES, FR, DE, PT, IT).
 *
 * Built on the same long-form template as seedBlogMarineLife.ts.
 *
 * LINKS: inline links via the `link` markDef. Internal links are RELATIVE and
 * point ONLY to stable destinations (category filters, /scuba-diving, /contact)
 * — NO /excursions/[slug] detail pages. Cross-site links and external citations
 * are ABSOLUTE.
 *
 *   NOTE: links only render as <a> tags if your BlockContent renderer defines a
 *   serializer for the `link` mark in @portabletext/react.
 *
 * SAFETY: uses `createIfNotExists` — never overwrites an existing blogArticle,
 * and only READS blogCategory docs to find a reference.
 *
 * Usage:
 *   1. SANITY_API_TOKEN in .env.local (Editor token)
 *   2. npx tsx scripts/seed/seedBlogAdventureTours.ts
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

const GROUP = "punta-cana-adventure-tours-ranked";
const PUBLISHED_AT = "2026-05-20";
const READING_TIME = 8;
const CATEGORY_SLUG = "adventure"; // → blogCategory with slug.current === "adventure"

// Internal (RELATIVE — no /excursions/[slug]) + cross-site link targets
const LINKS = {
  diveCenter: "https://grandbay-puntacana.com", // sister site — dive center / water adrenaline
  publicAdventure:
    "https://puntacana-excursions.com/excursions?category=adventure", // sister site — shared adventure trips
  adventure: "/excursions?category=adventure",
  catamarans: "/excursions?category=catamarans",
  cultureNature: "/excursions?category=culture-nature",
  scubaDiving: "/scuba-diving",
  contact: "/contact",
};

// External citations (authoritative, NON-competitor sources only)
const CITATIONS = {
  godrPuntaCana: "https://www.godominicanrepublic.com/destinations/punta-cana", // DR Ministry of Tourism
  atvSafety: "https://atvsafety.org/the-golden-rules/", // ATV Safety Institute
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
    slug: "punta-cana-adventure-tours-buggies-ziplines-catamarans",
    title: "Punta Cana Adventure Tours: Buggies, Zip-Lines & Catamarans, Ranked",
    excerpt:
      "From a cocktail-in-hand catamaran to a flat-out mud-spattered buggy run, here's our honest ranking of Punta Cana's adventure tours by adrenaline — and who each one is really for.",
    seo: {
      metaTitle: "Punta Cana Adventure Tours Ranked | Buggies, Zip-Lines & More",
      metaDescription:
        "An honest, adrenaline-ranked guide to Punta Cana adventure tours: catamarans, zip-lines and the Hoyo Azul cenote, dune buggies and ATVs, plus diving. Who each is for, and safety tips.",
      keywords: [
        "punta cana adventure tours",
        "dune buggy punta cana",
        "zip line punta cana",
        "hoyo azul cenote",
        "atv punta cana",
        "things to do punta cana adventure",
      ],
      ogTitle: "Punta Cana Adventure Tours: Buggies, Zip-Lines & Catamarans, Ranked",
      ogDescription:
        "Our honest ranking of Punta Cana's adventure tours by adrenaline — and who each one is really for.",
    },
    body: [
      para([
        "There's a moment on every Punta Cana trip when the beach lounger stops being enough. That's when the adventure tours come in — and there are more of them than most visitors realise. The official ",
        { text: "Dominican tourism board", href: CITATIONS.godrPuntaCana },
        " describes the region as a blend of relaxation, adventure and nature, and the adventure half is genuinely good: jungle off-roading, jaw-dropping zip-lines and catamarans built for the kind of day you remember.",
      ]),
      para([
        "We came up through the water — we started as a ",
        { text: "dive center", href: LINKS.diveCenter },
        " — so we have opinions about what's actually thrilling versus what just photographs well. Here's our honest ranking of Punta Cana's adventure tours, from the gentlest rush to the most full-throttle, with who each one suits.",
      ]),

      h2("Ranked by adrenaline"),
      para([
        "Roughly from mellow to maximum. None of these need experience — just a willingness to get a little dirty, wet, or high off the ground.",
      ]),

      h3("1. Catamaran party-sail — the social adventure"),
      para([
        "The gentlest entry on the list, and the most sociable. A catamaran day is sailing, snorkelling, a stop at a natural pool, music and an open bar — adrenaline measured in laughs rather than heart rate. The big choice is shared versus private: a group party-boat is lively and cheap, while a private ",
        { text: "catamaran day", href: LINKS.catamarans },
        " is the same fun without the crowd, on your own clock. Best for: groups, couples and anyone who wants adventure with a cocktail in hand.",
      ]),

      h3("2. Zip-lines and the cenote — adventure with a view"),
      para([
        "Punta Cana's zip-line courses string through the Anamuya foothills and along the cliffs of Cap Cana, including the area's only ocean-view line. Many pair the cables with a via ferrata climb and a swim in Hoyo Azul — a spring-fed turquoise cenote at the foot of a roughly 75-metre limestone cliff, reached by a short rainforest hike. It's heights and harnesses, but with full guiding and gear it's within reach of most reasonably fit travellers. You'll find the cenote and gentler nature days under ",
        { text: "culture & nature", href: LINKS.cultureNature },
        ". Best for: those who want a real rush without an engine — and the best photos of the trip.",
      ]),

      h3("3. Dune buggies and ATVs — the messy, hands-on one"),
      para([
        "This is the one you'll be talking about at dinner — and washing out of your hair. You drive your own buggy or ATV along dirt tracks through the countryside near Macao, splashing through puddles, stopping at a cacao or coffee farm and often a cave or cenote along the way. It's dusty, muddy, loud fun. Because you're behind the wheel, gear matters: the ",
        { text: "ATV Safety Institute", href: CITATIONS.atvSafety },
        " recommends a proper helmet, eye protection, closed over-the-ankle shoes, long sleeves and long trousers — and never riding under the influence. You'll find these under ",
        { text: "adventure", href: LINKS.adventure },
        ". Best for: hands-on thrill-seekers who don't mind getting filthy.",
      ]),

      h3("4. Going below the surface — the diver's adrenaline"),
      para([
        "For us, the biggest rush in Punta Cana isn't on land at all. A guided reef or wreck dive — and, for the certified and bold, even a shark dive — delivers a kind of adventure no zip-line can match. You'll find the options on our ",
        { text: "diving and snorkelling page", href: LINKS.scubaDiving },
        ", and our original ",
        { text: "Grand Bay of the Sea", href: LINKS.diveCenter },
        " dive center runs the serious stuff. Best for: water lovers and anyone who's ever wanted to come face to face with the ocean.",
      ]),

      h2("Which adventure fits your group?"),
      para(["A rough match by who you're travelling with:"]),
      li(["Couples and friends — a catamaran sail, or zip-lines for the views."]),
      li(["Adrenaline junkies — buggies and ATVs, then a dive."]),
      li(["Mixed-ability groups — a private day that pairs a gentle catamaran with an optional buggy add-on."]),
      li(["Photographers — the cenote and zip-line, hands down."]),

      h2("A few adventure-day tips"),
      para(["Small things that make a big difference once the day gets going:"]),
      li(["Dress to ruin it. For buggies, wear clothes and shoes you don't mind destroying — and bring eye protection, which the ATV Safety Institute lists as essential."]),
      li(["Protect your phone. A waterproof pouch or a GoPro saves the day on buggies and catamarans alike."]),
      li(["Sun and water. The tropical sun is strong; pack reef-safe sunscreen, water and a hat."]),
      li(["Book the private version if pace matters. Group adventure tours run on a fixed clock; a private day flexes around you."]),
      li(["Check ages and restrictions. Buggies, zip-lines and dives all have minimum ages, weight limits or health rules — ask before you book."]),

      h2("Booking your adventure day"),
      para([
        "Browse our private adventure tours — buggies, zip-lines and more — alongside catamaran days and gentler nature trips. On a tighter budget? Our sister site ",
        { text: "Punta Cana Excursions", href: LINKS.publicAdventure },
        " runs shared adventure departures. Tell us your group's appetite for adrenaline and we'll build the day to match.",
      ]),

      quote("The beach will still be there when you get back. The adrenaline won't wait."),

      para([
        "Tell us how much adrenaline your group is actually after — from a lazy catamaran to a flat-out buggy day — and we'll build a private adventure around it. ",
        { text: "Talk to our concierge", href: LINKS.contact },
        " and we'll handle the rest.",
      ]),
    ],
  },

  // ── Spanish ────────────────────────────────────────────────────────────────
  {
    lang: "es",
    slug: "tours-de-aventura-punta-cana-buggies-tirolinas-catamaranes",
    title:
      "Tours de Aventura en Punta Cana: Buggies, Tirolinas y Catamaranes, Clasificados",
    excerpt:
      "Desde un catamarán con cóctel en mano hasta una carrera en buggy llena de barro, esta es nuestra clasificación honesta de los tours de aventura de Punta Cana por adrenalina, y para quién es cada uno.",
    seo: {
      metaTitle: "Tours de Aventura en Punta Cana | Buggies, Tirolinas y Más",
      metaDescription:
        "Una guía honesta de los tours de aventura de Punta Cana clasificados por adrenalina: catamaranes, tirolinas y el cenote Hoyo Azul, buggies y ATV, además de buceo. Para quién es cada uno y consejos de seguridad.",
      keywords: [
        "tours de aventura punta cana",
        "buggy punta cana",
        "tirolina punta cana",
        "cenote hoyo azul",
        "atv punta cana",
        "qué hacer en punta cana aventura",
      ],
      ogTitle: "Tours de Aventura en Punta Cana: Buggies, Tirolinas y Catamaranes",
      ogDescription:
        "Nuestra clasificación honesta de los tours de aventura de Punta Cana por adrenalina, y para quién es cada uno.",
    },
    body: [
      para([
        "En cada viaje a Punta Cana llega un momento en que la tumbona de la playa ya no basta. Ahí es donde entran los tours de aventura, y hay más de los que la mayoría imagina. La oficina oficial de ",
        { text: "turismo dominicano", href: CITATIONS.godrPuntaCana },
        " describe la región como una mezcla de relajación, aventura y naturaleza, y la parte de aventura es muy buena: todoterreno por la jungla, tirolinas de quitar el aliento y catamaranes pensados para un día que recordarás.",
      ]),
      para([
        "Venimos del agua —empezamos como un ",
        { text: "centro de buceo", href: LINKS.diveCenter },
        "—, así que tenemos opinión sobre qué emociona de verdad y qué solo queda bien en la foto. Esta es nuestra clasificación honesta de los tours de aventura de Punta Cana, del subidón más suave al más a fondo, y para quién es cada uno.",
      ]),

      h2("Clasificados por adrenalina"),
      para([
        "Más o menos de lo tranquilo a lo máximo. Ninguno requiere experiencia: solo ganas de mancharte un poco, mojarte o subir bien alto.",
      ]),

      h3("1. Catamarán de fiesta — la aventura social"),
      para([
        "La entrada más suave de la lista y la más sociable. Un día de catamarán es navegar, hacer snorkel, parar en una piscina natural, música y barra libre: adrenalina que se mide en risas y no en pulsaciones. La gran decisión es compartido o privado: un barco de grupo es animado y barato, mientras que un ",
        { text: "día de catamarán", href: LINKS.catamarans },
        " privado es la misma diversión sin la multitud y a tu ritmo. Ideal para: grupos, parejas y quien quiera aventura con un cóctel en la mano.",
      ]),

      h3("2. Tirolinas y el cenote — aventura con vistas"),
      para([
        "Los circuitos de tirolina de Punta Cana recorren las estribaciones de Anamuya y los acantilados de Cap Cana, incluida la única línea con vista al mar de la zona. Muchos combinan los cables con una vía ferrata y un baño en Hoyo Azul, un cenote turquesa de aguas de manantial al pie de un acantilado de piedra caliza de unos 75 metros, al que se llega tras una corta caminata por la selva. Son alturas y arneses, pero con guía y equipo completos está al alcance de la mayoría de viajeros en forma razonable. El cenote y los días de naturaleza más suaves los encontrarás en ",
        { text: "cultura y naturaleza", href: LINKS.cultureNature },
        ". Ideal para: quien quiera un subidón real sin motor, y las mejores fotos del viaje.",
      ]),

      h3("3. Buggies y ATV — el sucio y manos a la obra"),
      para([
        "Este es del que hablarás en la cena, y que te quitarás del pelo. Conduces tu propio buggy o ATV por caminos de tierra en el campo cerca de Macao, salpicando charcos, parando en una finca de cacao o café y, a menudo, en una cueva o cenote por el camino. Es diversión polvorienta, embarrada y ruidosa. Como vas al volante, el equipo importa: el ",
        { text: "ATV Safety Institute", href: CITATIONS.atvSafety },
        " recomienda un buen casco, protección ocular, calzado cerrado por encima del tobillo, mangas largas y pantalón largo, y nunca conducir bajo los efectos del alcohol. Los encontrarás en ",
        { text: "aventura", href: LINKS.adventure },
        ". Ideal para: buscadores de emociones manos a la obra a quienes no les importa acabar embarrados.",
      ]),

      h3("4. Bajo la superficie — la adrenalina del buceador"),
      para([
        "Para nosotros, el mayor subidón de Punta Cana no está en tierra. Una inmersión guiada en arrecife o naufragio —y, para los certificados y atrevidos, hasta un buceo con tiburones— ofrece un tipo de aventura que ninguna tirolina iguala. Encontrarás las opciones en nuestra ",
        { text: "página de buceo y snorkel", href: LINKS.scubaDiving },
        ", y nuestro centro original ",
        { text: "Grand Bay of the Sea", href: LINKS.diveCenter },
        " se encarga de lo serio. Ideal para: amantes del agua y cualquiera que haya querido mirar al océano cara a cara.",
      ]),

      h2("¿Qué aventura encaja con tu grupo?"),
      para(["Una correspondencia aproximada según con quién viajes:"]),
      li(["Parejas y amigos — un paseo en catamarán o tirolinas por las vistas."]),
      li(["Adictos a la adrenalina — buggies y ATV, y luego un buceo."]),
      li(["Grupos de distinto nivel — un día privado que combine un catamarán tranquilo con un buggy opcional."]),
      li(["Fotógrafos — el cenote y la tirolina, sin duda."]),

      h2("Algunos consejos para el día de aventura"),
      para(["Pequeñas cosas que marcan la diferencia cuando el día arranca:"]),
      li(["Vístete para destrozarlo. Para los buggies, lleva ropa y calzado que no te importe arruinar, y protección ocular, que el ATV Safety Institute considera esencial."]),
      li(["Protege el móvil. Una funda estanca o una GoPro te salvan el día tanto en buggies como en catamaranes."]),
      li(["Sol y agua. El sol tropical es fuerte; lleva protector respetuoso con el arrecife, agua y sombrero."]),
      li(["Reserva la versión privada si el ritmo importa. Los tours de grupo van con reloj fijo; un día privado se adapta a ti."]),
      li(["Comprueba edades y restricciones. Buggies, tirolinas y buceos tienen edades mínimas, límites de peso o normas de salud: pregunta antes de reservar."]),

      h2("Reservar tu día de aventura"),
      para([
        "Explora nuestros tours de aventura privados —buggies, tirolinas y más— junto a los días de catamarán y las salidas de naturaleza más suaves. ¿Presupuesto más ajustado? Nuestro sitio hermano ",
        { text: "Punta Cana Excursions", href: LINKS.publicAdventure },
        " organiza salidas de aventura compartidas. Dinos cuánta adrenalina quiere tu grupo y montamos el día a medida.",
      ]),

      quote("La playa seguirá ahí cuando vuelvas. La adrenalina no espera."),

      para([
        "Dinos cuánta adrenalina busca de verdad tu grupo —de un catamarán tranquilo a un día de buggy a fondo— y montaremos una aventura privada a su alrededor. ",
        { text: "Habla con nuestro concierge", href: LINKS.contact },
        " y nosotros nos encargamos del resto.",
      ]),
    ],
  },

  // ── French ─────────────────────────────────────────────────────────────────
  {
    lang: "fr",
    slug: "tours-aventure-punta-cana-buggys-tyroliennes-catamarans",
    title:
      "Excursions Aventure à Punta Cana : Buggys, Tyroliennes et Catamarans, Classés",
    excerpt:
      "D'un catamaran cocktail à la main à une virée en buggy maculée de boue, voici notre classement honnête des excursions aventure de Punta Cana selon l'adrénaline — et pour qui chacune est vraiment faite.",
    seo: {
      metaTitle: "Excursions Aventure à Punta Cana | Buggys, Tyroliennes et Plus",
      metaDescription:
        "Un guide honnête des excursions aventure de Punta Cana classées par adrénaline : catamarans, tyroliennes et le cénote Hoyo Azul, buggys et quads, plus la plongée. Pour qui, et conseils de sécurité.",
      keywords: [
        "excursions aventure punta cana",
        "buggy punta cana",
        "tyrolienne punta cana",
        "cénote hoyo azul",
        "quad punta cana",
        "que faire à punta cana aventure",
      ],
      ogTitle: "Excursions Aventure à Punta Cana : Buggys, Tyroliennes et Catamarans",
      ogDescription:
        "Notre classement honnête des excursions aventure de Punta Cana selon l'adrénaline — et pour qui chacune est vraiment faite.",
    },
    body: [
      para([
        "À chaque séjour à Punta Cana arrive un moment où le transat ne suffit plus. C'est là qu'interviennent les excursions aventure — et il y en a plus que la plupart des visiteurs ne le pensent. L'office officiel du ",
        { text: "tourisme dominicain", href: CITATIONS.godrPuntaCana },
        " décrit la région comme un mélange de détente, d'aventure et de nature, et la partie aventure est vraiment réussie : tout-terrain dans la jungle, tyroliennes à couper le souffle et catamarans pensés pour une journée mémorable.",
      ]),
      para([
        "Nous venons de l'eau — nous avons débuté comme ",
        { text: "centre de plongée", href: LINKS.diveCenter },
        " —, alors nous avons un avis sur ce qui procure vraiment des sensations et ce qui ne fait que bien rendre en photo. Voici notre classement honnête des excursions aventure de Punta Cana, du frisson le plus doux au plus déchaîné, et à qui chacune convient.",
      ]),

      h2("Classées par adrénaline"),
      para([
        "Grosso modo du tranquille au maximum. Aucune ne demande d'expérience — juste l'envie de se salir un peu, de se mouiller ou de prendre de la hauteur.",
      ]),

      h3("1. Le catamaran festif — l'aventure conviviale"),
      para([
        "L'entrée la plus douce de la liste, et la plus conviviale. Une journée en catamaran, c'est de la voile, du snorkeling, un arrêt à une piscine naturelle, de la musique et un open bar — une adrénaline qui se mesure en éclats de rire plutôt qu'en pulsations. Le grand choix : partagé ou privé. Un bateau de groupe est animé et bon marché, tandis qu'une ",
        { text: "journée en catamaran", href: LINKS.catamarans },
        " privée offre le même plaisir sans la foule et à votre rythme. Idéal pour : les groupes, les couples et tous ceux qui veulent de l'aventure un cocktail à la main.",
      ]),

      h3("2. Tyroliennes et cénote — l'aventure avec vue"),
      para([
        "Les parcours de tyroliennes de Punta Cana serpentent dans les contreforts d'Anamuya et le long des falaises de Cap Cana, dont la seule ligne avec vue sur l'océan de la région. Beaucoup associent les câbles à une via ferrata et à une baignade dans Hoyo Azul — un cénote turquoise alimenté par une source, au pied d'une falaise calcaire d'environ 75 mètres, atteint après une courte marche en forêt. Ce sont des hauteurs et des baudriers, mais avec encadrement et matériel complets, c'est à la portée de la plupart des voyageurs en forme correcte. Vous trouverez le cénote et les journées nature plus douces dans ",
        { text: "culture et nature", href: LINKS.cultureNature },
        ". Idéal pour : ceux qui veulent un vrai frisson sans moteur — et les plus belles photos du séjour.",
      ]),

      h3("3. Buggys et quads — le salissant, les mains dans le cambouis"),
      para([
        "C'est celui dont vous parlerez au dîner — et que vous laverez de vos cheveux. Vous conduisez votre propre buggy ou quad sur des pistes de terre dans la campagne près de Macao, en éclaboussant les flaques, avec un arrêt dans une ferme de cacao ou de café et souvent une grotte ou un cénote en chemin. C'est poussiéreux, boueux et bruyant. Comme vous êtes au volant, l'équipement compte : l'",
        { text: "ATV Safety Institute", href: CITATIONS.atvSafety },
        " recommande un bon casque, une protection des yeux, des chaussures fermées montantes, des manches longues et un pantalon long — et de ne jamais conduire sous l'influence de l'alcool. Vous les trouverez dans ",
        { text: "aventure", href: LINKS.adventure },
        ". Idéal pour : les amateurs de sensations qui aiment mettre les mains dans le cambouis et ne craignent pas la boue.",
      ]),

      h3("4. Sous la surface — l'adrénaline du plongeur"),
      para([
        "Pour nous, le plus grand frisson de Punta Cana n'est pas du tout sur terre. Une plongée guidée sur récif ou épave — et, pour les certifiés et audacieux, même une plongée avec les requins — offre une aventure qu'aucune tyrolienne n'égale. Vous trouverez les options sur notre ",
        { text: "page plongée et snorkeling", href: LINKS.scubaDiving },
        ", et notre centre d'origine ",
        { text: "Grand Bay of the Sea", href: LINKS.diveCenter },
        " s'occupe des choses sérieuses. Idéal pour : les amoureux de l'eau et quiconque a déjà rêvé de se retrouver face à face avec l'océan.",
      ]),

      h2("Quelle aventure pour votre groupe ?"),
      para(["Une correspondance approximative selon vos compagnons de voyage :"]),
      li(["Couples et amis — une sortie en catamaran, ou des tyroliennes pour les vues."]),
      li(["Accros à l'adrénaline — buggys et quads, puis une plongée."]),
      li(["Groupes de niveaux mixtes — une journée privée associant un catamaran tranquille à un buggy en option."]),
      li(["Photographes — le cénote et la tyrolienne, sans hésiter."]),

      h2("Quelques conseils pour la journée aventure"),
      para(["De petites choses qui changent tout une fois la journée lancée :"]),
      li(["Habillez-vous pour le sacrifier. Pour les buggys, portez des vêtements et des chaussures que vous ne craignez pas d'abîmer — et emportez une protection des yeux, que l'ATV Safety Institute juge essentielle."]),
      li(["Protégez votre téléphone. Une pochette étanche ou une GoPro sauve la journée, en buggy comme en catamaran."]),
      li(["Soleil et eau. Le soleil tropical est fort ; emportez une crème respectueuse des récifs, de l'eau et un chapeau."]),
      li(["Réservez la version privée si le rythme compte. Les tours de groupe suivent une horloge fixe ; une journée privée s'adapte à vous."]),
      li(["Vérifiez âges et restrictions. Buggys, tyroliennes et plongées ont tous un âge minimum, des limites de poids ou des règles de santé — demandez avant de réserver."]),

      h2("Réserver votre journée aventure"),
      para([
        "Parcourez nos excursions aventure privées — buggys, tyroliennes et plus — aux côtés des journées en catamaran et des sorties nature plus douces. Budget plus serré ? Notre site jumeau ",
        { text: "Punta Cana Excursions", href: LINKS.publicAdventure },
        " propose des départs aventure partagés. Dites-nous l'appétit d'adrénaline de votre groupe et nous bâtirons la journée en conséquence.",
      ]),

      quote("La plage sera encore là à votre retour. L'adrénaline, elle, n'attendra pas."),

      para([
        "Dites-nous combien d'adrénaline votre groupe veut vraiment — d'un catamaran paresseux à une journée buggy à fond — et nous bâtirons une aventure privée sur mesure. ",
        { text: "Parlez à notre concierge", href: LINKS.contact },
        " et nous nous occupons du reste.",
      ]),
    ],
  },

  // ── German ─────────────────────────────────────────────────────────────────
  {
    lang: "de",
    slug: "abenteuer-touren-punta-cana-buggys-ziplines-katamarane",
    title:
      "Abenteuertouren in Punta Cana: Buggys, Ziplines und Katamarane im Ranking",
    excerpt:
      "Vom Katamaran mit Cocktail in der Hand bis zur schlammbespritzten Buggy-Fahrt — hier ist unser ehrliches Ranking der Abenteuertouren von Punta Cana nach Adrenalin, und für wen jede wirklich gemacht ist.",
    seo: {
      metaTitle: "Abenteuertouren Punta Cana im Ranking | Buggys, Ziplines & mehr",
      metaDescription:
        "Ein ehrlicher, nach Adrenalin sortierter Leitfaden zu Abenteuertouren in Punta Cana: Katamarane, Ziplines und das Hoyo-Azul-Cenote, Buggys und ATVs, dazu Tauchen. Für wen, plus Sicherheitstipps.",
      keywords: [
        "abenteuertouren punta cana",
        "buggy punta cana",
        "zipline punta cana",
        "cenote hoyo azul",
        "atv punta cana",
        "punta cana aktivitäten abenteuer",
      ],
      ogTitle: "Abenteuertouren in Punta Cana: Buggys, Ziplines und Katamarane im Ranking",
      ogDescription:
        "Unser ehrliches Ranking der Abenteuertouren von Punta Cana nach Adrenalin — und für wen jede wirklich gemacht ist.",
    },
    body: [
      para([
        "Auf jeder Punta-Cana-Reise kommt der Moment, in dem die Strandliege nicht mehr reicht. Dann sind die Abenteuertouren dran — und davon gibt es mehr, als die meisten Besucher ahnen. Das offizielle ",
        { text: "dominikanische Tourismusamt", href: CITATIONS.godrPuntaCana },
        " beschreibt die Region als Mischung aus Erholung, Abenteuer und Natur, und die Abenteuerhälfte ist richtig gut: Offroad durch den Dschungel, atemberaubende Ziplines und Katamarane für genau den Tag, an den man sich erinnert.",
      ]),
      para([
        "Wir kommen vom Wasser — wir haben als ",
        { text: "Tauchcenter", href: LINKS.diveCenter },
        " begonnen — und haben daher eine Meinung dazu, was wirklich Nervenkitzel bietet und was nur gut aussieht auf dem Foto. Hier ist unser ehrliches Ranking der Abenteuertouren von Punta Cana, vom sanftesten Kick bis zum vollen Vollgas, und für wen sich jede eignet.",
      ]),

      h2("Nach Adrenalin sortiert"),
      para([
        "Grob von gemächlich bis maximal. Keine davon braucht Erfahrung — nur die Bereitschaft, sich ein wenig schmutzig zu machen, nass zu werden oder hoch hinauszugehen.",
      ]),

      h3("1. Katamaran-Partysegeln — das gesellige Abenteuer"),
      para([
        "Der sanfteste Eintrag der Liste und der geselligste. Ein Katamaran-Tag bedeutet Segeln, Schnorcheln, einen Stopp am Naturpool, Musik und eine Open Bar — Adrenalin, gemessen in Gelächter statt in Herzschlag. Die große Entscheidung: geteilt oder privat. Ein Gruppen-Partyboot ist lebhaft und günstig, während ein privater ",
        { text: "Katamaran-Tag", href: LINKS.catamarans },
        " denselben Spaß ohne Menge und nach Ihrer Uhr bietet. Ideal für: Gruppen, Paare und alle, die Abenteuer mit einem Cocktail in der Hand wollen.",
      ]),

      h3("2. Ziplines und das Cenote — Abenteuer mit Aussicht"),
      para([
        "Punta Canas Zipline-Parcours ziehen sich durch die Ausläufer von Anamuya und entlang der Klippen von Cap Cana, darunter die einzige Linie der Gegend mit Meerblick. Viele verbinden die Seile mit einer Via ferrata und einem Bad im Hoyo Azul — einem quellgespeisten, türkisen Cenote am Fuß einer rund 75 Meter hohen Kalksteinklippe, erreichbar über eine kurze Wanderung durch den Regenwald. Es geht um Höhe und Klettergurte, doch mit voller Führung und Ausrüstung ist es für die meisten halbwegs fitten Reisenden machbar. Das Cenote und sanftere Naturtage finden Sie unter ",
        { text: "Kultur & Natur", href: LINKS.cultureNature },
        ". Ideal für: alle, die einen echten Kick ohne Motor wollen — und die besten Fotos der Reise.",
      ]),

      h3("3. Buggys und ATVs — der schmutzige zum Anpacken"),
      para([
        "Das ist der, von dem Sie beim Abendessen erzählen — und den Sie sich aus den Haaren waschen. Sie fahren Ihren eigenen Buggy oder ATV über Schotterpisten durchs Hinterland bei Macao, durch Pfützen spritzend, mit einem Halt an einer Kakao- oder Kaffeefarm und oft einer Höhle oder einem Cenote unterwegs. Staubiger, schlammiger, lauter Spaß. Weil Sie am Steuer sitzen, zählt die Ausrüstung: Das ",
        { text: "ATV Safety Institute", href: CITATIONS.atvSafety },
        " empfiehlt einen ordentlichen Helm, Augenschutz, geschlossene knöchelhohe Schuhe, lange Ärmel und lange Hosen — und niemals unter Einfluss zu fahren. Sie finden sie unter ",
        { text: "Abenteuer", href: LINKS.adventure },
        ". Ideal für: praktische Nervenkitzel-Sucher, denen Schmutz nichts ausmacht.",
      ]),

      h3("4. Unter die Oberfläche — das Adrenalin des Tauchers"),
      para([
        "Für uns ist der größte Kick in Punta Cana gar nicht an Land. Ein geführter Riff- oder Wracktauchgang — und für Zertifizierte und Mutige sogar ein Haitauchgang — liefert ein Abenteuer, das keine Zipline erreicht. Die Optionen finden Sie auf unserer ",
        { text: "Seite für Tauchen und Schnorcheln", href: LINKS.scubaDiving },
        ", und unser ursprüngliches Tauchcenter ",
        { text: "Grand Bay of the Sea", href: LINKS.diveCenter },
        " übernimmt das Ernsthafte. Ideal für: Wasserliebhaber und alle, die dem Ozean schon immer Auge in Auge begegnen wollten.",
      ]),

      h2("Welches Abenteuer passt zu Ihrer Gruppe?"),
      para(["Eine grobe Zuordnung danach, mit wem Sie reisen:"]),
      li(["Paare und Freunde — eine Katamaranfahrt oder Ziplines für die Aussicht."]),
      li(["Adrenalinjunkies — Buggys und ATVs, danach ein Tauchgang."]),
      li(["Gruppen mit gemischtem Niveau — ein privater Tag, der einen ruhigen Katamaran mit einem optionalen Buggy verbindet."]),
      li(["Fotografen — das Cenote und die Zipline, ganz klar."]),

      h2("Ein paar Tipps für den Abenteuertag"),
      para(["Kleinigkeiten, die viel ausmachen, sobald der Tag in Fahrt kommt:"]),
      li(["Ziehen Sie sich zum Ruinieren an. Für Buggys tragen Sie Kleidung und Schuhe, die kaputtgehen dürfen — und nehmen Sie Augenschutz mit, den das ATV Safety Institute als unverzichtbar nennt."]),
      li(["Schützen Sie Ihr Handy. Eine wasserdichte Hülle oder eine GoPro rettet den Tag — bei Buggys wie bei Katamaranen."]),
      li(["Sonne und Wasser. Die tropische Sonne ist stark; packen Sie rifffreundliche Sonnencreme, Wasser und einen Hut ein."]),
      li(["Buchen Sie die private Variante, wenn das Tempo zählt. Gruppentouren laufen nach fester Uhr; ein privater Tag richtet sich nach Ihnen."]),
      li(["Prüfen Sie Alter und Einschränkungen. Buggys, Ziplines und Tauchgänge haben Mindestalter, Gewichtsgrenzen oder Gesundheitsregeln — fragen Sie vor der Buchung."]),

      h2("Ihren Abenteuertag buchen"),
      para([
        "Stöbern Sie in unseren privaten Abenteuertouren — Buggys, Ziplines und mehr — neben Katamarantagen und sanfteren Naturausflügen. Knapperes Budget? Unsere Schwesterseite ",
        { text: "Punta Cana Excursions", href: LINKS.publicAdventure },
        " bietet geteilte Abenteuerabfahrten. Sagen Sie uns den Adrenalinappetit Ihrer Gruppe, und wir bauen den passenden Tag.",
      ]),

      quote("Der Strand ist noch da, wenn Sie zurückkommen. Das Adrenalin wartet nicht."),

      para([
        "Sagen Sie uns, wie viel Adrenalin Ihre Gruppe wirklich will — vom faulen Katamaran bis zum vollen Buggy-Tag — und wir bauen ein privates Abenteuer darum herum. ",
        { text: "Sprechen Sie mit unserem Concierge", href: LINKS.contact },
        ", und wir übernehmen den Rest.",
      ]),
    ],
  },

  // ── Portuguese ───────────────────────────────────────────────────────────────
  {
    lang: "pt",
    slug: "tours-de-aventura-punta-cana-buggies-tirolesas-catamaras",
    title:
      "Tours de Aventura em Punta Cana: Buggies, Tirolesas e Catamarãs, Classificados",
    excerpt:
      "De um catamarã com cocktail na mão a uma corrida de buggy cheia de lama, esta é a nossa classificação honesta dos tours de aventura de Punta Cana por adrenalina — e para quem é cada um.",
    seo: {
      metaTitle: "Tours de Aventura em Punta Cana | Buggies, Tirolesas e Mais",
      metaDescription:
        "Um guia honesto dos tours de aventura de Punta Cana classificados por adrenalina: catamarãs, tirolesas e o cenote Hoyo Azul, buggies e ATV, além de mergulho. Para quem é cada um e dicas de segurança.",
      keywords: [
        "tours de aventura punta cana",
        "buggy punta cana",
        "tirolesa punta cana",
        "cenote hoyo azul",
        "atv punta cana",
        "o que fazer em punta cana aventura",
      ],
      ogTitle: "Tours de Aventura em Punta Cana: Buggies, Tirolesas e Catamarãs",
      ogDescription:
        "A nossa classificação honesta dos tours de aventura de Punta Cana por adrenalina — e para quem é cada um.",
    },
    body: [
      para([
        "Em cada viagem a Punta Cana chega um momento em que a espreguiçadeira deixa de bastar. É aí que entram os tours de aventura — e há mais do que a maioria imagina. O organismo oficial de ",
        { text: "turismo dominicano", href: CITATIONS.godrPuntaCana },
        " descreve a região como uma mistura de descanso, aventura e natureza, e a parte da aventura é mesmo boa: todo-o-terreno pela selva, tirolesas de cortar a respiração e catamarãs pensados para um dia memorável.",
      ]),
      para([
        "Viemos da água — começámos como um ",
        { text: "centro de mergulho", href: LINKS.diveCenter },
        " —, por isso temos opinião sobre o que emociona de verdade e o que só fica bem na foto. Esta é a nossa classificação honesta dos tours de aventura de Punta Cana, do arrepio mais suave ao mais a fundo, e para quem é cada um.",
      ]),

      h2("Classificados por adrenalina"),
      para([
        "Mais ou menos do tranquilo ao máximo. Nenhum exige experiência — só vontade de se sujar um pouco, molhar-se ou subir bem alto.",
      ]),

      h3("1. Catamarã de festa — a aventura social"),
      para([
        "A entrada mais suave da lista e a mais sociável. Um dia de catamarã é velejar, fazer snorkel, parar numa piscina natural, música e bar aberto — adrenalina medida em gargalhadas, não em batimentos. A grande decisão é partilhado ou privado: um barco de grupo é animado e barato, enquanto um ",
        { text: "dia de catamarã", href: LINKS.catamarans },
        " privado é a mesma diversão sem a multidão e ao seu ritmo. Ideal para: grupos, casais e quem quer aventura com um cocktail na mão.",
      ]),

      h3("2. Tirolesas e o cenote — aventura com vista"),
      para([
        "Os percursos de tirolesa de Punta Cana atravessam as encostas de Anamuya e os penhascos de Cap Cana, incluindo a única linha com vista para o mar da zona. Muitos combinam os cabos com uma via ferrata e um mergulho em Hoyo Azul — um cenote turquesa de águas de nascente, ao pé de um penhasco calcário de cerca de 75 metros, alcançado após uma curta caminhada pela floresta. São alturas e arneses, mas com orientação e equipamento completos está ao alcance da maioria dos viajantes em forma razoável. O cenote e os dias de natureza mais suaves encontra-os em ",
        { text: "cultura e natureza", href: LINKS.cultureNature },
        ". Ideal para: quem quer um arrepio a sério sem motor — e as melhores fotos da viagem.",
      ]),

      h3("3. Buggies e ATV — o sujo, de mãos na massa"),
      para([
        "Este é o que vai contar ao jantar — e tirar do cabelo. Conduz o seu próprio buggy ou ATV por caminhos de terra no campo perto de Macao, salpicando poças, parando numa quinta de cacau ou café e, muitas vezes, numa gruta ou cenote pelo caminho. É diversão poeirenta, enlameada e barulhenta. Como vai ao volante, o equipamento importa: o ",
        { text: "ATV Safety Institute", href: CITATIONS.atvSafety },
        " recomenda um bom capacete, proteção ocular, calçado fechado acima do tornozelo, mangas compridas e calças compridas — e nunca conduzir sob o efeito do álcool. Encontra-os em ",
        { text: "aventura", href: LINKS.adventure },
        ". Ideal para: amantes de emoções de mãos na massa que não se importam de acabar enlameados.",
      ]),

      h3("4. Por baixo da superfície — a adrenalina do mergulhador"),
      para([
        "Para nós, o maior arrepio de Punta Cana nem sequer é em terra. Um mergulho guiado em recife ou naufrágio — e, para os certificados e ousados, até um mergulho com tubarões — oferece um tipo de aventura que nenhuma tirolesa iguala. Encontra as opções na nossa ",
        { text: "página de mergulho e snorkel", href: LINKS.scubaDiving },
        ", e o nosso centro original ",
        { text: "Grand Bay of the Sea", href: LINKS.diveCenter },
        " trata do que é a sério. Ideal para: amantes da água e qualquer um que sempre quis olhar o oceano cara a cara.",
      ]),

      h2("Que aventura encaixa no seu grupo?"),
      para(["Uma correspondência aproximada conforme com quem viaja:"]),
      li(["Casais e amigos — um passeio de catamarã, ou tirolesas pelas vistas."]),
      li(["Viciados em adrenalina — buggies e ATV, e depois um mergulho."]),
      li(["Grupos de níveis diferentes — um dia privado que junta um catamarã tranquilo a um buggy opcional."]),
      li(["Fotógrafos — o cenote e a tirolesa, sem dúvida."]),

      h2("Algumas dicas para o dia de aventura"),
      para(["Pequenas coisas que fazem grande diferença quando o dia arranca:"]),
      li(["Vista-se para estragar. Para os buggies, leve roupa e calçado que não se importe de arruinar — e proteção ocular, que o ATV Safety Institute considera essencial."]),
      li(["Proteja o telemóvel. Uma bolsa estanque ou uma GoPro salvam o dia, tanto em buggies como em catamarãs."]),
      li(["Sol e água. O sol tropical é forte; leve protetor amigo do recife, água e chapéu."]),
      li(["Reserve a versão privada se o ritmo importa. Os tours de grupo seguem um relógio fixo; um dia privado adapta-se a si."]),
      li(["Verifique idades e restrições. Buggies, tirolesas e mergulhos têm idades mínimas, limites de peso ou regras de saúde — pergunte antes de reservar."]),

      h2("Reservar o seu dia de aventura"),
      para([
        "Explore os nossos tours de aventura privados — buggies, tirolesas e mais — a par dos dias de catamarã e das saídas de natureza mais suaves. Orçamento mais apertado? O nosso site irmão ",
        { text: "Punta Cana Excursions", href: LINKS.publicAdventure },
        " tem saídas de aventura partilhadas. Diga-nos o apetite de adrenalina do seu grupo e montamos o dia à medida.",
      ]),

      quote("A praia continuará lá quando voltar. A adrenalina não espera."),

      para([
        "Diga-nos quanta adrenalina o seu grupo procura mesmo — de um catamarã tranquilo a um dia de buggy a fundo — e montamos uma aventura privada à volta disso. ",
        { text: "Fale com o nosso concierge", href: LINKS.contact },
        " e tratamos do resto.",
      ]),
    ],
  },

  // ── Italian ────────────────────────────────────────────────────────────────
  {
    lang: "it",
    slug: "tour-avventura-punta-cana-buggy-zipline-catamarani",
    title:
      "Tour d'Avventura a Punta Cana: Buggy, Zipline e Catamarani, in Classifica",
    excerpt:
      "Da un catamarano con cocktail in mano a una corsa in buggy infangata, ecco la nostra classifica onesta dei tour d'avventura di Punta Cana per adrenalina — e per chi è davvero ciascuno.",
    seo: {
      metaTitle: "Tour d'Avventura a Punta Cana | Buggy, Zipline e Altro",
      metaDescription:
        "Una guida onesta ai tour d'avventura di Punta Cana in classifica per adrenalina: catamarani, zipline e il cenote Hoyo Azul, buggy e ATV, più le immersioni. Per chi sono e consigli di sicurezza.",
      keywords: [
        "tour avventura punta cana",
        "buggy punta cana",
        "zipline punta cana",
        "cenote hoyo azul",
        "atv punta cana",
        "cosa fare a punta cana avventura",
      ],
      ogTitle: "Tour d'Avventura a Punta Cana: Buggy, Zipline e Catamarani, in Classifica",
      ogDescription:
        "La nostra classifica onesta dei tour d'avventura di Punta Cana per adrenalina — e per chi è davvero ciascuno.",
    },
    body: [
      para([
        "In ogni viaggio a Punta Cana arriva il momento in cui il lettino in spiaggia non basta più. È lì che entrano in scena i tour d'avventura — e ce ne sono più di quanti la maggior parte dei visitatori immagini. L'ente ufficiale del ",
        { text: "turismo dominicano", href: CITATIONS.godrPuntaCana },
        " descrive la regione come un mix di relax, avventura e natura, e la parte avventura è davvero buona: fuoristrada nella giungla, zipline mozzafiato e catamarani pensati per una giornata da ricordare.",
      ]),
      para([
        "Veniamo dall'acqua — siamo nati come ",
        { text: "centro immersioni", href: LINKS.diveCenter },
        " —, quindi abbiamo un'opinione su cosa emoziona davvero e cosa fa solo bella figura in foto. Ecco la nostra classifica onesta dei tour d'avventura di Punta Cana, dal brivido più dolce al più sfrenato, e per chi è adatto ciascuno.",
      ]),

      h2("In classifica per adrenalina"),
      para([
        "Più o meno dal tranquillo al massimo. Nessuno richiede esperienza — solo la voglia di sporcarsi un po', bagnarsi o salire in alto.",
      ]),

      h3("1. Catamarano party — l'avventura social"),
      para([
        "La voce più tranquilla della lista e la più socievole. Una giornata in catamarano è vela, snorkeling, una sosta in una piscina naturale, musica e open bar — adrenalina misurata in risate più che in battiti. La grande scelta è condiviso o privato: una barca di gruppo è vivace ed economica, mentre una ",
        { text: "giornata in catamarano", href: LINKS.catamarans },
        " privata offre lo stesso divertimento senza la folla e con i tuoi tempi. Ideale per: gruppi, coppie e chiunque voglia avventura con un cocktail in mano.",
      ]),

      h3("2. Zipline e cenote — avventura con vista"),
      para([
        "I percorsi di zipline di Punta Cana si snodano tra le pendici dell'Anamuya e lungo le scogliere di Cap Cana, inclusa l'unica linea con vista sull'oceano della zona. Molti abbinano i cavi a una via ferrata e a un bagno nell'Hoyo Azul — un cenote turchese alimentato da una sorgente, ai piedi di una scogliera calcarea di circa 75 metri, raggiungibile dopo una breve camminata nella foresta. Sono altezze e imbragature, ma con guida e attrezzatura complete è alla portata della maggior parte dei viaggiatori in forma discreta. Il cenote e le giornate di natura più tranquille li trovi in ",
        { text: "cultura e natura", href: LINKS.cultureNature },
        ". Ideale per: chi vuole un brivido vero senza motore — e le foto migliori del viaggio.",
      ]),

      h3("3. Buggy e ATV — quello sporco, da mettere le mani in pasta"),
      para([
        "Questo è quello di cui parlerai a cena — e che ti laverai via dai capelli. Guidi il tuo buggy o ATV su piste sterrate nelle campagne vicino a Macao, schizzando nelle pozzanghere, con una sosta in una fattoria di cacao o caffè e spesso una grotta o un cenote lungo la via. È divertimento polveroso, fangoso e rumoroso. Dato che sei al volante, l'attrezzatura conta: l'",
        { text: "ATV Safety Institute", href: CITATIONS.atvSafety },
        " raccomanda un buon casco, protezione per gli occhi, scarpe chiuse sopra la caviglia, maniche lunghe e pantaloni lunghi — e di non guidare mai sotto effetto di alcol. Li trovi in ",
        { text: "avventura", href: LINKS.adventure },
        ". Ideale per: amanti del brivido pratici a cui non dispiace finire infangati.",
      ]),

      h3("4. Sotto la superficie — l'adrenalina del sub"),
      para([
        "Per noi, il brivido più grande di Punta Cana non è affatto sulla terraferma. Un'immersione guidata su barriera o relitto — e, per i certificati e coraggiosi, persino un'immersione con gli squali — regala un'avventura che nessuna zipline eguaglia. Trovi le opzioni sulla nostra ",
        { text: "pagina immersioni e snorkeling", href: LINKS.scubaDiving },
        ", e il nostro centro originario ",
        { text: "Grand Bay of the Sea", href: LINKS.diveCenter },
        " si occupa delle cose serie. Ideale per: amanti dell'acqua e chiunque abbia sempre voluto guardare l'oceano faccia a faccia.",
      ]),

      h2("Quale avventura per il tuo gruppo?"),
      para(["Un abbinamento di massima in base a chi viaggia con te:"]),
      li(["Coppie e amici — un'uscita in catamarano, o le zipline per i panorami."]),
      li(["Patiti di adrenalina — buggy e ATV, poi un'immersione."]),
      li(["Gruppi di livelli misti — una giornata privata che unisce un catamarano tranquillo a un buggy opzionale."]),
      li(["Fotografi — il cenote e la zipline, senza dubbio."]),

      h2("Qualche consiglio per la giornata d'avventura"),
      para(["Piccole cose che fanno una grande differenza quando la giornata ingrana:"]),
      li(["Vestiti per rovinarti. Per i buggy, indossa abiti e scarpe che non ti dispiace distruggere — e porta una protezione per gli occhi, che l'ATV Safety Institute indica come essenziale."]),
      li(["Proteggi il telefono. Una custodia stagna o una GoPro salvano la giornata, sia in buggy sia in catamarano."]),
      li(["Sole e acqua. Il sole tropicale è forte; porta crema rispettosa della barriera, acqua e un cappello."]),
      li(["Prenota la versione privata se il ritmo conta. I tour di gruppo seguono un orario fisso; una giornata privata si adatta a te."]),
      li(["Controlla età e restrizioni. Buggy, zipline e immersioni hanno età minime, limiti di peso o regole di salute — chiedi prima di prenotare."]),

      h2("Prenotare la tua giornata d'avventura"),
      para([
        "Sfoglia i nostri tour d'avventura privati — buggy, zipline e altro — accanto alle giornate in catamarano e alle uscite di natura più tranquille. Budget più contenuto? Il nostro sito gemello ",
        { text: "Punta Cana Excursions", href: LINKS.publicAdventure },
        " propone partenze d'avventura condivise. Dicci l'appetito di adrenalina del tuo gruppo e costruiremo la giornata su misura.",
      ]),

      quote("La spiaggia sarà ancora lì quando torni. L'adrenalina non aspetta."),

      para([
        "Dicci quanta adrenalina vuole davvero il tuo gruppo — da un catamarano pigro a una giornata in buggy a tutto gas — e costruiremo un'avventura privata su misura. ",
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
        name: "Punta Cana — Go Dominican Republic (Ministry of Tourism)",
        url: CITATIONS.godrPuntaCana,
      },
      {
        "@type": "CreativeWork",
        name: "The Golden Rules — ATV Safety Institute",
        url: CITATIONS.atvSafety,
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

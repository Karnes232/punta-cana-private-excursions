/**
 * Seed ONE example blog article in all six supported locales (EN, ES, FR, DE,
 * PT, IT). Use this as a copy-and-adapt template for new blog content.
 *
 * SAFETY: this script uses `createIfNotExists` (not `createOrReplace`), so it
 * will NEVER overwrite or delete an existing `blogArticle`. It reads existing
 * `blogCategory` docs to reference one — it does not create, modify, or delete
 * any other document.
 *
 * Usage:
 *   1. SANITY_API_TOKEN in .env.local (Editor token)
 *   2. npm run seed:blog:example
 *
 * Featured & OG images are intentionally omitted — upload via Studio.
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
// Constants
// =============================================================================

const GROUP = "example-private-concierge-how-it-works";
const PUBLISHED_AT = "2026-06-10";
const READING_TIME = 5;
const CATEGORY_SLUG = "travel-tips";

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

interface ArticleContent {
  lang: BlogLocale;
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  h2_one: string;
  para_one: string;
  h2_two: string;
  para_two: string;
  bullet_items: string[];
  h2_three: string;
  para_three: string;
  pullQuote: string;
  outro: string;
  seo: Seo;
}

function buildBody(c: ArticleContent) {
  return [
    para(c.intro),
    heading(c.h2_one, "h2"),
    para(c.para_one),
    heading(c.h2_two, "h2"),
    para(c.para_two),
    ...bullets(c.bullet_items),
    heading(c.h2_three, "h2"),
    para(c.para_three),
    quote(c.pullQuote),
    para(c.outro),
  ];
}

function article(c: ArticleContent, categoryId: string | undefined) {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: c.title,
    description: c.excerpt,
    inLanguage: c.lang,
    datePublished: PUBLISHED_AT,
    author: { "@type": "Organization", name: "Punta Cana Private Excursions" },
    publisher: {
      "@type": "Organization",
      name: "Punta Cana Private Excursions",
    },
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
    body: buildBody(c),
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
// Content — one article in 6 languages
// =============================================================================

const CONTENT: ArticleContent[] = [
  // ── English ─────────────────────────────────────────────────────────────────
  {
    lang: "en",
    slug: "private-concierge-punta-cana-how-it-works",
    title: "Your Private Concierge in Punta Cana: How It Works",
    excerpt:
      "From the first message to the final sunset, here's how a private concierge turns a Punta Cana trip into something you actually remember.",
    intro:
      "A private concierge isn't about luxury for its own sake — it's about removing every small friction so your time is spent on the part of the trip that actually matters: the experience.",
    h2_one: "Step 1 — A real conversation",
    para_one:
      "We start with a single message. Tell us who's coming, what you love, and what you'd rather skip. There's no form to fill in and no script — just a planner who listens and asks the right questions.",
    h2_two: "Step 2 — A day plan built around you",
    para_two:
      "Within 24 hours we send a draft itinerary. Every detail is yours to adjust — and every detail is already handled before you land:",
    bullet_items: [
      "Private transfers, door to door",
      "A guide who speaks your language",
      "Restaurants reserved before you arrive",
      "Snorkel gear, water, towels — already on board",
    ],
    h2_three: "Step 3 — On the day",
    para_three:
      "Your concierge is one message away from the moment you land. If the wind shifts, we shift with it; if the kids hit a wall, we change the plan. You enjoy. We handle.",
    pullQuote:
      "Travel is supposed to feel light. Our job is to carry the weight you don't see.",
    outro:
      "When you're ready to start planning, send us a message — that's all it takes.",
    seo: {
      metaTitle: "Private Concierge Punta Cana | How It Works",
      metaDescription:
        "How a private Punta Cana concierge plans your trip — from first message to final sunset. Transfers, guides, restaurants, every detail handled.",
      keywords: [
        "private concierge punta cana",
        "punta cana private trip",
        "luxury travel punta cana",
        "punta cana planner",
      ],
      ogTitle: "Your Private Concierge in Punta Cana: How It Works",
      ogDescription:
        "From first message to final sunset — here's how a private concierge plans your Punta Cana trip.",
    },
  },

  // ── Spanish ─────────────────────────────────────────────────────────────────
  {
    lang: "es",
    slug: "conserje-privado-punta-cana-como-funciona",
    title: "Tu Conserje Privado en Punta Cana: Cómo Funciona",
    excerpt:
      "Desde el primer mensaje hasta la última puesta de sol, así un conserje privado convierte un viaje a Punta Cana en algo que recordarás de verdad.",
    intro:
      "Un conserje privado no se trata de lujo por el lujo — se trata de eliminar cada pequeña fricción para que tu tiempo se dedique a lo que de verdad importa: la experiencia.",
    h2_one: "Paso 1 — Una conversación real",
    para_one:
      "Empezamos con un solo mensaje. Cuéntanos quién viene, qué te encanta y qué prefieres saltarte. No hay formulario que rellenar ni guión — solo un planificador que escucha y hace las preguntas correctas.",
    h2_two: "Paso 2 — Un plan diseñado para ti",
    para_two:
      "En menos de 24 horas te enviamos un itinerario inicial. Cada detalle es tuyo para ajustar — y cada detalle ya está resuelto antes de que aterrices:",
    bullet_items: [
      "Traslados privados, puerta a puerta",
      "Un guía que habla tu idioma",
      "Restaurantes reservados antes de tu llegada",
      "Equipo de snorkel, agua y toallas — ya a bordo",
    ],
    h2_three: "Paso 3 — El día del viaje",
    para_three:
      "Tu conserje está a un mensaje de distancia desde el momento en que aterrizas. Si cambia el viento, cambiamos con él; si los niños se cansan, cambiamos el plan. Tú disfrutas. Nosotros nos encargamos.",
    pullQuote:
      "Viajar debería sentirse ligero. Nuestro trabajo es cargar con el peso que no ves.",
    outro:
      "Cuando estés listo para empezar a planificar, envíanos un mensaje — con eso basta.",
    seo: {
      metaTitle: "Conserje Privado Punta Cana | Cómo Funciona",
      metaDescription:
        "Cómo un conserje privado de Punta Cana planifica tu viaje — del primer mensaje a la última puesta de sol. Traslados, guías, reservas: todo resuelto.",
      keywords: [
        "conserje privado punta cana",
        "viaje privado punta cana",
        "viaje de lujo punta cana",
        "planificador punta cana",
      ],
      ogTitle: "Tu Conserje Privado en Punta Cana: Cómo Funciona",
      ogDescription:
        "Del primer mensaje a la última puesta de sol — así un conserje privado planifica tu viaje a Punta Cana.",
    },
  },

  // ── French ──────────────────────────────────────────────────────────────────
  {
    lang: "fr",
    slug: "concierge-prive-punta-cana-comment-ca-marche",
    title: "Votre Concierge Privé à Punta Cana : Comment Ça Marche",
    excerpt:
      "Du premier message au dernier coucher de soleil, voici comment un concierge privé transforme un voyage à Punta Cana en souvenir.",
    intro:
      "Un concierge privé, ce n'est pas du luxe pour le luxe — c'est faire disparaître chaque petite friction pour que votre temps soit consacré à ce qui compte vraiment : l'expérience.",
    h2_one: "Étape 1 — Une vraie conversation",
    para_one:
      "Tout commence par un message. Dites-nous qui voyage, ce que vous aimez et ce que vous préférez éviter. Pas de formulaire, pas de script — juste un planificateur qui écoute et pose les bonnes questions.",
    h2_two: "Étape 2 — Un programme pensé pour vous",
    para_two:
      "En moins de 24 heures, nous vous envoyons un itinéraire initial. Chaque détail est ajustable — et chaque détail est déjà réglé avant votre arrivée :",
    bullet_items: [
      "Transferts privés, porte-à-porte",
      "Un guide qui parle votre langue",
      "Restaurants réservés avant votre arrivée",
      "Matériel de snorkeling, eau, serviettes — déjà à bord",
    ],
    h2_three: "Étape 3 — Le jour J",
    para_three:
      "Votre concierge est à un message dès l'instant où vous atterrissez. Si le vent tourne, nous tournons avec ; si les enfants fatiguent, nous changeons le programme. Vous profitez. Nous gérons.",
    pullQuote:
      "Voyager devrait être léger. Notre métier est de porter le poids que vous ne voyez pas.",
    outro:
      "Quand vous êtes prêt à planifier, envoyez-nous un message — c'est tout ce qu'il faut.",
    seo: {
      metaTitle: "Concierge Privé Punta Cana | Comment Ça Marche",
      metaDescription:
        "Comment un concierge privé à Punta Cana organise votre voyage — du premier message au dernier coucher de soleil. Transferts, guides, réservations : tout est géré.",
      keywords: [
        "concierge privé punta cana",
        "voyage privé punta cana",
        "voyage de luxe punta cana",
        "planificateur punta cana",
      ],
      ogTitle: "Votre Concierge Privé à Punta Cana : Comment Ça Marche",
      ogDescription:
        "Du premier message au dernier coucher de soleil — voici comment un concierge privé organise votre voyage.",
    },
  },

  // ── German ──────────────────────────────────────────────────────────────────
  {
    lang: "de",
    slug: "privater-concierge-punta-cana-so-funktioniert-es",
    title: "Ihr Privater Concierge in Punta Cana: So Funktioniert Es",
    excerpt:
      "Von der ersten Nachricht bis zum letzten Sonnenuntergang — so macht ein privater Concierge aus einer Reise nach Punta Cana ein echtes Erlebnis.",
    intro:
      "Ein privater Concierge geht nicht um Luxus an sich — es geht darum, jede kleine Reibung zu entfernen, damit Ihre Zeit dort ankommt, wo sie zählt: beim Erleben.",
    h2_one: "Schritt 1 — Ein echtes Gespräch",
    para_one:
      "Es beginnt mit einer Nachricht. Erzählen Sie uns, wer reist, was Sie lieben und was Sie lieber auslassen möchten. Kein Formular, kein Skript — nur ein Planer, der zuhört und die richtigen Fragen stellt.",
    h2_two: "Schritt 2 — Ein Tagesplan, der zu Ihnen passt",
    para_two:
      "Innerhalb von 24 Stunden senden wir Ihnen einen ersten Reiseplan. Jedes Detail können Sie anpassen — und jedes Detail ist schon organisiert, bevor Sie landen:",
    bullet_items: [
      "Private Transfers, von Tür zu Tür",
      "Ein Guide, der Ihre Sprache spricht",
      "Restaurants reserviert vor Ihrer Ankunft",
      "Schnorchelausrüstung, Wasser, Handtücher — bereits an Bord",
    ],
    h2_three: "Schritt 3 — Am Reisetag",
    para_three:
      "Ihr Concierge ist ab dem Moment Ihrer Landung nur eine Nachricht entfernt. Dreht der Wind, drehen wir mit; werden die Kinder müde, ändern wir den Plan. Sie genießen. Wir kümmern uns.",
    pullQuote:
      "Reisen sollte sich leicht anfühlen. Unser Job ist es, das Gewicht zu tragen, das Sie nicht sehen.",
    outro:
      "Wenn Sie bereit sind zu planen, schreiben Sie uns — mehr braucht es nicht.",
    seo: {
      metaTitle: "Privater Concierge Punta Cana | So Funktioniert Es",
      metaDescription:
        "Wie ein privater Concierge in Punta Cana Ihre Reise plant — von der ersten Nachricht bis zum letzten Sonnenuntergang. Transfers, Guides, Reservierungen: alles geregelt.",
      keywords: [
        "privater concierge punta cana",
        "private reise punta cana",
        "luxusreise punta cana",
        "reiseplaner punta cana",
      ],
      ogTitle: "Ihr Privater Concierge in Punta Cana: So Funktioniert Es",
      ogDescription:
        "Von der ersten Nachricht bis zum letzten Sonnenuntergang — so plant ein privater Concierge Ihre Reise.",
    },
  },

  // ── Portuguese ──────────────────────────────────────────────────────────────
  {
    lang: "pt",
    slug: "concierge-privado-punta-cana-como-funciona",
    title: "Seu Concierge Privado em Punta Cana: Como Funciona",
    excerpt:
      "Da primeira mensagem ao último pôr do sol, é assim que um concierge privado transforma uma viagem a Punta Cana em algo memorável.",
    intro:
      "Um concierge privado não é luxo por luxo — é remover cada pequena fricção para que o seu tempo seja gasto no que de fato importa: a experiência.",
    h2_one: "Passo 1 — Uma conversa de verdade",
    para_one:
      "Começamos com uma única mensagem. Conte-nos quem está vindo, o que você ama e o que prefere pular. Sem formulário, sem roteiro — apenas um planejador que escuta e faz as perguntas certas.",
    h2_two: "Passo 2 — Um plano feito para você",
    para_two:
      "Em menos de 24 horas enviamos um roteiro inicial. Cada detalhe é seu para ajustar — e cada detalhe já está resolvido antes de você pousar:",
    bullet_items: [
      "Transfers privados, de porta a porta",
      "Um guia que fala o seu idioma",
      "Restaurantes reservados antes da sua chegada",
      "Equipamento de snorkel, água, toalhas — já a bordo",
    ],
    h2_three: "Passo 3 — No dia",
    para_three:
      "Seu concierge está a uma mensagem de distância desde o momento em que você pousa. Se o vento muda, mudamos junto; se as crianças cansam, mudamos o plano. Você aproveita. Nós cuidamos.",
    pullQuote:
      "Viajar deveria ser leve. Nosso trabalho é carregar o peso que você não vê.",
    outro:
      "Quando estiver pronto para começar a planejar, mande uma mensagem — é só isso.",
    seo: {
      metaTitle: "Concierge Privado Punta Cana | Como Funciona",
      metaDescription:
        "Como um concierge privado em Punta Cana planeja sua viagem — da primeira mensagem ao último pôr do sol. Transfers, guias, reservas: tudo resolvido.",
      keywords: [
        "concierge privado punta cana",
        "viagem privada punta cana",
        "viagem de luxo punta cana",
        "planejador punta cana",
      ],
      ogTitle: "Seu Concierge Privado em Punta Cana: Como Funciona",
      ogDescription:
        "Da primeira mensagem ao último pôr do sol — é assim que um concierge privado planeja sua viagem.",
    },
  },

  // ── Italian ─────────────────────────────────────────────────────────────────
  {
    lang: "it",
    slug: "concierge-privato-punta-cana-come-funziona",
    title: "Il Tuo Concierge Privato a Punta Cana: Come Funziona",
    excerpt:
      "Dal primo messaggio all'ultimo tramonto, ecco come un concierge privato trasforma un viaggio a Punta Cana in qualcosa di indimenticabile.",
    intro:
      "Un concierge privato non è lusso fine a sé stesso — è eliminare ogni piccolo attrito perché il tuo tempo vada esattamente dove conta: nell'esperienza.",
    h2_one: "Fase 1 — Una conversazione vera",
    para_one:
      "Si parte con un singolo messaggio. Raccontaci chi viaggia, cosa ami e cosa preferisci saltare. Niente moduli, niente copioni — solo un pianificatore che ascolta e fa le domande giuste.",
    h2_two: "Fase 2 — Un programma costruito su di te",
    para_two:
      "Entro 24 ore ti inviamo un itinerario iniziale. Ogni dettaglio è tuo da regolare — e ogni dettaglio è già gestito prima che tu atterri:",
    bullet_items: [
      "Transfer privati, porta a porta",
      "Una guida che parla la tua lingua",
      "Ristoranti prenotati prima del tuo arrivo",
      "Attrezzatura da snorkeling, acqua, asciugamani — già a bordo",
    ],
    h2_three: "Fase 3 — Il giorno del viaggio",
    para_three:
      "Il tuo concierge è a un messaggio di distanza dal momento in cui atterri. Se il vento cambia, cambiamo con lui; se i bambini si stancano, cambiamo il piano. Tu ti godi il viaggio. Noi pensiamo al resto.",
    pullQuote:
      "Viaggiare dovrebbe essere leggero. Il nostro lavoro è portare il peso che non vedi.",
    outro:
      "Quando sei pronto a iniziare a pianificare, scrivici un messaggio — basta quello.",
    seo: {
      metaTitle: "Concierge Privato Punta Cana | Come Funziona",
      metaDescription:
        "Come un concierge privato a Punta Cana pianifica il tuo viaggio — dal primo messaggio all'ultimo tramonto. Transfer, guide, prenotazioni: tutto gestito.",
      keywords: [
        "concierge privato punta cana",
        "viaggio privato punta cana",
        "viaggio di lusso punta cana",
        "organizzatore punta cana",
      ],
      ogTitle: "Il Tuo Concierge Privato a Punta Cana: Come Funziona",
      ogDescription:
        "Dal primo messaggio all'ultimo tramonto — ecco come un concierge privato pianifica il tuo viaggio.",
    },
  },
];

// =============================================================================
// Run
// =============================================================================

async function seed() {
  console.log(`📝 Seeding example blog article into ${projectId} / ${dataset}`);
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

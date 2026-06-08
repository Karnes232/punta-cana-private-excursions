/**
 * Seed two extra blog topics in French, German, Portuguese and Italian.
 *
 * SCOPE: writes ONLY the 8 new `blogArticle` documents listed below (new,
 * deterministic _ids). It reads existing `blogCategory` docs to reference them,
 * but never creates, modifies, or deletes any other document — existing blog
 * articles (en/es and any you authored in the Studio) are left untouched.
 *
 * Usage:  npx tsx src/sanity/seed/seedBlogMultilang.ts   (or: npm run seed:blog:ml)
 * Idempotent — createOrReplace keyed on the fixed _ids of these 8 docs.
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
  console.error("Missing SANITY_API_TOKEN (Editor token).");
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
  lang: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  categorySlug: string;
  body: object[];
  seo: Seo;
}

function article(input: ArticleInput, catMap: Record<string, string>) {
  const categoryId = catMap[input.categorySlug];
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.excerpt,
    inLanguage: input.lang,
    datePublished: input.publishedAt,
    author: { "@type": "Organization", name: "Punta Cana Private Excursions" },
    publisher: { "@type": "Organization", name: "Punta Cana Private Excursions" },
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
// Content — 2 topics × FR / DE / PT / IT
// =============================================================================

function buildArticles(catMap: Record<string, string>) {
  const make = (i: ArticleInput) => article(i, catMap);

  return [
    // ===== TOPIC 1 — Top beaches (travel-tips) ===============================
    make({
      group: "top-beaches",
      lang: "fr",
      slug: "plus-belles-plages-punta-cana",
      title: "Les plus belles plages de Punta Cana",
      excerpt:
        "Du sable blanc à perte de vue et une eau turquoise — voici nos plages préférées sur la côte dominicaine.",
      publishedAt: "2026-05-10",
      readingTime: 5,
      categorySlug: "travel-tips",
      seo: {
        metaTitle: "Les plus belles plages de Punta Cana | Guide",
        metaDescription:
          "Nos plages préférées à Punta Cana : sable blanc, eau turquoise et coins tranquilles loin de la foule.",
        keywords: ["plages punta cana", "voyage republique dominicaine", "bavaro plage", "macao plage"],
        ogTitle: "Les plus belles plages de Punta Cana",
        ogDescription: "Sable blanc, eau turquoise et nos coins préférés loin de la foule.",
      },
      body: [
        para(
          "Punta Cana possède certaines des plus belles plages des Caraïbes. Voici celles que nous recommandons à nos clients, des plus animées aux plus secrètes.",
        ),
        heading("Plage de Bávaro", "h2"),
        para(
          "La carte postale par excellence : des kilomètres de sable blanc bordés de cocotiers et une mer calme, parfaite pour la baignade en famille.",
        ),
        heading("Macao et les criques cachées", "h2"),
        para(
          "Pour échapper aux complexes hôteliers, mettez le cap sur Macao et les petites criques accessibles uniquement en bateau privé.",
        ),
        ...bullets([
          "Bávaro — idéale pour les familles",
          "Macao — vagues et ambiance locale",
          "Juanillo (Cap Cana) — élégante et tranquille",
        ]),
        quote(
          "Le secret d'une journée parfaite à la plage : arriver tôt et repartir quand les bus de touristes arrivent.",
        ),
        para(
          "Notre conciergerie organise des transferts privés vers chacune de ces plages, avec parasol, boissons fraîches et tout le confort.",
        ),
      ],
    }),
    make({
      group: "top-beaches",
      lang: "de",
      slug: "schoenste-straende-punta-cana",
      title: "Die schönsten Strände von Punta Cana",
      excerpt:
        "Weißer Sand, soweit das Auge reicht, und türkisfarbenes Wasser — das sind unsere Lieblingsstrände an der dominikanischen Küste.",
      publishedAt: "2026-05-10",
      readingTime: 5,
      categorySlug: "travel-tips",
      seo: {
        metaTitle: "Die schönsten Strände von Punta Cana | Reiseführer",
        metaDescription:
          "Unsere Lieblingsstrände in Punta Cana: weißer Sand, türkisfarbenes Wasser und ruhige Ecken abseits der Menge.",
        keywords: ["strände punta cana", "reise dominikanische republik", "bavaro strand", "macao strand"],
        ogTitle: "Die schönsten Strände von Punta Cana",
        ogDescription: "Weißer Sand, türkisfarbenes Wasser und unsere ruhigen Lieblingsecken.",
      },
      body: [
        para(
          "Punta Cana hat einige der schönsten Strände der Karibik. Hier sind die, die wir unseren Gästen empfehlen — von belebt bis verborgen.",
        ),
        heading("Bávaro Strand", "h2"),
        para(
          "Das klassische Postkartenmotiv: kilometerlanger weißer Sand, gesäumt von Palmen, und ruhiges Wasser, ideal zum Baden mit der Familie.",
        ),
        heading("Macao und versteckte Buchten", "h2"),
        para(
          "Um den großen Hotelanlagen zu entkommen, geht es nach Macao und zu kleinen Buchten, die nur mit einem privaten Boot erreichbar sind.",
        ),
        ...bullets([
          "Bávaro — ideal für Familien",
          "Macao — Wellen und lokales Flair",
          "Juanillo (Cap Cana) — elegant und ruhig",
        ]),
        quote(
          "Das Geheimnis eines perfekten Strandtages: früh ankommen und gehen, wenn die Reisebusse eintreffen.",
        ),
        para(
          "Unser Concierge organisiert private Transfers zu jedem dieser Strände, mit Sonnenschirm, kühlen Getränken und allem Komfort.",
        ),
      ],
    }),
    make({
      group: "top-beaches",
      lang: "pt",
      slug: "melhores-praias-punta-cana",
      title: "As melhores praias de Punta Cana",
      excerpt:
        "Areia branca a perder de vista e água turquesa — estas são as nossas praias preferidas na costa dominicana.",
      publishedAt: "2026-05-10",
      readingTime: 5,
      categorySlug: "travel-tips",
      seo: {
        metaTitle: "As melhores praias de Punta Cana | Guia",
        metaDescription:
          "As nossas praias preferidas em Punta Cana: areia branca, água turquesa e cantos tranquilos longe da multidão.",
        keywords: ["praias punta cana", "viagem republica dominicana", "praia bavaro", "praia macao"],
        ogTitle: "As melhores praias de Punta Cana",
        ogDescription: "Areia branca, água turquesa e os nossos cantos preferidos longe da multidão.",
      },
      body: [
        para(
          "Punta Cana tem algumas das praias mais bonitas das Caraíbas. Estas são as que recomendamos aos nossos clientes, das mais movimentadas às mais secretas.",
        ),
        heading("Praia de Bávaro", "h2"),
        para(
          "O cartão-postal por excelência: quilómetros de areia branca rodeados de coqueiros e um mar calmo, perfeito para nadar em família.",
        ),
        heading("Macao e as enseadas escondidas", "h2"),
        para(
          "Para fugir dos resorts, siga até Macao e às pequenas enseadas acessíveis apenas de barco privado.",
        ),
        ...bullets([
          "Bávaro — ideal para famílias",
          "Macao — ondas e ambiente local",
          "Juanillo (Cap Cana) — elegante e tranquila",
        ]),
        quote(
          "O segredo de um dia de praia perfeito: chegar cedo e sair quando os autocarros de turistas chegam.",
        ),
        para(
          "A nossa conciergeria organiza transferes privados para cada uma destas praias, com chapéu de sol, bebidas frescas e todo o conforto.",
        ),
      ],
    }),
    make({
      group: "top-beaches",
      lang: "it",
      slug: "spiagge-piu-belle-punta-cana",
      title: "Le spiagge più belle di Punta Cana",
      excerpt:
        "Sabbia bianca a perdita d'occhio e acqua turchese — ecco le nostre spiagge preferite sulla costa dominicana.",
      publishedAt: "2026-05-10",
      readingTime: 5,
      categorySlug: "travel-tips",
      seo: {
        metaTitle: "Le spiagge più belle di Punta Cana | Guida",
        metaDescription:
          "Le nostre spiagge preferite a Punta Cana: sabbia bianca, acqua turchese e angoli tranquilli lontano dalla folla.",
        keywords: ["spiagge punta cana", "viaggio repubblica dominicana", "spiaggia bavaro", "spiaggia macao"],
        ogTitle: "Le spiagge più belle di Punta Cana",
        ogDescription: "Sabbia bianca, acqua turchese e i nostri angoli preferiti lontano dalla folla.",
      },
      body: [
        para(
          "Punta Cana vanta alcune delle spiagge più belle dei Caraibi. Ecco quelle che consigliamo ai nostri clienti, dalle più vivaci alle più nascoste.",
        ),
        heading("Spiaggia di Bávaro", "h2"),
        para(
          "La cartolina per eccellenza: chilometri di sabbia bianca circondati da palme e un mare calmo, perfetto per nuotare in famiglia.",
        ),
        heading("Macao e le cale nascoste", "h2"),
        para(
          "Per sfuggire ai resort, dirigetevi verso Macao e le piccole cale raggiungibili solo in barca privata.",
        ),
        ...bullets([
          "Bávaro — ideale per le famiglie",
          "Macao — onde e atmosfera locale",
          "Juanillo (Cap Cana) — elegante e tranquilla",
        ]),
        quote(
          "Il segreto di una giornata in spiaggia perfetta: arrivare presto e andarsene quando arrivano i pullman di turisti.",
        ),
        para(
          "La nostra concierge organizza transfer privati verso ognuna di queste spiagge, con ombrellone, bevande fresche e ogni comfort.",
        ),
      ],
    }),

    // ===== TOPIC 2 — Snorkeling for beginners (marine-life) ==================
    make({
      group: "snorkeling-beginners",
      lang: "fr",
      slug: "snorkeling-debutants-punta-cana",
      title: "Le snorkeling pour débutants à Punta Cana",
      excerpt:
        "Pas besoin d'expérience pour découvrir les récifs : tout ce qu'il faut savoir avant votre première sortie masque et tuba.",
      publishedAt: "2026-05-14",
      readingTime: 6,
      categorySlug: "marine-life",
      seo: {
        metaTitle: "Snorkeling pour débutants à Punta Cana | Guide",
        metaDescription:
          "Conseils pour votre première sortie snorkeling à Punta Cana : où aller, quoi emporter et quels poissons observer.",
        keywords: ["snorkeling punta cana", "masque tuba debutant", "recif caraibes", "vie marine punta cana"],
        ogTitle: "Le snorkeling pour débutants à Punta Cana",
        ogDescription: "Tout ce qu'il faut savoir avant votre première sortie masque et tuba.",
      },
      body: [
        para(
          "Le snorkeling est la façon la plus simple de découvrir le monde sous-marin des Caraïbes — aucune certification ni expérience requise.",
        ),
        heading("Où aller en premier", "h2"),
        para(
          "Les récifs peu profonds près de la côte sont parfaits pour débuter : eau calme, bonne visibilité et poissons colorés en abondance.",
        ),
        heading("Ce que vous allez voir", "h2"),
        ...bullets([
          "Poissons-perroquets et poissons-anges",
          "Tortues marines broutant les herbiers",
          "Jardins de corail aux couleurs vives",
        ]),
        quote(
          "Respirez lentement, détendez-vous et laissez-vous flotter : le récif fait le reste.",
        ),
        para(
          "Nos guides fournissent tout le matériel et restent à vos côtés tout au long de la sortie, en petit groupe privé.",
        ),
      ],
    }),
    make({
      group: "snorkeling-beginners",
      lang: "de",
      slug: "schnorcheln-anfaenger-punta-cana",
      title: "Schnorcheln für Anfänger in Punta Cana",
      excerpt:
        "Keine Erfahrung nötig, um die Riffe zu entdecken: alles, was Sie vor Ihrem ersten Schnorchelausflug wissen müssen.",
      publishedAt: "2026-05-14",
      readingTime: 6,
      categorySlug: "marine-life",
      seo: {
        metaTitle: "Schnorcheln für Anfänger in Punta Cana | Guide",
        metaDescription:
          "Tipps für Ihren ersten Schnorchelausflug in Punta Cana: wohin, was mitnehmen und welche Fische Sie sehen.",
        keywords: ["schnorcheln punta cana", "schnorcheln anfänger", "riff karibik", "meeresleben punta cana"],
        ogTitle: "Schnorcheln für Anfänger in Punta Cana",
        ogDescription: "Alles, was Sie vor Ihrem ersten Schnorchelausflug wissen müssen.",
      },
      body: [
        para(
          "Schnorcheln ist der einfachste Weg, die Unterwasserwelt der Karibik zu entdecken — ganz ohne Zertifikat oder Erfahrung.",
        ),
        heading("Wohin zuerst", "h2"),
        para(
          "Die flachen Riffe nahe der Küste sind ideal für den Anfang: ruhiges Wasser, gute Sicht und reichlich bunte Fische.",
        ),
        heading("Was Sie sehen werden", "h2"),
        ...bullets([
          "Papageienfische und Kaiserfische",
          "Meeresschildkröten, die an Seegras weiden",
          "Farbenfrohe Korallengärten",
        ]),
        quote(
          "Atmen Sie langsam, entspannen Sie sich und lassen Sie sich treiben: das Riff erledigt den Rest.",
        ),
        para(
          "Unsere Guides stellen die gesamte Ausrüstung und bleiben während des gesamten Ausflugs in einer kleinen privaten Gruppe an Ihrer Seite.",
        ),
      ],
    }),
    make({
      group: "snorkeling-beginners",
      lang: "pt",
      slug: "snorkeling-iniciantes-punta-cana",
      title: "Snorkeling para iniciantes em Punta Cana",
      excerpt:
        "Não é preciso experiência para descobrir os recifes: tudo o que precisa de saber antes da sua primeira saída de snorkeling.",
      publishedAt: "2026-05-14",
      readingTime: 6,
      categorySlug: "marine-life",
      seo: {
        metaTitle: "Snorkeling para iniciantes em Punta Cana | Guia",
        metaDescription:
          "Dicas para a sua primeira saída de snorkeling em Punta Cana: onde ir, o que levar e que peixes observar.",
        keywords: ["snorkeling punta cana", "snorkeling iniciantes", "recife caraibas", "vida marinha punta cana"],
        ogTitle: "Snorkeling para iniciantes em Punta Cana",
        ogDescription: "Tudo o que precisa de saber antes da sua primeira saída de snorkeling.",
      },
      body: [
        para(
          "O snorkeling é a forma mais simples de descobrir o mundo subaquático das Caraíbas — sem certificação nem experiência.",
        ),
        heading("Por onde começar", "h2"),
        para(
          "Os recifes pouco profundos perto da costa são perfeitos para começar: água calma, boa visibilidade e peixes coloridos em abundância.",
        ),
        heading("O que vai ver", "h2"),
        ...bullets([
          "Peixes-papagaio e peixes-anjo",
          "Tartarugas marinhas a pastar nas ervas marinhas",
          "Jardins de coral cheios de cor",
        ]),
        quote(
          "Respire devagar, relaxe e deixe-se flutuar: o recife faz o resto.",
        ),
        para(
          "Os nossos guias fornecem todo o equipamento e ficam ao seu lado durante toda a saída, num pequeno grupo privado.",
        ),
      ],
    }),
    make({
      group: "snorkeling-beginners",
      lang: "it",
      slug: "snorkeling-principianti-punta-cana",
      title: "Snorkeling per principianti a Punta Cana",
      excerpt:
        "Non serve esperienza per scoprire le barriere coralline: tutto ciò che c'è da sapere prima della prima uscita.",
      publishedAt: "2026-05-14",
      readingTime: 6,
      categorySlug: "marine-life",
      seo: {
        metaTitle: "Snorkeling per principianti a Punta Cana | Guida",
        metaDescription:
          "Consigli per la tua prima uscita di snorkeling a Punta Cana: dove andare, cosa portare e quali pesci osservare.",
        keywords: ["snorkeling punta cana", "snorkeling principianti", "barriera corallina caraibi", "vita marina punta cana"],
        ogTitle: "Snorkeling per principianti a Punta Cana",
        ogDescription: "Tutto ciò che c'è da sapere prima della tua prima uscita di snorkeling.",
      },
      body: [
        para(
          "Lo snorkeling è il modo più semplice per scoprire il mondo sottomarino dei Caraibi — senza certificazione né esperienza.",
        ),
        heading("Da dove iniziare", "h2"),
        para(
          "Le barriere poco profonde vicino alla costa sono perfette per cominciare: acqua calma, buona visibilità e pesci colorati in abbondanza.",
        ),
        heading("Cosa vedrai", "h2"),
        ...bullets([
          "Pesci pappagallo e pesci angelo",
          "Tartarughe marine che brucano le praterie marine",
          "Giardini di corallo pieni di colore",
        ]),
        quote(
          "Respira lentamente, rilassati e lasciati galleggiare: alla barriera pensa il resto.",
        ),
        para(
          "Le nostre guide forniscono tutta l'attrezzatura e restano al tuo fianco per tutta l'uscita, in un piccolo gruppo privato.",
        ),
      ],
    }),
  ];
}

// =============================================================================
// Run
// =============================================================================

async function seed() {
  console.log(`📝 Seeding multilingual blog articles into ${projectId} / ${dataset}\n`);

  const cats = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "blogCategory" && defined(slug.current)]{ _id, "slug": slug.current }`,
  );
  const catMap: Record<string, string> = {};
  for (const c of cats) catMap[c.slug] = c._id;
  console.log(`Found ${cats.length} blog categories to reference.\n`);

  const all = buildArticles(catMap);

  // Safety guard — only blogArticle documents may be written.
  if (!all.every((d) => d._type === "blogArticle")) {
    console.error("Refusing to run: a non-blogArticle document was generated.");
    process.exit(1);
  }

  let i = 0;
  for (const doc of all) {
    i += 1;
    process.stdout.write(`[${i}/${all.length}] ${doc.language} blogArticle (${doc._id})... `);
    try {
      await client.createOrReplace(doc as never);
      console.log("✓");
    } catch (err) {
      console.log("✗");
      console.error(err);
      process.exit(1);
    }
  }

  console.log(`\n✅ Seeded ${all.length} articles (2 topics × FR/DE/PT/IT). Existing blogs untouched.`);
  console.log("\nNote: featured & OG images were omitted. Upload via Studio at /studio.");
}

seed();

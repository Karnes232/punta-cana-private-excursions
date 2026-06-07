/**
 * Seed all singletons + a starter VIP catalog into the private-site Sanity dataset.
 *
 * Usage:
 *   1. Add SANITY_API_TOKEN to .env.local (Editor or higher token from sanity.io/manage)
 *   2. Run: npx tsx src/sanity/seed/seedAll.ts
 *
 * Idempotent — createOrReplace is used for every document, so it's safe to re-run.
 * Images are intentionally omitted — upload via Studio after seeding.
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
// Helpers
// =============================================================================

function block(en: string, es: string) {
  return {
    en: [
      {
        _type: "block",
        _key: `en-${Math.random().toString(36).slice(2, 9)}`,
        style: "normal",
        children: [{ _type: "span", _key: "s", text: en, marks: [] }],
        markDefs: [],
      },
    ],
    es: [
      {
        _type: "block",
        _key: `es-${Math.random().toString(36).slice(2, 9)}`,
        style: "normal",
        children: [{ _type: "span", _key: "s", text: es, marks: [] }],
        markDefs: [],
      },
    ],
  };
}

// =============================================================================
// generalLayout
// =============================================================================

const generalLayout = {
  _id: "generalLayout",
  _type: "generalLayout",
  companyName: {
    en: "Punta Cana Private Excursions",
    es: "Punta Cana Excursiones Privadas",
  },
  tagline: {
    en: "Bespoke private excursions in Punta Cana.",
    es: "Excursiones privadas a medida en Punta Cana.",
  },
  email: "concierge@puntacanaprivateexcursions.com",
  phone: "+1 829 555 0100",
  serviceArea: {
    en: "Bávaro · Cap Cana · Punta Cana · Uvero Alto",
    es: "Bávaro · Cap Cana · Punta Cana · Uvero Alto",
  },
  contactCtaText: {
    en: "Talk to concierge",
    es: "Hablar con conserjería",
  },
  responseTime: {
    en: "Reply within 24 hours, often the same day.",
    es: "Respuesta dentro de 24 horas, a menudo el mismo día.",
  },
  socialLinks: [
    { _key: "ig", platform: "instagram", url: "https://instagram.com/" },
    { _key: "wa", platform: "whatsapp", url: "https://wa.me/" },
  ],
  navLinks: [
    {
      _key: "n1",
      label: { en: "Private Excursions", es: "Excursiones Privadas" },
      href: "/excursions",
    },
    {
      _key: "n2",
      label: { en: "Diving & Snorkeling", es: "Buceo y Snorkel" },
      href: "/scuba-diving",
    },
    { _key: "n3", label: { en: "About", es: "Sobre Nosotros" }, href: "/about" },
    { _key: "n4", label: { en: "Journal", es: "Revista" }, href: "/blog" },
    { _key: "n5", label: { en: "FAQ", es: "Preguntas Frecuentes" }, href: "/faq" },
    { _key: "n6", label: { en: "Concierge", es: "Conserjería" }, href: "/contact" },
  ],
  navCtaButton: {
    label: { en: "Reserve", es: "Reservar" },
    href: "/excursions",
  },
  footerDescription: {
    en: "Concierge service and private charters for guests who want the very best of the Caribbean coast.",
    es: "Servicio de conserjería y charters privados para huéspedes que buscan lo mejor de la costa Caribe.",
  },
  footerQuickLinks: [
    {
      _key: "f1",
      label: { en: "Private Excursions", es: "Excursiones Privadas" },
      href: "/excursions",
    },
    {
      _key: "f2",
      label: { en: "Diving & Snorkeling", es: "Buceo y Snorkel" },
      href: "/scuba-diving",
    },
    {
      _key: "f3",
      label: { en: "How it works", es: "Cómo funciona" },
      href: "/how-it-works",
    },
    {
      _key: "f4",
      label: { en: "Concierge", es: "Conserjería" },
      href: "/contact",
    },
  ],
};

// =============================================================================
// homePage
// =============================================================================

const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroImageAlt: {
    en: "A private yacht anchored in turquoise Caribbean water at sunset",
    es: "Un yate privado anclado en agua turquesa del Caribe al atardecer",
  },
  heroEyebrow: { en: "VIP · Punta Cana", es: "VIP · Punta Cana" },
  heroHeadline: {
    en: "Private excursions, crafted for you.",
    es: "Excursiones privadas, hechas a tu medida.",
  },
  heroSubheadline: {
    en: "Bespoke charters, certified private guides, and the most exclusive experiences on the Dominican coast. Your day, your way.",
    es: "Charters a medida, guías privados certificados, y las experiencias más exclusivas de la costa dominicana. Tu día, a tu manera.",
  },
  heroPrimaryCta: {
    text: { en: "View experiences", es: "Ver experiencias" },
    href: "/excursions",
  },
  heroSecondaryCta: {
    text: { en: "Talk to concierge", es: "Hablar con conserjería" },
    href: "/contact",
  },
  brandIntroTagline: {
    en: "A different kind of day in Punta Cana",
    es: "Un tipo diferente de día en Punta Cana",
  },
  brandIntroHeading: {
    en: "An experience built around you, not a schedule.",
    es: "Una experiencia diseñada en torno a ti, no a un horario.",
  },
  brandIntroBody: block(
    "We don't sell seats on shared boats. Every excursion is yours alone — your group, your pace, your guide. From private catamarans to bespoke fishing charters and helicopter day trips, we curate experiences with the kind of attention you'd expect from a five-star hotel.",
    "No vendemos asientos en barcos compartidos. Cada excursión es solo tuya — tu grupo, tu ritmo, tu guía. Desde catamaranes privados hasta charters de pesca a medida y excursiones en helicóptero, curamos experiencias con la atención de un hotel cinco estrellas.",
  ),
  brandIntroImageAlt: {
    en: "A private guide setting up a beach picnic for a small group",
    es: "Un guía privado preparando un picnic en la playa para un grupo pequeño",
  },
  featuredEyebrow: { en: "Hand-picked", es: "Selección exclusiva" },
  featuredHeading: {
    en: "Featured private experiences.",
    es: "Experiencias privadas destacadas.",
  },
  featuredSubheading: {
    en: "Our most-requested private charters — each one tailored on the day.",
    es: "Nuestros charters privados más solicitados — cada uno personalizado en el día.",
  },
  featuredViewAllText: {
    en: "See all experiences",
    es: "Ver todas las experiencias",
  },
  categoriesEyebrow: { en: "Explore", es: "Explora" },
  categoriesHeading: {
    en: "Categories of private experience.",
    es: "Categorías de experiencias privadas.",
  },
  categoriesSubheading: {
    en: "Browse by mood — sea, sky, land, or culinary.",
    es: "Explora por estado de ánimo — mar, cielo, tierra o gastronomía.",
  },
  whyChooseUsEyebrow: { en: "Why us", es: "Por qué nosotros" },
  whyChooseUsHeading: {
    en: "The difference is in the details.",
    es: "La diferencia está en los detalles.",
  },
  whyChooseUsSubheading: {
    en: "Why hosts at the best resorts on the island recommend us.",
    es: "Por qué los hosts de los mejores resorts de la isla nos recomiendan.",
  },
  trustPillars: [
    {
      _key: "p1",
      icon: "private",
      title: { en: "Truly private", es: "Verdaderamente privado" },
      description: {
        en: "Your group only — no shared boats, no shared buses. Departures on your schedule.",
        es: "Solo tu grupo — sin barcos ni autobuses compartidos. Salidas a tu horario.",
      },
    },
    {
      _key: "p2",
      icon: "concierge",
      title: { en: "Concierge support", es: "Soporte de conserjería" },
      description: {
        en: "WhatsApp-first communication with a dedicated coordinator from booking to drop-off.",
        es: "Comunicación por WhatsApp con un coordinador dedicado desde la reserva hasta el regreso.",
      },
    },
    {
      _key: "p3",
      icon: "guide",
      title: { en: "Top guides", es: "Los mejores guías" },
      description: {
        en: "Hand-picked, bilingual, certified guides who know every site like their backyard.",
        es: "Guías bilingües certificados, seleccionados a mano, que conocen cada sitio como su propio patio.",
      },
    },
    {
      _key: "p4",
      icon: "transfer",
      title: { en: "Premium transfers", es: "Traslados premium" },
      description: {
        en: "Air-conditioned luxury SUVs and Sprinter vans with hotel pickup and return.",
        es: "SUV de lujo y vans Sprinter con aire acondicionado, recogida y regreso al hotel.",
      },
    },
  ],
  howBookingWorksEyebrow: { en: "How it works", es: "Cómo funciona" },
  howBookingWorksHeading: {
    en: "Three simple steps.",
    es: "Tres pasos sencillos.",
  },
  howBookingWorksSubheading: {
    en: "From inquiry to hotel pickup, it's clear and personal.",
    es: "Desde la consulta hasta la recogida en el hotel, todo es claro y personal.",
  },
  bookingSteps: [
    {
      _key: "s1",
      stepNumber: 1,
      icon: "browse",
      title: { en: "Choose your experience", es: "Elige tu experiencia" },
      description: {
        en: "Browse our private catalog or message our concierge for a fully bespoke day.",
        es: "Explora nuestro catálogo privado o escríbele a nuestra conserjería para un día totalmente a medida.",
      },
    },
    {
      _key: "s2",
      stepNumber: 2,
      icon: "reserve",
      title: { en: "Reserve your date", es: "Reserva tu fecha" },
      description: {
        en: "Secure your private charter with a small deposit via PayPal — the rest is paid on the day.",
        es: "Asegura tu charter privado con un pequeño depósito por PayPal — el resto se paga el día de la experiencia.",
      },
    },
    {
      _key: "s3",
      stepNumber: 3,
      icon: "enjoy",
      title: { en: "Enjoy in private", es: "Disfruta en privado" },
      description: {
        en: "Hotel pickup in a luxury vehicle. Your day, your way, with a guide who's just for you.",
        es: "Recogida en el hotel en vehículo de lujo. Tu día, a tu manera, con un guía solo para ti.",
      },
    },
  ],
  reviewsEyebrow: { en: "Guest stories", es: "Historias de huéspedes" },
  reviewsHeading: { en: "What our guests say.", es: "Lo que dicen nuestros huéspedes." },
  reviewsSubheading: {
    en: "Honest words from real travelers.",
    es: "Palabras honestas de viajeros reales.",
  },
  reviews: [
    {
      _key: "r1",
      name: "Sarah & David K.",
      country: "USA",
      text: {
        en: "Worth every penny. Our private catamaran day felt like something out of a magazine — and the team handled every detail. We didn't have to think about anything.",
        es: "Valió cada centavo. Nuestro día en catamarán privado parecía sacado de una revista — y el equipo manejó cada detalle. No tuvimos que pensar en nada.",
      },
      rating: 5,
      excursionTitle: "Private Catamaran Day",
    },
    {
      _key: "r2",
      name: "Liam P.",
      country: "UK",
      text: {
        en: "I've used a lot of concierge services. These guys are the best I've encountered in the Caribbean. WhatsApp replies within minutes, top-tier guide, immaculate boat.",
        es: "He usado muchos servicios de conserjería. Estos chicos son los mejores que he encontrado en el Caribe. Respuestas por WhatsApp en minutos, guía de primer nivel, barco impecable.",
      },
      rating: 5,
      excursionTitle: "Private Fishing Charter",
    },
    {
      _key: "r3",
      name: "Camille R.",
      country: "France",
      text: {
        en: "We booked the helicopter + lunch combo for our anniversary. Absolutely unforgettable. The pilot pointed out every reef and the lunch at Saona felt designed just for us.",
        es: "Reservamos el combo helicóptero + almuerzo para nuestro aniversario. Absolutamente inolvidable. El piloto señaló cada arrecife y el almuerzo en Saona parecía diseñado solo para nosotros.",
      },
      rating: 5,
      excursionTitle: "Helicopter & Saona Combo",
    },
  ],
  faqPreviewEyebrow: { en: "Frequently asked", es: "Preguntas frecuentes" },
  faqPreviewHeading: {
    en: "Good questions, clear answers.",
    es: "Buenas preguntas, respuestas claras.",
  },
  faqPreviewSubheading: {
    en: "If you don't see your question, ask our concierge — we always reply within 24 hours.",
    es: "Si no ves tu pregunta, escríbele a nuestra conserjería — siempre respondemos dentro de 24 horas.",
  },
  faqPreviewItems: [
    {
      _key: "q1",
      question: {
        en: "What makes you different from group excursion sites?",
        es: "¿Qué los hace diferentes a los sitios de excursiones en grupo?",
      },
      answer: {
        en: "Every booking with us is private. You don't share your day with strangers — it's your group, your guide, your boat. We're priced higher for that reason, but most guests tell us it's the trip-defining experience of their vacation.",
        es: "Cada reserva con nosotros es privada. No compartes tu día con extraños — es tu grupo, tu guía, tu barco. Tenemos un precio más alto por eso, pero la mayoría de huéspedes nos dicen que es la experiencia que define su viaje.",
      },
    },
    {
      _key: "q2",
      question: {
        en: "How far in advance should I book?",
        es: "¿Con cuánta anticipación debo reservar?",
      },
      answer: {
        en: "We recommend 5–7 days for peak season (Dec–Apr) and 48–72 hours otherwise. Last-minute requests are welcome — just message our concierge directly via WhatsApp.",
        es: "Recomendamos 5-7 días en temporada alta (dic-abr) y 48-72 horas en otros momentos. Las solicitudes de último minuto son bienvenidas — solo escribe directamente a nuestra conserjería por WhatsApp.",
      },
    },
    {
      _key: "q3",
      question: {
        en: "Can you arrange something not in your catalog?",
        es: "¿Pueden organizar algo que no esté en su catálogo?",
      },
      answer: {
        en: "Almost always, yes. Many of our best days are fully bespoke — a private chef at the beach, a 24-hour island trip, a marriage proposal at sea. Tell us what you have in mind.",
        es: "Casi siempre, sí. Muchos de nuestros mejores días son totalmente a medida — un chef privado en la playa, un viaje de 24 horas a una isla, una propuesta de matrimonio en el mar. Cuéntanos qué tienes en mente.",
      },
    },
  ],
  faqPreviewCtaText: {
    en: "See all questions",
    es: "Ver todas las preguntas",
  },
  ctaBannerEyebrow: { en: "Ready when you are", es: "Cuando tú digas" },
  ctaBannerHeadline: {
    en: "Let's plan your private day.",
    es: "Diseñemos tu día privado.",
  },
  ctaBannerSubheadline: {
    en: "Tell our concierge what you're dreaming of. We'll build it.",
    es: "Cuéntanos a nuestra conserjería lo que sueñas. Lo construimos.",
  },
  ctaBannerButtonText: { en: "Talk to concierge", es: "Hablar con conserjería" },
  ctaBannerButtonHref: "/contact",
  ctaBannerSecondaryButtonText: { en: "Browse excursions", es: "Ver excursiones" },
  ctaBannerSecondaryButtonHref: "/excursions",
};

// =============================================================================
// excursionsPage
// =============================================================================

const excursionsPage = {
  _id: "excursionsPage",
  _type: "excursionsPage",
  heroEyebrow: { en: "Private catalog", es: "Catálogo privado" },
  heroHeadline: {
    en: "Private experiences, hand-curated.",
    es: "Experiencias privadas, curadas a mano.",
  },
  heroSubheadline: {
    en: "Browse our private catalog, or message our concierge to design something entirely yours.",
    es: "Explora nuestro catálogo privado o escríbele a nuestra conserjería para diseñar algo totalmente tuyo.",
  },
  introEyebrow: { en: "Hand-curated", es: "Curado a mano" },
  introHeadline: {
    en: "Every excursion, vetted by us first.",
    es: "Cada excursión, verificada primero por nosotros.",
  },
  introBody: block(
    "Before anything enters this catalog, we've done it ourselves — same boat, same guide, same route. If it doesn't meet the standard we'd want for our own family, it doesn't make the list. Browse with confidence, or tell our concierge what you're dreaming of and we'll shape it around your group.",
    "Antes de que algo entre en este catálogo, lo hemos hecho nosotros mismos — el mismo barco, el mismo guía, la misma ruta. Si no cumple el estándar que querríamos para nuestra propia familia, no entra en la lista. Explora con confianza, o cuéntale a nuestra conserjería lo que sueñas y lo adaptaremos a tu grupo.",
  ),
  outroHeading: {
    en: "Private excursions in Punta Cana, done properly.",
    es: "Excursiones privadas en Punta Cana, hechas como se debe.",
  },
  outroBody: block(
    "A private excursion means your group only — your own boat, vehicle, or guide, on your schedule. We operate across Punta Cana, Bávaro, and Cap Cana with hotel pickup included, bilingual guides, and concierge support on WhatsApp from booking to drop-off.",
    "Una excursión privada significa solo tu grupo — tu propio barco, vehículo o guía, en tu horario. Operamos en Punta Cana, Bávaro y Cap Cana con recogida en el hotel incluida, guías bilingües y soporte de conserjería por WhatsApp desde la reserva hasta el regreso.",
  ),
  ctaEyebrow: { en: "Bespoke by default", es: "A medida por defecto" },
  ctaHeadline: {
    en: "Don't see your perfect day?",
    es: "¿No ves tu día perfecto?",
  },
  ctaSubheadline: {
    en: "Many of our finest experiences are fully bespoke. Tell us what you're imagining — we'll build it.",
    es: "Muchas de nuestras mejores experiencias son totalmente a medida. Cuéntanos lo que imaginas — lo construimos.",
  },
  ctaButtonText: { en: "Send a message", es: "Enviar un mensaje" },
  ctaButtonHref: "/contact",
};

// =============================================================================
// divingSnorkelingPage
// =============================================================================

const divingSnorkelingPage = {
  _id: "divingSnorkelingPage",
  _type: "divingSnorkelingPage",
  heroBadge: { en: "PRIVATE CHARTERS", es: "CHARTERS PRIVADOS" },
  heroHeadline: {
    en: "Private diving and snorkeling.",
    es: "Buceo y snorkel privados.",
  },
  heroSubheadline: {
    en: "Your own dive boat, your own dive master, and access to the most exclusive sites on the Dominican coast.",
    es: "Tu propio barco de buceo, tu propio dive master, y acceso a los sitios más exclusivos de la costa dominicana.",
  },
  heroPrimaryCTA: { text: { en: "Reserve", es: "Reservar" }, href: "/contact" },
  heroSecondaryCTA: { text: { en: "Read more", es: "Leer más" }, href: "/about" },
  introTagline: { en: "Underwater, in private", es: "Bajo el agua, en privado" },
  introHeadline: {
    en: "The Caribbean below, all to yourself.",
    es: "El Caribe submarino, todo para ti.",
  },
  introBody: block(
    "Whether you're certifying for the first time or you're a seasoned diver chasing a specific wreck, we charter the boat just for your group. PADI-certified guides, top equipment, and pickup from your resort.",
    "Ya sea que te estés certificando por primera vez o seas un buzo experimentado buscando un naufragio específico, charteamos el barco solo para tu grupo. Guías certificados PADI, equipo de primer nivel y recogida en tu resort.",
  ),
  introStats: [
    {
      _key: "is1",
      value: { en: "PADI", es: "PADI" },
      label: { en: "Certified team", es: "Equipo certificado" },
    },
    {
      _key: "is2",
      value: { en: "10+", es: "10+" },
      label: { en: "Years guiding", es: "Años guiando" },
    },
    {
      _key: "is3",
      value: { en: "1,500+", es: "1,500+" },
      label: { en: "Dives completed", es: "Inmersiones completadas" },
    },
    {
      _key: "is4",
      value: { en: "100%", es: "100%" },
      label: { en: "Private charters", es: "Charters privados" },
    },
  ],
  excursionsEyebrow: { en: "Our charters", es: "Nuestros charters" },
  excursionsHeading: {
    en: "Choose your underwater day.",
    es: "Elige tu día bajo el agua.",
  },
  coursesHeading: {
    en: "Diving courses & certifications",
    es: "Cursos y certificaciones de buceo",
  },
  coursesSubheading: {
    en: "Learn to dive or level up — private instruction from PADI pros.",
    es: "Aprende a bucear o sube de nivel — instrucción privada de profesionales PADI.",
  },
  certifiedHeading: {
    en: "For certified divers",
    es: "Para buzos certificados",
  },
  certifiedSubheading: {
    en: "Wrecks, walls, and reefs for divers with certification in hand.",
    es: "Naufragios, paredes y arrecifes para buzos con certificación en mano.",
  },
  trustEyebrow: { en: "Why us", es: "Por qué nosotros" },
  trustHeadline: {
    en: "Safety, comfort, and exclusivity.",
    es: "Seguridad, comodidad y exclusividad.",
  },
  trustCards: [
    {
      _key: "tc1",
      title: { en: "PADI-certified guides", es: "Guías certificados PADI" },
      text: {
        en: "Every dive master is PADI-certified with years of experience on these exact sites.",
        es: "Cada dive master está certificado por PADI con años de experiencia en estos mismos sitios.",
      },
    },
    {
      _key: "tc2",
      title: { en: "Safety first, always", es: "Seguridad primero, siempre" },
      text: {
        en: "Top-maintained equipment, small groups, and conservative dive plans — no exceptions.",
        es: "Equipo en óptimas condiciones, grupos pequeños y planes de buceo conservadores — sin excepciones.",
      },
    },
    {
      _key: "tc3",
      title: { en: "Your boat, your group", es: "Tu barco, tu grupo" },
      text: {
        en: "We never mix parties. The boat, the schedule, and the sites are yours alone.",
        es: "Nunca mezclamos grupos. El barco, el horario y los sitios son solo tuyos.",
      },
    },
    {
      _key: "tc4",
      title: { en: "Local site knowledge", es: "Conocimiento local" },
      text: {
        en: "Our guides grew up on this coast and know where the reef is healthiest each season.",
        es: "Nuestros guías crecieron en esta costa y saben dónde está el arrecife más saludable cada temporada.",
      },
    },
  ],
  faqEyebrow: { en: "Frequently asked", es: "Preguntas frecuentes" },
  faqHeading: {
    en: "Diving questions, answered.",
    es: "Preguntas de buceo, respondidas.",
  },
  faqItems: [
    {
      _key: "df1",
      question: {
        en: "Do I need a certification to dive with you?",
        es: "¿Necesito certificación para bucear con ustedes?",
      },
      answer: {
        en: "Not for everything. Discover Scuba experiences and snorkeling need no certification — a PADI pro guides you the whole time. Wreck and deep dives require Open Water or equivalent.",
        es: "No para todo. Las experiencias Discover Scuba y el snorkel no requieren certificación — un profesional PADI te guía todo el tiempo. Los naufragios y buceos profundos requieren Open Water o equivalente.",
      },
    },
    {
      _key: "df2",
      question: {
        en: "Is all the equipment included?",
        es: "¿Está incluido todo el equipo?",
      },
      answer: {
        en: "Yes — masks, fins, BCDs, regulators, and wetsuits are included and maintained to dive-shop standards. Just bring a swimsuit, towel, and reef-safe sunscreen.",
        es: "Sí — máscaras, aletas, BCDs, reguladores y trajes de neopreno están incluidos y mantenidos a estándares profesionales. Solo trae traje de baño, toalla y protector solar reef-safe.",
      },
    },
    {
      _key: "df3",
      question: {
        en: "What if the weather turns bad?",
        es: "¿Qué pasa si el clima empeora?",
      },
      answer: {
        en: "Safety first — if conditions aren't right, we reschedule to another day or refund your deposit in full. Your call.",
        es: "La seguridad primero — si las condiciones no son adecuadas, reprogramamos para otro día o reembolsamos tu depósito completo. Tú decides.",
      },
    },
  ],
  faqCtaText: { en: "View all FAQs", es: "Ver todas las preguntas" },
  ctaHeadline: {
    en: "Let's design your private day underwater.",
    es: "Diseñemos tu día privado bajo el agua.",
  },
  ctaButtonText: { en: "Talk to concierge", es: "Hablar con conserjería" },
  ctaWhatsappNumber: "+18295550100",
};

// =============================================================================
// aboutPage
// =============================================================================

const aboutPage = {
  _id: "aboutPage",
  _type: "aboutPage",
  heroBadge: { en: "Our story", es: "Nuestra historia" },
  heroHeadline: {
    en: "Private concierge, run with a local heart.",
    es: "Conserjería privada, con corazón local.",
  },
  heroSubheadline: {
    en: "A small team. Big standards. A genuine love for this coast.",
    es: "Un equipo pequeño. Grandes estándares. Un amor genuino por esta costa.",
  },
  storyTagline: { en: "How we started", es: "Cómo empezamos" },
  storyHeadline: {
    en: "A small concierge house with very large standards.",
    es: "Una pequeña casa de conserjería con grandes estándares.",
  },
  storyBody: block(
    "We started because the best travelers we knew kept asking the same question: \"Where's the version of this that's actually private?\" There wasn't a great answer — so we built it. We hand-pick guides we'd trust with our own family. We charter the boats we'd want to spend the day on. We answer WhatsApp within minutes, not hours. And we say no to bookings we can't deliver on, because reputation is the whole business.",
    "Empezamos porque los mejores viajeros que conocíamos hacían siempre la misma pregunta: «¿Dónde está la versión privada de esto?» No había una buena respuesta — así que la construimos. Seleccionamos a mano guías en los que confiaríamos a nuestra propia familia. Charteamos los barcos en los que querríamos pasar el día. Respondemos WhatsApp en minutos, no horas. Y decimos no a las reservas que no podemos cumplir, porque la reputación es todo el negocio.",
  ),
  foundedLabel: { en: "Founded in 2019", es: "Fundado en 2019" },
  statsHeadline: {
    en: "Numbers we're proud of.",
    es: "Números de los que estamos orgullosos.",
  },
  stats: [
    {
      _key: "st1",
      value: { en: "2,400+", es: "2,400+" },
      label: { en: "Private days hosted", es: "Días privados organizados" },
    },
    {
      _key: "st2",
      value: { en: "4.97", es: "4.97" },
      label: { en: "Average guest rating", es: "Calificación promedio" },
    },
    {
      _key: "st3",
      value: { en: "12", es: "12" },
      label: { en: "Hand-picked guides", es: "Guías seleccionados" },
    },
    {
      _key: "st4",
      value: { en: "<20 min", es: "<20 min" },
      label: { en: "Avg WhatsApp reply", es: "Respuesta WhatsApp promedio" },
    },
  ],
  valuesEyebrow: { en: "What we value", es: "Lo que valoramos" },
  valuesHeadline: { en: "What guides us.", es: "Lo que nos guía." },
  valuesSubheading: {
    en: "Four principles. No exceptions.",
    es: "Cuatro principios. Sin excepciones.",
  },
  values: [
    {
      _key: "v1",
      icon: "safety",
      title: { en: "Truly private", es: "Verdaderamente privado" },
      description: {
        en: "Your group only. Always. We turn away bookings that would compromise this.",
        es: "Solo tu grupo. Siempre. Rechazamos reservas que comprometan esto.",
      },
    },
    {
      _key: "v2",
      icon: "local",
      title: { en: "Real local knowledge", es: "Conocimiento local real" },
      description: {
        en: "Our guides aren't reading a script. They grew up here.",
        es: "Nuestros guías no leen un guión. Crecieron aquí.",
      },
    },
    {
      _key: "v3",
      icon: "trust",
      title: { en: "Show up early, leave it better", es: "Llegar antes, dejarlo mejor" },
      description: {
        en: "Pickups are never late. Sites we visit are always left cleaner than we found them.",
        es: "Las recogidas nunca son tarde. Los sitios que visitamos siempre quedan más limpios que como los encontramos.",
      },
    },
    {
      _key: "v4",
      icon: "reviews",
      title: { en: "Reputation over volume", es: "Reputación sobre volumen" },
      description: {
        en: "We'd rather host fewer perfect days than more mediocre ones.",
        es: "Preferimos organizar menos días perfectos que más días mediocres.",
      },
    },
  ],
  teamHeadline: {
    en: "The people behind the journey.",
    es: "La gente detrás del viaje.",
  },
  teamSubheading: {
    en: "Three founders, twelve guides, one shared standard.",
    es: "Tres fundadores, doce guías, un estándar compartido.",
  },
  ctaEyebrow: { en: "Ready when you are", es: "Cuando tú digas" },
  ctaHeadline: {
    en: "Let's design your day.",
    es: "Diseñemos tu día.",
  },
  ctaSubheadline: {
    en: "Concierge available daily, 8am – 9pm AST.",
    es: "Conserjería disponible diariamente, 8am – 9pm AST.",
  },
  ctaPrimaryButton: {
    label: { en: "Talk to concierge", es: "Hablar con conserjería" },
    href: "/contact",
  },
  ctaSecondaryButton: {
    label: { en: "WhatsApp", es: "WhatsApp" },
    href: "https://wa.me/18295550100",
  },
};

// =============================================================================
// howItWorksPage
// =============================================================================

const howItWorksPage = {
  _id: "howItWorksPage",
  _type: "howItWorksPage",
  heroEyebrow: { en: "How it works", es: "Cómo funciona" },
  heroHeadline: { en: "Booking is simple.", es: "Reservar es sencillo." },
  heroSubheadline: {
    en: "Three short steps between you and a perfect private day.",
    es: "Tres pasos cortos entre tú y un día privado perfecto.",
  },
  stepsEyebrow: { en: "Three steps", es: "Tres pasos" },
  stepsHeading: { en: "Three steps", es: "Tres pasos" },
  stepsSubheading: {
    en: "From inquiry to hotel pickup, it's clear and personal.",
    es: "Desde la consulta hasta la recogida, todo claro y personal.",
  },
  steps: homePage.bookingSteps.map((s) => ({ ...s })),
  faqEyebrow: { en: "Frequently asked", es: "Preguntas frecuentes" },
  faqHeading: {
    en: "Frequently asked",
    es: "Preguntas frecuentes",
  },
  faqSubheading: {
    en: "Quick answers to common questions.",
    es: "Respuestas rápidas a preguntas comunes.",
  },
  faqItems: homePage.faqPreviewItems.map((f) => ({ ...f })),
  ctaEyebrow: { en: "Ready when you are", es: "Cuando tú digas" },
  ctaHeadline: { en: "Ready to design your day?", es: "¿Listo para diseñar tu día?" },
  ctaSubheadline: {
    en: "Tell us what you have in mind. We'll handle the rest.",
    es: "Cuéntanos lo que tienes en mente. Nosotros nos encargamos del resto.",
  },
  ctaButtonText: { en: "Get started", es: "Empezar" },
  ctaButtonHref: "/contact",
  ctaSecondaryButtonText: { en: "Browse excursions", es: "Ver excursiones" },
  ctaSecondaryButtonHref: "/excursions",
};

// =============================================================================
// faqPage
// =============================================================================

const faqPage = {
  _id: "faqPage",
  _type: "faqPage",
  heroEyebrow: { en: "Frequently asked", es: "Preguntas frecuentes" },
  heroHeadline: {
    en: "What our guests ask.",
    es: "Lo que preguntan nuestros huéspedes.",
  },
  heroSubheadline: {
    en: "Honest answers about how we work, what's included, and what to expect.",
    es: "Respuestas honestas sobre cómo trabajamos, qué se incluye y qué esperar.",
  },
  categories: [
    {
      _key: "cat1",
      categoryName: { en: "Booking", es: "Reservas" },
      subtitle: {
        en: "Booking, deposits, and how payment works",
        es: "Reservas, depósitos y cómo funciona el pago",
      },
      icon: "booking",
      items: [
        {
          _key: "f1",
          question: {
            en: "How far in advance should I book?",
            es: "¿Con cuánta anticipación debo reservar?",
          },
          answer: {
            en: "5–7 days for peak season (Dec–Apr), 48–72 hours otherwise. Last-minute requests are welcome via WhatsApp.",
            es: "5-7 días en temporada alta (dic-abr), 48-72 horas en otros momentos. Solicitudes de último minuto bienvenidas por WhatsApp.",
          },
        },
        {
          _key: "f2",
          question: {
            en: "How does the deposit work?",
            es: "¿Cómo funciona el depósito?",
          },
          answer: {
            en: "We hold your private charter with a small PayPal deposit. The remainder is paid in cash or card on the day of your experience.",
            es: "Reservamos tu charter privado con un pequeño depósito por PayPal. El resto se paga en efectivo o tarjeta el día de la experiencia.",
          },
        },
      ],
    },
    {
      _key: "cat2",
      categoryName: { en: "On the day", es: "El día de la experiencia" },
      subtitle: {
        en: "Pickup, weather, and what to expect",
        es: "Recogida, clima y qué esperar",
      },
      icon: "day",
      items: [
        {
          _key: "f3",
          question: {
            en: "Will you pick us up at our hotel?",
            es: "¿Nos recogerán en el hotel?",
          },
          answer: {
            en: "Yes — included for every excursion. Air-conditioned luxury SUV or Sprinter van depending on group size. We send WhatsApp confirmation with exact pickup time 24h before.",
            es: "Sí — incluido en cada excursión. SUV de lujo o van Sprinter con aire acondicionado según el tamaño del grupo. Enviamos confirmación por WhatsApp con la hora exacta de recogida 24h antes.",
          },
        },
        {
          _key: "f4",
          question: {
            en: "What happens if the weather is bad?",
            es: "¿Qué pasa si el clima está mal?",
          },
          answer: {
            en: "Your safety is our priority. If we cancel due to weather, we offer a full reschedule or a 100% refund of your deposit. You're never out of pocket.",
            es: "Tu seguridad es nuestra prioridad. Si cancelamos por clima, ofrecemos reprogramación completa o reembolso 100% del depósito. Nunca pierdes dinero.",
          },
        },
      ],
    },
    {
      _key: "cat3",
      categoryName: { en: "Privacy & exclusivity", es: "Privacidad y exclusividad" },
      icon: "★",
      items: [
        {
          _key: "f5",
          question: {
            en: "Is every excursion really just for my group?",
            es: "¿Cada excursión es realmente solo para mi grupo?",
          },
          answer: {
            en: "Yes. We never combine bookings. The boat, guide, and vehicle are yours alone for the duration.",
            es: "Sí. Nunca combinamos reservas. El barco, el guía y el vehículo son solo para ti durante toda la experiencia.",
          },
        },
        {
          _key: "f6",
          question: {
            en: "Can you arrange something fully bespoke?",
            es: "¿Pueden organizar algo totalmente a medida?",
          },
          answer: {
            en: "Almost always. Many of our best days are entirely custom — a private chef on the beach, a marriage proposal at sea, a 24-hour island trip. Tell us what you have in mind.",
            es: "Casi siempre. Muchos de nuestros mejores días son totalmente a medida — un chef privado en la playa, una propuesta de matrimonio en el mar, un viaje de 24h a una isla. Cuéntanos qué tienes en mente.",
          },
        },
      ],
    },
  ],
  ctaEyebrow: { en: "Still have questions?", es: "¿Aún tienes preguntas?" },
  ctaHeadline: {
    en: "Didn't find your answer?",
    es: "¿No encontraste tu respuesta?",
  },
  ctaSubheadline: {
    en: "Our concierge replies within 24 hours.",
    es: "Nuestra conserjería responde dentro de 24 horas.",
  },
  ctaButtonText: { en: "Talk to concierge", es: "Hablar con conserjería" },
  ctaButtonHref: "/contact",
  ctaSecondaryButtonText: { en: "Browse excursions", es: "Ver excursiones" },
  ctaSecondaryButtonHref: "/excursions",
};

// =============================================================================
// contactPage
// =============================================================================

const contactPage = {
  _id: "contactPage",
  _type: "contactPage",
  heroEyebrow: { en: "Private concierge", es: "Conserjería privada" },
  heroHeadline: {
    en: "Let's design your day together.",
    es: "Diseñemos tu día juntos.",
  },
  heroSubheadline: {
    en: "Our concierge replies within 24 hours, often the same day.",
    es: "Nuestra conserjería responde en 24 horas, a menudo el mismo día.",
  },
  formHeadline: {
    en: "Tell us about your trip",
    es: "Cuéntanos sobre tu viaje",
  },
  formIntroLine: {
    en: "Share a few details and our concierge will craft a plan around your group — no obligation, no pressure.",
    es: "Comparte algunos detalles y nuestra conserjería diseñará un plan para tu grupo — sin compromiso, sin presión.",
  },
  infoHeadline: {
    en: "Other ways to reach us",
    es: "Otras formas de contactarnos",
  },
};

// =============================================================================
// blogPage
// =============================================================================

const blogPage = {
  _id: "blogPage",
  _type: "blogPage",
  heroEyebrow: { en: "Journal", es: "Revista" },
  heroHeadline: {
    en: "Stories, guides, and tips from Punta Cana.",
    es: "Historias, guías y consejos de Punta Cana.",
  },
  heroSubheadline: {
    en: "From our concierge team — what we'd tell our friends visiting the coast.",
    es: "De nuestro equipo de conserjería — lo que le diríamos a nuestros amigos que visitan la costa.",
  },
  ctaEyebrow: { en: "Ready when you are", es: "Cuando tú digas" },
  ctaHeadline: {
    en: "Done reading? Let's plan the real thing.",
    es: "¿Listo para vivirlo en persona?",
  },
  ctaSubheadline: {
    en: "Our concierge turns these guides into your itinerary.",
    es: "Nuestra conserjería convierte estas guías en tu itinerario.",
  },
  ctaButtonText: { en: "Talk to concierge", es: "Hablar con conserjería" },
  ctaButtonHref: "/contact",
  ctaSecondaryButtonText: { en: "Browse excursions", es: "Ver excursiones" },
  ctaSecondaryButtonHref: "/excursions",
};

// =============================================================================
// legalDocument × 3
// =============================================================================

const legalDocs = [
  {
    _id: "privacy-policy",
    _type: "legalDocument",
    title: { en: "Privacy Policy", es: "Política de Privacidad" },
    lastUpdated: new Date().toISOString().slice(0, 10),
    body: block(
      "We respect your privacy. This is a placeholder Privacy Policy — please replace it with the version reviewed by your legal counsel before launch.",
      "Respetamos tu privacidad. Esta es una política de privacidad de marcador — reemplázala con la versión revisada por tu asesor legal antes del lanzamiento.",
    ),
  },
  {
    _id: "terms-of-service",
    _type: "legalDocument",
    title: { en: "Terms of Service", es: "Términos de Servicio" },
    lastUpdated: new Date().toISOString().slice(0, 10),
    body: block(
      "These Terms govern your use of Punta Cana Private Excursions. This is a placeholder — please replace with the version reviewed by legal.",
      "Estos Términos rigen tu uso de Punta Cana Excursiones Privadas. Este es un marcador — reemplaza con la versión revisada legalmente.",
    ),
  },
  {
    _id: "cancellation-policy",
    _type: "legalDocument",
    title: { en: "Cancellation Policy", es: "Política de Cancelación" },
    lastUpdated: new Date().toISOString().slice(0, 10),
    body: block(
      "Free cancellation up to 48 hours before your experience. Within 48 hours, the deposit becomes non-refundable. Weather-related cancellations: 100% refund or free reschedule.",
      "Cancelación gratuita hasta 48 horas antes de tu experiencia. Dentro de las 48 horas, el depósito no es reembolsable. Cancelaciones por clima: reembolso 100% o reprogramación gratuita.",
    ),
  },
];

// =============================================================================
// excursionCategories
// =============================================================================

const categories = [
  {
    _id: "cat-sea",
    _type: "excursionCategory",
    slug: { _type: "slug", current: "sea" },
    title: { en: "By Sea", es: "Por Mar" },
    sortOrder: 1,
  },
  {
    _id: "cat-sky",
    _type: "excursionCategory",
    slug: { _type: "slug", current: "sky" },
    title: { en: "By Sky", es: "Por Cielo" },
    sortOrder: 2,
  },
  {
    _id: "cat-land",
    _type: "excursionCategory",
    slug: { _type: "slug", current: "land" },
    title: { en: "By Land", es: "Por Tierra" },
    sortOrder: 3,
  },
  {
    _id: "cat-culinary",
    _type: "excursionCategory",
    slug: { _type: "slug", current: "culinary" },
    title: { en: "Culinary", es: "Gastronomía" },
    sortOrder: 4,
  },
];

// =============================================================================
// excursions — 5 hero VIP experiences
// =============================================================================

function exc(
  slug: string,
  titleEn: string,
  titleEs: string,
  summaryEn: string,
  summaryEs: string,
  price: number,
  deposit: number,
  durationEn: string,
  durationEs: string,
  categoryId: string,
  maxGuests: number,
  isFeatured: boolean,
  sortOrder: number,
  vipEn: string,
  vipEs: string,
) {
  return {
    _id: `excursion-${slug}`,
    _type: "excursion",
    title: { en: titleEn, es: titleEs },
    slug: { _type: "slug", current: slug },
    shortSummary: { en: summaryEn, es: summaryEs },
    price,
    depositAmount: deposit,
    childPrice: Math.round(price * 0.6),
    duration: { en: durationEn, es: durationEs },
    category: { _type: "reference", _ref: categoryId },
    isFeatured,
    sortOrder,
    activityLevel: "moderate",
    maxGuests,
    pickupTime: { en: "8:30 AM (varies by hotel)", es: "8:30 AM (varía por hotel)" },
    pickupZones: ["bavaro", "cap-cana", "uvero-alto"],
    groupSize: {
      en: `Private — up to ${maxGuests} guests`,
      es: `Privado — hasta ${maxGuests} huéspedes`,
    },
    daysAvailable: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    bookingNoticeHours: 48,
    highlights: {
      en: [
        "Truly private — your group only",
        "Hand-picked bilingual guide",
        "Luxury hotel pickup included",
        "Concierge on WhatsApp throughout the day",
      ],
      es: [
        "Verdaderamente privado — solo tu grupo",
        "Guía bilingüe seleccionado a mano",
        "Recogida en hotel de lujo incluida",
        "Conserjería por WhatsApp durante todo el día",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip luxury transfer",
        "Private guide",
        "All taxes and gratuities",
        "Bottled water and refreshments",
      ],
      es: [
        "Traslado de ida y vuelta de lujo",
        "Guía privado",
        "Todos los impuestos y propinas",
        "Agua embotellada y refrigerios",
      ],
    },
    whatToBring: {
      en: ["Sunscreen", "Camera", "Light jacket for the ride"],
      es: ["Protector solar", "Cámara", "Chaqueta ligera para el viaje"],
    },
    restrictions: {
      en: ["Not recommended for pregnant guests in late term"],
      es: ["No recomendado para huéspedes embarazadas en término avanzado"],
    },
    vipInclusions: block(vipEn, vipEs),
    faq: [
      {
        _key: `f-${slug}-1`,
        question: {
          en: "Can you customize this experience for our anniversary?",
          es: "¿Pueden personalizar esta experiencia para nuestro aniversario?",
        },
        answer: {
          en: "Absolutely. Tell us a bit about the occasion and we'll arrange the perfect touches — champagne, flowers, private photographer. Just let our concierge know.",
          es: "Por supuesto. Cuéntanos un poco sobre la ocasión y arreglaremos los toques perfectos — champán, flores, fotógrafo privado. Solo dile a nuestra conserjería.",
        },
      },
    ],
  };
}

const excursions = [
  exc(
    "private-catamaran-day",
    "Private Catamaran Day",
    "Día Privado en Catamarán",
    "Your own 50-foot catamaran for the day. Sail to a sandbar lunch, snorkel a reef, and return at golden hour.",
    "Tu propio catamarán de 50 pies por un día. Navega a un banco de arena para almorzar, haz snorkel en un arrecife y regresa al atardecer.",
    1450,
    250,
    "7 hours",
    "7 horas",
    "cat-sea",
    12,
    true,
    1,
    "Champagne and fresh-cut fruit aboard. Open bar with premium spirits. Underwater drone photographer included.",
    "Champán y fruta fresca a bordo. Barra libre con licores premium. Fotógrafo con drone submarino incluido.",
  ),
  exc(
    "private-fishing-charter",
    "Private Deep-Sea Fishing Charter",
    "Charter Privado de Pesca de Altura",
    "Half-day or full-day on a captain-operated sportfisher. Marlin, mahi, tuna — and the boat is yours alone.",
    "Medio día o día completo en un barco deportivo. Marlín, dorado, atún — y el barco es solo tuyo.",
    1800,
    300,
    "6 hours",
    "6 horas",
    "cat-sea",
    6,
    true,
    2,
    "Mate-prepared sushi onboard from your catch. Photos with your trophy. Iced premium beer and rum cooler.",
    "Sushi preparado a bordo con tu pesca. Fotos con tu trofeo. Cerveza premium fría y cooler de ron.",
  ),
  exc(
    "helicopter-saona-combo",
    "Helicopter & Saona Island Combo",
    "Combo Helicóptero y Saona",
    "Fly over the reef line, land at a private cove on Saona Island, lunch on the sand, then return by speedboat.",
    "Vuela sobre los arrecifes, aterriza en una cala privada de Saona, almuerza en la arena y regresa en lancha rápida.",
    3400,
    600,
    "Full day",
    "Día completo",
    "cat-sky",
    4,
    true,
    3,
    "Private chef lunch on the beach with linen table and Caribbean menu. Helicopter aerial photos included. Door-off option for photographers on request.",
    "Almuerzo con chef privado en la playa con mesa de lino y menú caribeño. Fotos aéreas en helicóptero incluidas. Opción puertas abiertas para fotógrafos bajo solicitud.",
  ),
  exc(
    "private-buggy-tour",
    "Private Buggy & Beach Tour",
    "Tour Privado en Buggy y Playa",
    "Convoy through the countryside, swim in a freshwater cenote, and finish on an empty beach with cold drinks.",
    "Caravana por el campo, baño en un cenote de agua dulce, y final en una playa vacía con bebidas frías.",
    650,
    100,
    "5 hours",
    "5 horas",
    "cat-land",
    8,
    true,
    4,
    "Convoy with no shared groups. Lead guide on radio. Towels, GoPro footage, and finishing drinks included.",
    "Caravana sin grupos compartidos. Guía líder por radio. Toallas, grabación con GoPro y bebidas finales incluidas.",
  ),
  exc(
    "private-chef-beach-dinner",
    "Private Chef Beach Dinner",
    "Cena Privada en Playa con Chef",
    "A private chef sets up a table on the sand at sunset. Multi-course Dominican menu, paired wines, candlelight.",
    "Un chef privado prepara una mesa en la arena al atardecer. Menú dominicano de varios platos, vinos maridados, velas.",
    1100,
    200,
    "3 hours",
    "3 horas",
    "cat-culinary",
    6,
    false,
    5,
    "Linen table, candles, hand-tied flowers. Tasting menu of 5 courses with paired wines. Optional violinist or guitarist.",
    "Mesa de lino, velas, flores anudadas a mano. Menú de degustación de 5 platos con vinos maridados. Violinista o guitarrista opcional.",
  ),
];

// =============================================================================
// Run
// =============================================================================

async function seed() {
  console.log(`🌴 Seeding into project ${projectId} / dataset ${dataset}\n`);

  const all = [
    generalLayout,
    homePage,
    excursionsPage,
    divingSnorkelingPage,
    aboutPage,
    howItWorksPage,
    faqPage,
    contactPage,
    blogPage,
    ...legalDocs,
    ...categories,
    ...excursions,
  ];

  let i = 0;
  for (const doc of all) {
    i += 1;
    process.stdout.write(`[${i}/${all.length}] ${doc._type} (${doc._id})... `);
    try {
      await client.createOrReplace(doc as never);
      console.log("✓");
    } catch (err) {
      console.log("✗");
      console.error(err);
      process.exit(1);
    }
  }

  console.log(`\n✅ Seeded ${all.length} documents.`);
  console.log("\nNote: images were intentionally omitted. Upload via Studio at /studio.");
}

seed();

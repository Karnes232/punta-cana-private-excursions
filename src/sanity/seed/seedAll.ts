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
    localizedSlug: {
      en: { _type: "slug", current: slug },
      es: { _type: "slug", current: slug },
    },
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
// divingExcursions — 13 PADI courses + certified-diver trips
// (sourced from puntacana-excursions.com marketplace)
// =============================================================================

interface Loc {
  en: string;
  es: string;
}
interface LocArr {
  en: string[];
  es: string[];
}
interface DivingFaq {
  q: Loc;
  a: Loc;
}

function divingExc(opts: {
  slugEn: string;
  slugEs: string;
  title: Loc;
  summary: Loc;
  description: Loc;
  audienceType: "course" | "certified" | "all";
  experienceLevel: "all-levels" | "beginner" | "intermediate" | "advanced";
  certificationRequired: boolean;
  certificationDetails?: Loc;
  maxDepth: Loc;
  numberOfDives?: number;
  marineLife: LocArr;
  equipmentProvided: LocArr;
  price: number;
  deposit: number;
  duration: Loc;
  groupSize: Loc;
  highlights: LocArr;
  whatsIncluded: LocArr;
  restrictions: LocArr;
  faq: DivingFaq[];
  sortOrder: number;
  isFeatured?: boolean;
  badge?: Loc;
}) {
  return {
    _id: `divingExcursion-${opts.slugEn}`,
    _type: "divingExcursion",
    title: opts.title,
    localizedSlug: {
      en: { _type: "slug", current: opts.slugEn },
      es: { _type: "slug", current: opts.slugEs },
    },
    externalBookingUrl: `https://puntacana-excursions.com/scuba-diving/${opts.slugEn}`,
    shortSummary: opts.summary,
    fullDescription: block(opts.description.en, opts.description.es),
    audienceType: opts.audienceType,
    experienceLevel: opts.experienceLevel,
    certificationRequired: opts.certificationRequired,
    ...(opts.certificationDetails
      ? { certificationDetails: opts.certificationDetails }
      : {}),
    maxDepth: opts.maxDepth,
    ...(opts.numberOfDives ? { numberOfDives: opts.numberOfDives } : {}),
    marineLife: opts.marineLife,
    equipmentProvided: opts.equipmentProvided,
    price: opts.price,
    depositAmount: opts.deposit,
    priceNote: { en: "per person", es: "por persona" },
    duration: opts.duration,
    pickupTime: {
      en: "7:00 AM – 8:30 AM (varies by hotel)",
      es: "7:00 AM – 8:30 AM (varía por hotel)",
    },
    pickupZones: ["bavaro", "cap-cana", "punta-cana", "uvero-alto"],
    groupSize: opts.groupSize,
    highlights: opts.highlights,
    whatsIncluded: opts.whatsIncluded,
    whatToBring: {
      en: ["Swimwear", "Towel", "Reef-safe sunscreen", "Cash for tips (optional)"],
      es: [
        "Traje de baño",
        "Toalla",
        "Protector solar reef-safe",
        "Efectivo para propinas (opcional)",
      ],
    },
    restrictions: opts.restrictions,
    faq: opts.faq.map((f, idx) => ({
      _key: `f-${opts.slugEn}-${idx + 1}`,
      question: f.q,
      answer: f.a,
    })),
    isFeatured: opts.isFeatured ?? false,
    ...(opts.badge ? { badge: opts.badge } : {}),
    sortOrder: opts.sortOrder,
  };
}

// Shared restriction line appended to every dive
const NO_FLYING: Loc = {
  en: "No flying within 18 hours after diving",
  es: "No volar dentro de las 18 horas posteriores al buceo",
};

const divingExcursions = [
  // ----- COURSES -----------------------------------------------------------
  divingExc({
    slugEn: "discover-scuba-diving",
    slugEs: "descubre-el-buceo",
    title: { en: "Discover Scuba Diving", es: "Descubre el Buceo" },
    summary: {
      en: "A beginner-friendly PADI intro to scuba — no certification or experience required. Breathe underwater safely with a certified instructor and explore Punta Cana's coral reefs.",
      es: "Una introducción PADI al buceo para principiantes — sin certificación ni experiencia. Respira bajo el agua con seguridad junto a un instructor certificado y explora los arrecifes de Punta Cana.",
    },
    description: {
      en: "This introductory program lets curious first-timers experience breathing underwater in a safe, fun, and relaxed environment. Over one day you'll head into the underwater world to depths of 6–12 meters (20–40 ft), guided every moment by an experienced PADI instructor. No certification is awarded, but the dive can be credited toward a future PADI Open Water Diver certification if you decide to continue.",
      es: "Este programa introductorio permite a los curiosos principiantes experimentar la respiración bajo el agua en un entorno seguro, divertido y relajado. Durante un día te adentrarás en el mundo submarino a profundidades de 6–12 metros (20–40 ft), guiado en todo momento por un instructor PADI experimentado. No otorga certificación, pero la inmersión puede acreditarse para una futura certificación PADI Open Water Diver si decides continuar.",
    },
    audienceType: "course",
    experienceLevel: "all-levels",
    certificationRequired: false,
    certificationDetails: {
      en: "No certification provided — credits toward a future PADI Open Water Diver certification.",
      es: "No otorga certificación — se acredita para una futura certificación PADI Open Water Diver.",
    },
    maxDepth: { en: "12 meters (40 ft)", es: "12 metros (40 ft)" },
    numberOfDives: 1,
    marineLife: {
      en: ["Tropical reef fish", "Stingrays", "Coral gardens", "Moray eels"],
      es: ["Peces tropicales de arrecife", "Rayas", "Jardines de coral", "Morenas"],
    },
    equipmentProvided: {
      en: ["Mask, snorkel & fins", "BCD & regulator", "Wetsuit", "Air tank", "Weights"],
      es: ["Máscara, snorkel y aletas", "BCD y regulador", "Traje de neopreno", "Tanque de aire", "Plomos"],
    },
    price: 100,
    deposit: 50,
    duration: { en: "2.5 hours", es: "2.5 horas" },
    groupSize: { en: "Small group — personalized attention", es: "Grupo pequeño — atención personalizada" },
    highlights: {
      en: [
        "No certification or experience required",
        "Guided by certified PADI instructors",
        "Explore Punta Cana's coral reefs",
        "All equipment included",
      ],
      es: [
        "Sin certificación ni experiencia",
        "Guiado por instructores PADI certificados",
        "Explora los arrecifes de Punta Cana",
        "Todo el equipo incluido",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor",
        "Full scuba equipment",
        "Theory briefing and safety overview",
        "One open-water dive",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI certificado",
        "Equipo de buceo completo",
        "Sesión teórica y de seguridad",
        "Una inmersión en aguas abiertas",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 10 years",
        "Basic water comfort recommended",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        "Not recommended for pregnant women",
        NO_FLYING.en,
      ],
      es: [
        "Edad mínima: 10 años",
        "Se recomienda comodidad básica en el agua",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        "No recomendado para mujeres embarazadas",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Do I need certification to participate?", es: "¿Necesito certificación para participar?" },
        a: {
          en: "No. The program is designed specifically for beginners — no certification or experience required.",
          es: "No. El programa está diseñado específicamente para principiantes — sin certificación ni experiencia.",
        },
      },
      {
        q: { en: "Will I receive a certification?", es: "¿Recibiré una certificación?" },
        a: {
          en: "Not from this program, but the dive can count toward a future PADI Open Water Diver certification.",
          es: "No con este programa, pero la inmersión puede contar para una futura certificación PADI Open Water Diver.",
        },
      },
      {
        q: { en: "Do I need to know how to swim?", es: "¿Necesito saber nadar?" },
        a: {
          en: "Basic water comfort is recommended. Instructors guide you step by step and prioritize safety throughout.",
          es: "Se recomienda comodidad básica en el agua. Los instructores te guían paso a paso y priorizan la seguridad en todo momento.",
        },
      },
    ],
    sortOrder: 1,
    isFeatured: true,
    badge: { en: "No certification needed", es: "Sin certificación" },
  }),

  divingExc({
    slugEn: "padi-scuba-diver-course",
    slugEs: "curso-padi-scuba-diver",
    title: { en: "PADI Scuba Diver Course", es: "Curso PADI Scuba Diver" },
    summary: {
      en: "A beginner-friendly 2-day PADI certification combining online theory, pool training, and two Caribbean open-water dives — dive to 12 m under professional supervision worldwide.",
      es: "Una certificación PADI de 2 días para principiantes que combina teoría en línea, entrenamiento en piscina y dos inmersiones en el Caribe — bucea a 12 m bajo supervisión profesional en todo el mundo.",
    },
    description: {
      en: "The PADI Scuba Diver course is an entry-level certification combining dive theory with hands-on training. Complete the theory online via PADI eLearning before arrival, then train in confined water with personalized attention in small groups. The course finishes with two open-water dives in Punta Cana's turquoise waters. On completion you can dive to 12 meters (40 ft) under PADI professional supervision anywhere in the world — and upgrade to the full Open Water Diver certification anytime.",
      es: "El curso PADI Scuba Diver es una certificación de nivel inicial que combina teoría con entrenamiento práctico. Completa la teoría en línea con PADI eLearning antes de llegar, luego entrena en aguas confinadas con atención personalizada en grupos pequeños. El curso termina con dos inmersiones en las aguas turquesas de Punta Cana. Al completarlo podrás bucear hasta 12 metros (40 ft) bajo supervisión profesional PADI en cualquier parte del mundo — y subir a la certificación completa Open Water Diver cuando quieras.",
    },
    audienceType: "course",
    experienceLevel: "beginner",
    certificationRequired: false,
    certificationDetails: {
      en: "Entry-level certification valid worldwide. Upgradable to PADI Open Water Diver.",
      es: "Certificación de nivel inicial válida en todo el mundo. Ampliable a PADI Open Water Diver.",
    },
    maxDepth: { en: "12 meters (40 ft)", es: "12 metros (40 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Coral reefs", "Tropical reef fish", "Sea turtles", "Moray eels", "Stingrays"],
      es: ["Arrecifes de coral", "Peces tropicales", "Tortugas marinas", "Morenas", "Rayas"],
    },
    equipmentProvided: {
      en: ["Mask, snorkel & fins", "BCD & regulator", "Wetsuit", "Air tanks", "Weights"],
      es: ["Máscara, snorkel y aletas", "BCD y regulador", "Traje de neopreno", "Tanques de aire", "Plomos"],
    },
    price: 380,
    deposit: 190,
    duration: { en: "2 days", es: "2 días" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "Worldwide-recognized PADI certification",
        "Complete theory online before arrival",
        "Confined-water training with personalized attention",
        "Two open-water dives in the Caribbean",
        "Upgradable to PADI Open Water Diver anytime",
      ],
      es: [
        "Certificación PADI reconocida mundialmente",
        "Completa la teoría en línea antes de llegar",
        "Entrenamiento en aguas confinadas con atención personalizada",
        "Dos inmersiones en el Caribe",
        "Ampliable a PADI Open Water Diver cuando quieras",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "PADI eLearning course access",
        "Certified PADI instructor",
        "All scuba equipment",
        "Confined-water training session",
        "Two open-water dives",
        "PADI Scuba Diver certification card",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Acceso al curso PADI eLearning",
        "Instructor PADI certificado",
        "Todo el equipo de buceo",
        "Sesión de entrenamiento en aguas confinadas",
        "Dos inmersiones en aguas abiertas",
        "Tarjeta de certificación PADI Scuba Diver",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 10 years",
        "Basic swimming ability required",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        "Not recommended for pregnant women",
        NO_FLYING.en,
      ],
      es: [
        "Edad mínima: 10 años",
        "Se requiere capacidad básica de natación",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        "No recomendado para mujeres embarazadas",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Is this course good for a short vacation?", es: "¿Es bueno este curso para unas vacaciones cortas?" },
        a: {
          en: "Yes — it's ideal for travelers with limited time who want to earn a certification in just a couple of days.",
          es: "Sí — es ideal para viajeros con tiempo limitado que quieren obtener una certificación en solo un par de días.",
        },
      },
      {
        q: { en: "Is the certification valid worldwide?", es: "¿La certificación es válida en todo el mundo?" },
        a: {
          en: "Yes. It's recognized internationally and lets you dive worldwide under professional supervision.",
          es: "Sí. Está reconocida internacionalmente y te permite bucear en todo el mundo bajo supervisión profesional.",
        },
      },
    ],
    sortOrder: 2,
  }),

  divingExc({
    slugEn: "padi-open-water-diver-course",
    slugEs: "curso-padi-open-water-diver",
    title: { en: "PADI Open Water Diver Course", es: "Curso PADI Open Water Diver" },
    summary: {
      en: "The world's most popular scuba certification — three days, four open-water dives, and a lifelong credential to dive independently with a buddy anywhere in the world.",
      es: "La certificación de buceo más popular del mundo — tres días, cuatro inmersiones y una credencial de por vida para bucear de forma independiente con un compañero en cualquier parte del mundo.",
    },
    description: {
      en: "This is the world's most sought-after entry-level certification, combining online learning, confined-water training, and four open-water dives. Complete the theory on PADI eLearning before arrival, spend your first day mastering skills in a controlled environment, then explore real reefs and wrecks across four dives. The certification is recognized internationally, never expires, and is your gateway to advanced certifications. After certifying you can dive to 18 meters with a buddy following safe diving practices.",
      es: "Esta es la certificación de nivel inicial más solicitada del mundo, combinando aprendizaje en línea, entrenamiento en aguas confinadas y cuatro inmersiones. Completa la teoría con PADI eLearning antes de llegar, dedica tu primer día a dominar habilidades en un entorno controlado y luego explora arrecifes y naufragios reales en cuatro inmersiones. La certificación está reconocida internacionalmente, nunca caduca y es tu puerta a certificaciones avanzadas. Tras certificarte podrás bucear hasta 18 metros con un compañero siguiendo prácticas seguras.",
    },
    audienceType: "course",
    experienceLevel: "beginner",
    certificationRequired: false,
    certificationDetails: {
      en: "PADI Open Water Diver certification — recognized worldwide and never expires.",
      es: "Certificación PADI Open Water Diver — reconocida mundialmente y nunca caduca.",
    },
    maxDepth: { en: "18 meters (60 ft)", es: "18 metros (60 ft)" },
    numberOfDives: 4,
    marineLife: {
      en: ["Coral reefs", "Sea turtles", "Tropical reef fish", "Moray eels", "Stingrays", "Octopus"],
      es: ["Arrecifes de coral", "Tortugas marinas", "Peces tropicales", "Morenas", "Rayas", "Pulpos"],
    },
    equipmentProvided: {
      en: ["Mask, snorkel & fins", "BCD & regulator", "Wetsuit", "Air tanks", "Weights"],
      es: ["Máscara, snorkel y aletas", "BCD y regulador", "Traje de neopreno", "Tanques de aire", "Plomos"],
    },
    price: 470,
    deposit: 235,
    duration: { en: "3 days", es: "3 días" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "World's most popular scuba certification",
        "Dive independently with a buddy after certifying",
        "Complete theory online with PADI eLearning",
        "Four open-water dives on real reefs and wrecks",
        "Certification never expires — recognized worldwide",
      ],
      es: [
        "La certificación de buceo más popular del mundo",
        "Bucea de forma independiente con un compañero tras certificarte",
        "Completa la teoría en línea con PADI eLearning",
        "Cuatro inmersiones en arrecifes y naufragios reales",
        "La certificación nunca caduca — reconocida mundialmente",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "PADI eLearning course access",
        "Certified PADI instructor",
        "All scuba equipment",
        "Confined-water training",
        "Four open-water dives",
        "PADI Open Water Diver certification card",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Acceso al curso PADI eLearning",
        "Instructor PADI certificado",
        "Todo el equipo de buceo",
        "Entrenamiento en aguas confinadas",
        "Cuatro inmersiones en aguas abiertas",
        "Tarjeta de certificación PADI Open Water Diver",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 10 years",
        "Basic swimming ability required",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        "Not recommended for pregnant women",
        NO_FLYING.en,
      ],
      es: [
        "Edad mínima: 10 años",
        "Se requiere capacidad básica de natación",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        "No recomendado para mujeres embarazadas",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "How long does the course take?", es: "¿Cuánto dura el curso?" },
        a: {
          en: "Normally 3 days, including knowledge development, confined-water training, and open-water dives.",
          es: "Normalmente 3 días, incluyendo desarrollo de conocimientos, entrenamiento en aguas confinadas e inmersiones en aguas abiertas.",
        },
      },
      {
        q: { en: "Do I need Discover Scuba Diving first?", es: "¿Necesito hacer Discover Scuba Diving primero?" },
        a: {
          en: "No. Many students start directly with the Open Water Diver course.",
          es: "No. Muchos estudiantes empiezan directamente con el curso Open Water Diver.",
        },
      },
      {
        q: { en: "How deep can I dive after certification?", es: "¿Hasta qué profundidad puedo bucear tras certificarme?" },
        a: {
          en: "Up to 18 meters (60 ft) with a buddy, following safe diving practices and local conditions.",
          es: "Hasta 18 metros (60 ft) con un compañero, siguiendo prácticas seguras y las condiciones locales.",
        },
      },
    ],
    sortOrder: 3,
    isFeatured: true,
    badge: { en: "Most popular", es: "Más popular" },
  }),

  divingExc({
    slugEn: "padi-advanced-open-water-diver",
    slugEs: "padi-advanced-open-water-diver",
    title: { en: "PADI Advanced Open Water Diver", es: "PADI Advanced Open Water Diver" },
    summary: {
      en: "Refine your diving over five adventure dives — including deep diving and underwater navigation — and earn worldwide certification to 30 meters.",
      es: "Perfecciona tu buceo en cinco inmersiones de aventura — incluyendo buceo profundo y navegación submarina — y obtén certificación mundial hasta 30 metros.",
    },
    description: {
      en: "For certified Open Water Divers ready to advance, this course builds competency and confidence through five dives. Two core dives (Deep and Underwater Navigation) are required, plus three adventure dives you choose — wreck exploration, buoyancy, fish identification, or underwater photography. The Deep Dive teaches depth planning and physiology to 30 meters; the Navigation module develops compass and natural-landmark skills. It's the foundation for Rescue Diver and Divemaster, and unlocks deeper dive sites worldwide.",
      es: "Para buzos Open Water certificados listos para avanzar, este curso desarrolla competencia y confianza en cinco inmersiones. Dos inmersiones obligatorias (Profunda y Navegación Submarina), más tres de aventura que tú eliges — exploración de naufragios, flotabilidad, identificación de peces o fotografía submarina. La inmersión profunda enseña planificación y fisiología hasta 30 metros; el módulo de navegación desarrolla la brújula y los puntos de referencia naturales. Es la base para Rescue Diver y Divemaster, y abre sitios de buceo más profundos en todo el mundo.",
    },
    audienceType: "course",
    experienceLevel: "intermediate",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Open Water Diver (or equivalent). Minimum age 12 (15 for the deep dive).",
      es: "Requiere PADI Open Water Diver (o equivalente). Edad mínima 12 (15 para la inmersión profunda).",
    },
    maxDepth: { en: "30 meters (100 ft)", es: "30 metros (100 ft)" },
    numberOfDives: 5,
    marineLife: {
      en: ["Wreck Monica", "Deep coral walls", "Sea turtles", "Barracudas", "Reef sharks", "Tropical reef fish"],
      es: ["Naufragio Monica", "Paredes de coral profundas", "Tortugas marinas", "Barracudas", "Tiburones de arrecife", "Peces tropicales"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Air tanks", "Weights"],
      es: ["Equipo de buceo completo", "Tanques de aire", "Plomos"],
    },
    price: 400,
    deposit: 200,
    duration: { en: "3 days", es: "3 días" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "Certified to dive to 30 meters (100 ft) worldwide",
        "Two required dives plus three adventure dives you choose",
        "Explore the famous Wreck Monica",
        "Master underwater navigation and buoyancy",
        "Pathway to Rescue Diver and Divemaster",
      ],
      es: [
        "Certificado para bucear hasta 30 metros (100 ft) en todo el mundo",
        "Dos inmersiones obligatorias más tres de aventura a tu elección",
        "Explora el famoso naufragio Monica",
        "Domina la navegación submarina y la flotabilidad",
        "Camino hacia Rescue Diver y Divemaster",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor",
        "Complete scuba equipment",
        "Five open-water adventure dives",
        "PADI Advanced Open Water certification card",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI certificado",
        "Equipo de buceo completo",
        "Cinco inmersiones de aventura en aguas abiertas",
        "Tarjeta de certificación PADI Advanced Open Water",
      ],
    },
    restrictions: {
      en: [
        "Requires PADI Open Water Diver or equivalent",
        "Minimum age: 12 years (15 for the deep dive)",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        NO_FLYING.en,
      ],
      es: [
        "Requiere PADI Open Water Diver o equivalente",
        "Edad mínima: 12 años (15 para la inmersión profunda)",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "What are the requirements?", es: "¿Cuáles son los requisitos?" },
        a: {
          en: "You must be a certified PADI Open Water Diver (or equivalent) and meet the minimum age.",
          es: "Debes ser buzo PADI Open Water certificado (o equivalente) y cumplir la edad mínima.",
        },
      },
      {
        q: { en: "How long does it take?", es: "¿Cuánto tiempo toma?" },
        a: {
          en: "The course typically spans 2–3 days depending on scheduling and conditions.",
          es: "El curso normalmente dura 2–3 días según la programación y las condiciones.",
        },
      },
    ],
    sortOrder: 4,
  }),

  divingExc({
    slugEn: "padi-enriched-air-nitrox-course",
    slugEs: "curso-padi-nitrox",
    title: { en: "PADI Enriched Air (Nitrox) Course", es: "Curso PADI Nitrox (Aire Enriquecido)" },
    summary: {
      en: "Extend your bottom time and surface less tired. Earn PADI's most popular specialty in a single day, learning to dive safely with enriched air (32–40% oxygen).",
      es: "Extiende tu tiempo de fondo y sal menos cansado. Obtén la especialidad PADI más popular en un solo día, aprendiendo a bucear con aire enriquecido (32–40% de oxígeno).",
    },
    description: {
      en: "The Enriched Air Diver course lets you extend bottom time and shorten surface intervals by diving with air that has a higher oxygen content than regular compressed air. With less nitrogen absorbed, you can dive longer, make multiple dives comfortably, and feel less tired afterward — ideal for deeper reefs, wrecks, and multi-level dives. You'll learn to plan and execute nitrox dives, analyze tank contents, and set your dive computer. The course includes theory plus two application dives.",
      es: "El curso Enriched Air Diver te permite extender el tiempo de fondo y acortar los intervalos en superficie buceando con aire de mayor contenido de oxígeno que el aire comprimido normal. Con menos nitrógeno absorbido, puedes bucear más tiempo, hacer varias inmersiones cómodamente y sentirte menos cansado — ideal para arrecifes profundos, naufragios e inmersiones multinivel. Aprenderás a planificar y ejecutar inmersiones con nitrox, analizar el contenido del tanque y ajustar tu computadora de buceo. El curso incluye teoría más dos inmersiones de aplicación.",
    },
    audienceType: "course",
    experienceLevel: "intermediate",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Open Water Diver (or equivalent). Nitrox-compatible dive computer recommended.",
      es: "Requiere PADI Open Water Diver (o equivalente). Se recomienda computadora de buceo compatible con nitrox.",
    },
    maxDepth: { en: "40 meters (130 ft)", es: "40 metros (130 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Deep coral reefs", "Wrecks", "Caribbean reef fish", "Sea turtles"],
      es: ["Arrecifes de coral profundos", "Naufragios", "Peces de arrecife del Caribe", "Tortugas marinas"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Nitrox-filled tanks (32–40% O₂)", "Oxygen analyzer", "Weights"],
      es: ["Equipo de buceo completo", "Tanques con nitrox (32–40% O₂)", "Analizador de oxígeno", "Plomos"],
    },
    price: 350,
    deposit: 175,
    duration: { en: "1 day", es: "1 día" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "Dive longer and surface less tired",
        "Most popular PADI specialty course",
        "Completed in just one day",
        "Includes two nitrox dives with an instructor",
        "Internationally recognized certification",
      ],
      es: [
        "Bucea más tiempo y sal menos cansado",
        "El curso de especialidad PADI más popular",
        "Se completa en un solo día",
        "Incluye dos inmersiones con nitrox junto a un instructor",
        "Certificación reconocida internacionalmente",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor",
        "Theory session and dive-planning practice",
        "Full scuba gear with nitrox tanks",
        "Two nitrox-application dives",
        "PADI Enriched Air Diver certification card",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI certificado",
        "Sesión teórica y práctica de planificación",
        "Equipo de buceo completo con tanques de nitrox",
        "Dos inmersiones de aplicación con nitrox",
        "Tarjeta de certificación PADI Enriched Air Diver",
      ],
    },
    restrictions: {
      en: [
        "Minimum age: 12 years",
        "Must be a certified scuba diver (Open Water or equivalent)",
        NO_FLYING.en,
      ],
      es: [
        "Edad mínima: 12 años",
        "Debe ser buzo certificado (Open Water o equivalente)",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Do I need to be certified to take the Nitrox course?", es: "¿Necesito estar certificado para el curso de Nitrox?" },
        a: {
          en: "Yes. You must be a certified scuba diver (PADI Open Water Diver or equivalent) to enroll.",
          es: "Sí. Debes ser buzo certificado (PADI Open Water Diver o equivalente) para inscribirte.",
        },
      },
      {
        q: { en: "What are the benefits of diving with nitrox?", es: "¿Cuáles son los beneficios de bucear con nitrox?" },
        a: {
          en: "It extends no-decompression limits on certain dives and is popular for repetitive diving days — many divers feel less fatigued afterward.",
          es: "Extiende los límites de no descompresión en ciertas inmersiones y es popular para días de buceo repetitivo — muchos buzos se sienten menos cansados después.",
        },
      },
    ],
    sortOrder: 5,
  }),

  divingExc({
    slugEn: "padi-wreck-diver-specialty",
    slugEs: "especialidad-padi-wreck-diver",
    title: { en: "PADI Wreck Diver Specialty", es: "Especialidad PADI Wreck Diver" },
    summary: {
      en: "Explore sunken ships and historic wrecks across four guided dives with a PADI instructor — learning wreck navigation, hazard awareness, and safe planning.",
      es: "Explora barcos hundidos y naufragios históricos en cuatro inmersiones guiadas con un instructor PADI — aprendiendo navegación en naufragios, conciencia de riesgos y planificación segura.",
    },
    description: {
      en: "The Wreck Diver course teaches certified divers how to explore wreck sites safely — navigation, planning, and hazard awareness. Wrecks become vibrant artificial reefs that attract diverse marine life while presenting unique challenges like entanglement hazards and overhead environments. Training covers wreck stability assessment, buoyancy control, confined-space navigation with reel and line, and specialty equipment use. You'll practice at real wreck sites including the Wreck Monica, building confidence across varying conditions.",
      es: "El curso Wreck Diver enseña a los buzos certificados cómo explorar naufragios de forma segura — navegación, planificación y conciencia de riesgos. Los naufragios se convierten en vibrantes arrecifes artificiales que atraen vida marina diversa, a la vez que presentan retos únicos como riesgos de enganche y entornos cubiertos. El entrenamiento cubre evaluación de estabilidad del naufragio, control de flotabilidad, navegación en espacios confinados con carrete y línea, y uso de equipo especializado. Practicarás en naufragios reales como el Wreck Monica, ganando confianza en condiciones variadas.",
    },
    audienceType: "course",
    experienceLevel: "intermediate",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Adventure Diver (or equivalent). Minimum age 15. Good buoyancy control recommended.",
      es: "Requiere PADI Adventure Diver (o equivalente). Edad mínima 15. Se recomienda buen control de flotabilidad.",
    },
    maxDepth: { en: "30 meters (100 ft)", es: "30 metros (100 ft)" },
    numberOfDives: 4,
    marineLife: {
      en: ["Wreck-dwelling fish schools", "Moray eels", "Lionfish", "Barracudas", "Soft corals on wreck structures"],
      es: ["Cardúmenes en el naufragio", "Morenas", "Peces león", "Barracudas", "Corales blandos sobre el naufragio"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Air tanks", "Weights", "Specialty wreck equipment"],
      es: ["Equipo de buceo completo", "Tanques de aire", "Plomos", "Equipo especializado para naufragios"],
    },
    price: 400,
    deposit: 200,
    duration: { en: "2 days", es: "2 días" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "Dive real wrecks including the Wreck Monica",
        "Learn wreck navigation with reel and line",
        "Master buoyancy in overhead environments",
        "Four guided wreck dives",
        "Internationally recognized PADI specialty",
      ],
      es: [
        "Bucea naufragios reales como el Wreck Monica",
        "Aprende navegación en naufragios con carrete y línea",
        "Domina la flotabilidad en entornos cubiertos",
        "Cuatro inmersiones guiadas en naufragios",
        "Especialidad PADI reconocida internacionalmente",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor",
        "Theory and dive-planning sessions",
        "Full scuba gear and specialty equipment",
        "Four wreck dives",
        "PADI Wreck Diver certification card",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI certificado",
        "Sesiones de teoría y planificación",
        "Equipo de buceo completo y equipo especializado",
        "Cuatro inmersiones en naufragios",
        "Tarjeta de certificación PADI Wreck Diver",
      ],
    },
    restrictions: {
      en: [
        "Requires PADI Adventure Diver or equivalent",
        "Minimum age: 15 years",
        "Not recommended for guests with claustrophobia",
        NO_FLYING.en,
      ],
      es: [
        "Requiere PADI Adventure Diver o equivalente",
        "Edad mínima: 15 años",
        "No recomendado para huéspedes con claustrofobia",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Do I need prior wreck experience?", es: "¿Necesito experiencia previa en naufragios?" },
        a: {
          en: "No. The course builds skills progressively through guided training dives.",
          es: "No. El curso desarrolla las habilidades de forma progresiva en inmersiones guiadas.",
        },
      },
      {
        q: { en: "Does the course include wreck penetration?", es: "¿El curso incluye penetración en el naufragio?" },
        a: {
          en: "Training focuses on safe wreck-diving techniques and planning; penetration skills are taught only when appropriate under strict safety guidelines.",
          es: "El entrenamiento se centra en técnicas seguras y planificación; las habilidades de penetración se enseñan solo cuando es apropiado bajo estrictas pautas de seguridad.",
        },
      },
    ],
    sortOrder: 6,
  }),

  divingExc({
    slugEn: "padi-deep-diver-specialty",
    slugEs: "especialidad-padi-deep-diver",
    title: { en: "PADI Deep Diver Specialty", es: "Especialidad PADI Deep Diver" },
    summary: {
      en: "Push your limits to 40 meters. Master deep-dive planning, gas management, and narcosis awareness over four open-water dives in the Caribbean.",
      es: "Lleva tus límites a 40 metros. Domina la planificación de inmersiones profundas, la gestión de gas y la conciencia de la narcosis en cuatro inmersiones en el Caribe.",
    },
    description: {
      en: "The Deep Diver course lets certified divers safely explore depths to 40 meters (130 ft), accessing deep wrecks like the St. George, dramatic walls, and remote reefs. You'll learn deep-dive planning, air-supply management, and how depth affects body and equipment — addressing nitrogen narcosis, increased air consumption, and buoyancy changes. Classroom work covers gas absorption, oxygen toxicity, extended safety stops, and no-decompression planning. Four supervised open-water dives provide hands-on practice in descent/ascent, buoyancy, navigation, and air management.",
      es: "El curso Deep Diver permite a los buzos certificados explorar con seguridad profundidades de hasta 40 metros (130 ft), accediendo a naufragios profundos como el St. George, paredes dramáticas y arrecifes remotos. Aprenderás planificación de inmersiones profundas, gestión del suministro de aire y cómo la profundidad afecta al cuerpo y al equipo — abordando la narcosis por nitrógeno, el mayor consumo de aire y los cambios de flotabilidad. La teoría cubre absorción de gases, toxicidad del oxígeno, paradas de seguridad prolongadas y planificación sin descompresión. Cuatro inmersiones supervisadas ofrecen práctica en descenso/ascenso, flotabilidad, navegación y gestión del aire.",
    },
    audienceType: "course",
    experienceLevel: "advanced",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Advanced Open Water Diver (or equivalent). Minimum age 15.",
      es: "Requiere PADI Advanced Open Water Diver (o equivalente). Edad mínima 15.",
    },
    maxDepth: { en: "40 meters (130 ft)", es: "40 metros (130 ft)" },
    numberOfDives: 4,
    marineLife: {
      en: ["Deep wall reef formations", "Large pelagic fish", "Reef sharks", "Barracudas"],
      es: ["Formaciones de pared profunda", "Grandes peces pelágicos", "Tiburones de arrecife", "Barracudas"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Air tanks", "Weights"],
      es: ["Equipo de buceo completo", "Tanques de aire", "Plomos"],
    },
    price: 400,
    deposit: 200,
    duration: { en: "2 days", es: "2 días" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "Certified to dive to 40 meters (130 ft)",
        "Access deep wrecks like the St. George",
        "Master gas planning and narcosis awareness",
        "Four open-water deep dives",
        "Unlocks deeper Caribbean dive sites",
      ],
      es: [
        "Certificado para bucear hasta 40 metros (130 ft)",
        "Accede a naufragios profundos como el St. George",
        "Domina la planificación de gas y la conciencia de la narcosis",
        "Cuatro inmersiones profundas en aguas abiertas",
        "Abre sitios de buceo más profundos del Caribe",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor",
        "Classroom and dive-planning sessions",
        "Full scuba gear",
        "Four deep open-water dives",
        "PADI Deep Diver certification card",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI certificado",
        "Sesiones de teoría y planificación",
        "Equipo de buceo completo",
        "Cuatro inmersiones profundas en aguas abiertas",
        "Tarjeta de certificación PADI Deep Diver",
      ],
    },
    restrictions: {
      en: [
        "Requires PADI Advanced Open Water Diver or equivalent",
        "Minimum age: 15 years",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        NO_FLYING.en,
      ],
      es: [
        "Requiere PADI Advanced Open Water Diver o equivalente",
        "Edad mínima: 15 años",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Do I need previous deep-diving experience?", es: "¿Necesito experiencia previa en buceo profundo?" },
        a: {
          en: "No. Students learn dive planning, gas management, buddy procedures, and safety stops during the course.",
          es: "No. Los estudiantes aprenden planificación, gestión de gas, procedimientos con compañero y paradas de seguridad durante el curso.",
        },
      },
      {
        q: { en: "What certification do I need?", es: "¿Qué certificación necesito?" },
        a: {
          en: "You must be a certified PADI Advanced Open Water Diver or equivalent.",
          es: "Debes ser buzo PADI Advanced Open Water certificado o equivalente.",
        },
      },
    ],
    sortOrder: 7,
  }),

  divingExc({
    slugEn: "padi-peak-performance-buoyancy",
    slugEs: "padi-peak-performance-buoyancy",
    title: { en: "PADI Peak Performance Buoyancy", es: "PADI Peak Performance Buoyancy" },
    summary: {
      en: "Master perfect buoyancy over two guided dives. Glide effortlessly, conserve air, and protect coral reefs while improving every future dive.",
      es: "Domina la flotabilidad perfecta en dos inmersiones guiadas. Deslízate sin esfuerzo, ahorra aire y protege los arrecifes mientras mejoras cada inmersión futura.",
    },
    description: {
      en: "This specialty elevates your diving by teaching perfect control in the water — move effortlessly, conserve air, and reduce your environmental impact while improving comfort and safety. Mastering buoyancy keeps you streamlined, minimizes energy use, and protects delicate marine ecosystems. Training combines theory with practical exercises in real dive environments: hovering above a reef, exploring a wreck, or holding a stable position in open water. You'll adjust buoyancy through breathing, BCD use, and weight distribution.",
      es: "Esta especialidad eleva tu buceo enseñándote el control perfecto en el agua — moverte sin esfuerzo, ahorrar aire y reducir tu impacto ambiental mientras mejoras la comodidad y la seguridad. Dominar la flotabilidad te mantiene hidrodinámico, minimiza el gasto de energía y protege los frágiles ecosistemas marinos. El entrenamiento combina teoría con ejercicios prácticos en entornos reales: flotando sobre un arrecife, explorando un naufragio o manteniendo una posición estable en aguas abiertas. Ajustarás la flotabilidad mediante la respiración, el BCD y la distribución de plomos.",
    },
    audienceType: "course",
    experienceLevel: "beginner",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires any open-water certification (PADI Open Water Diver or equivalent). Minimum age 10.",
      es: "Requiere cualquier certificación de aguas abiertas (PADI Open Water Diver o equivalente). Edad mínima 10.",
    },
    maxDepth: { en: "Within your certification limit", es: "Dentro de tu límite de certificación" },
    numberOfDives: 2,
    marineLife: {
      en: ["Coral gardens", "Reef fish", "Sea turtles"],
      es: ["Jardines de coral", "Peces de arrecife", "Tortugas marinas"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Air tanks", "Adjustable weight system"],
      es: ["Equipo de buceo completo", "Tanques de aire", "Sistema de plomos ajustable"],
    },
    price: 300,
    deposit: 150,
    duration: { en: "1 day", es: "1 día" },
    groupSize: { en: "Small groups", es: "Grupos pequeños" },
    highlights: {
      en: [
        "Glide effortlessly through the water",
        "Use up to 25% less air per dive",
        "Protect fragile coral reefs",
        "Better trim and underwater positioning",
        "Improves every future dive",
      ],
      es: [
        "Deslízate sin esfuerzo por el agua",
        "Usa hasta un 25% menos de aire por inmersión",
        "Protege los frágiles arrecifes de coral",
        "Mejor trimado y posición submarina",
        "Mejora cada inmersión futura",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor",
        "Theory and weighting session",
        "Full scuba gear",
        "Two coached buoyancy dives",
        "PADI Peak Performance Buoyancy certification",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI certificado",
        "Sesión teórica y de lastrado",
        "Equipo de buceo completo",
        "Dos inmersiones guiadas de flotabilidad",
        "Certificación PADI Peak Performance Buoyancy",
      ],
    },
    restrictions: {
      en: [
        "Requires any open-water certification (Open Water or equivalent)",
        "Minimum age: 10 years",
        NO_FLYING.en,
      ],
      es: [
        "Requiere cualquier certificación de aguas abiertas (Open Water o equivalente)",
        "Edad mínima: 10 años",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Who is this course for?", es: "¿Para quién es este curso?" },
        a: {
          en: "Certified divers who want to improve buoyancy control, reduce air consumption, move more efficiently, and protect fragile marine environments.",
          es: "Buzos certificados que quieren mejorar el control de flotabilidad, reducir el consumo de aire, moverse con más eficiencia y proteger los frágiles entornos marinos.",
        },
      },
      {
        q: { en: "How many dives are included?", es: "¿Cuántas inmersiones se incluyen?" },
        a: { en: "The course includes two dives.", es: "El curso incluye dos inmersiones." },
      },
    ],
    sortOrder: 8,
  }),

  // ----- CERTIFIED DIVERS --------------------------------------------------
  divingExc({
    slugEn: "saona-island-dive-snorkel-trip",
    slugEs: "buceo-snorkel-isla-saona",
    title: { en: "Saona Island Dive & Snorkel Trip", es: "Buceo y Snorkel en Isla Saona" },
    summary: {
      en: "A full-day adventure with two dives at the Atlantic Princess wreck and El Peñón reef, a beach lunch on Saona Island, and a stop at the famous natural pool with starfish.",
      es: "Una aventura de día completo con dos inmersiones en el naufragio Atlantic Princess y el arrecife El Peñón, un almuerzo en la playa de Isla Saona y una parada en la famosa piscina natural con estrellas de mar.",
    },
    description: {
      en: "Saona Island offers world-class diving, crystal-clear water, and postcard-perfect beaches. You'll dive two sites: the Atlantic Princess shipwreck — shallow and marine-rich, suitable for all levels — and El Peñón, considered one of the best reefs in the Caribbean with an untouched system. After diving, enjoy a freshly prepared buffet lunch on Saona's beaches, then stop at the famous natural pool — a shallow turquoise sandbank where you can admire the starfish — on the way back. Open to certified divers and snorkeling companions alike.",
      es: "Isla Saona ofrece buceo de clase mundial, agua cristalina y playas de postal. Bucearás dos sitios: el naufragio Atlantic Princess — poco profundo y lleno de vida marina, apto para todos los niveles — y El Peñón, considerado uno de los mejores arrecifes del Caribe con un sistema intacto. Tras bucear, disfruta de un almuerzo buffet recién preparado en las playas de Saona, y luego una parada en la famosa piscina natural — un banco de arena turquesa poco profundo donde podrás admirar las estrellas de mar — en el regreso. Abierto tanto a buzos certificados como a acompañantes de snorkel.",
    },
    audienceType: "certified",
    experienceLevel: "beginner",
    certificationRequired: true,
    certificationDetails: {
      en: "Divers must hold Open Water certification or equivalent. Snorkelers need no certification but should swim comfortably.",
      es: "Los buzos deben tener certificación Open Water o equivalente. Los snorkelistas no necesitan certificación pero deben nadar con comodidad.",
    },
    maxDepth: { en: "12–18 meters (40–60 ft)", es: "12–18 metros (40–60 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Schools of tropical fish", "Vibrant coral gardens", "Sea turtles", "Starfish (natural pool)"],
      es: ["Cardúmenes de peces tropicales", "Vibrantes jardines de coral", "Tortugas marinas", "Estrellas de mar (piscina natural)"],
    },
    equipmentProvided: {
      en: ["Full scuba gear (divers)", "Snorkel gear (companions)", "Two air tanks", "Weights"],
      es: ["Equipo de buceo completo (buzos)", "Equipo de snorkel (acompañantes)", "Dos tanques de aire", "Plomos"],
    },
    price: 220,
    deposit: 100,
    duration: { en: "Full day (7:30 AM – 6:00 PM)", es: "Día completo (7:30 AM – 6:00 PM)" },
    groupSize: { en: "Mixed group of divers and snorkelers", es: "Grupo mixto de buzos y snorkelistas" },
    highlights: {
      en: [
        "Two guided dives: Atlantic Princess wreck + El Peñón reef",
        "Buffet lunch on Saona's beaches",
        "Visit the famous natural pool with starfish",
        "Open to divers and snorkelers together",
        "Drinks all day — alcoholic and non-alcoholic",
      ],
      es: [
        "Dos inmersiones guiadas: naufragio Atlantic Princess + arrecife El Peñón",
        "Almuerzo buffet en las playas de Saona",
        "Visita la famosa piscina natural con estrellas de mar",
        "Abierto a buzos y snorkelistas juntos",
        "Bebidas todo el día — con y sin alcohol",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Boat transfer from Bayahibe to Saona",
        "Two guided dives or snorkel sessions",
        "Full scuba or snorkel equipment",
        "Beach buffet lunch on Saona",
        "Alcoholic and non-alcoholic drinks",
        "Stop at the natural pool with starfish",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Traslado en barco de Bayahibe a Saona",
        "Dos inmersiones o sesiones de snorkel guiadas",
        "Equipo completo de buceo o snorkel",
        "Almuerzo buffet en la playa de Saona",
        "Bebidas con y sin alcohol",
        "Parada en la piscina natural con estrellas de mar",
      ],
    },
    restrictions: {
      en: [
        "Divers must hold Open Water certification or equivalent",
        "Snorkelers should be comfortable swimmers",
        "Long travel day — not ideal for very young children",
        "Not recommended for pregnant women (for diving)",
        NO_FLYING.en,
      ],
      es: [
        "Los buzos deben tener certificación Open Water o equivalente",
        "Los snorkelistas deben nadar con comodidad",
        "Día largo de viaje — no ideal para niños muy pequeños",
        "No recomendado para mujeres embarazadas (para bucear)",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Can divers and snorkelers come together?", es: "¿Pueden venir juntos buzos y snorkelistas?" },
        a: {
          en: "Yes — this is a mixed-group tour. Divers do two tank dives while snorkelers explore the same sites at the surface.",
          es: "Sí — es un tour de grupo mixto. Los buzos hacen dos inmersiones mientras los snorkelistas exploran los mismos sitios en superficie.",
        },
      },
      {
        q: { en: "Is the natural pool stop guaranteed?", es: "¿Está garantizada la parada en la piscina natural?" },
        a: {
          en: "Yes — it's a standard part of the itinerary on the way back from Saona, weather permitting.",
          es: "Sí — es parte estándar del itinerario de regreso desde Saona, si el clima lo permite.",
        },
      },
    ],
    sortOrder: 9,
    isFeatured: true,
    badge: { en: "Divers & snorkelers", es: "Buzos y snorkelistas" },
  }),

  divingExc({
    slugEn: "2-tank-local-reef-dive",
    slugEs: "buceo-2-tanques-arrecife-local",
    title: { en: "2-Tank Local Reef Dive", es: "Buceo de 2 Tanques en Arrecife Local" },
    summary: {
      en: "Two guided dives exploring Punta Cana's best local reefs and wrecks, with sites chosen daily for the best conditions — ideal for certified divers on vacation.",
      es: "Dos inmersiones guiadas explorando los mejores arrecifes y naufragios locales de Punta Cana, con sitios elegidos a diario según las condiciones — ideal para buzos certificados de vacaciones.",
    },
    description: {
      en: "Diving in Punta Cana showcases vibrant Caribbean marine life across healthy reefs, shipwrecks, and tropical fish. Expect stingrays, sea turtles, moray eels, trumpetfish, angelfish, and nurse sharks in the warm Dominican waters. We rotate between signature sites — Wreck Monica (an 1880s French cargo ship), the Submarine, Park Reef, Cuevitas swim-throughs, Finger Coral Plantation, Rock City canyons, El Niño, and Anchor reef — selected daily based on weather, sea conditions, and visibility. Water temperatures stay 26–29°C (78–84°F) year-round with visibility typically 10–20 meters.",
      es: "Bucear en Punta Cana muestra la vibrante vida marina del Caribe en arrecifes saludables, naufragios y peces tropicales. Espera rayas, tortugas, morenas, peces trompeta, peces ángel y tiburones gata en las cálidas aguas dominicanas. Rotamos entre sitios emblemáticos — Wreck Monica (un carguero francés de 1880), el Submarino, Park Reef, los pasajes de Cuevitas, Finger Coral Plantation, los cañones de Rock City, El Niño y Anchor — seleccionados a diario según el clima, el estado del mar y la visibilidad. Las temperaturas del agua se mantienen en 26–29°C (78–84°F) todo el año con visibilidad típica de 10–20 metros.",
    },
    audienceType: "certified",
    experienceLevel: "intermediate",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires any Open Water certification (PADI Open Water Diver or equivalent). Minimum age 10.",
      es: "Requiere cualquier certificación Open Water (PADI Open Water Diver o equivalente). Edad mínima 10.",
    },
    maxDepth: { en: "19 meters (62 ft)", es: "19 metros (62 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Sea turtles", "Stingrays", "Moray eels", "Nurse sharks", "Angelfish", "Trumpetfish", "Brain coral & sea fans"],
      es: ["Tortugas marinas", "Rayas", "Morenas", "Tiburones gata", "Peces ángel", "Peces trompeta", "Coral cerebro y abanicos de mar"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Two air tanks", "Weights"],
      es: ["Equipo de buceo completo", "Dos tanques de aire", "Plomos"],
    },
    price: 125,
    deposit: 50,
    duration: { en: "2.5 hours", es: "2.5 horas" },
    groupSize: { en: "Small group with local guide", es: "Grupo pequeño con guía local" },
    highlights: {
      en: [
        "Two dives at local signature sites",
        "Sites chosen daily for ideal conditions",
        "Wreck, reef, swim-through, and wall options",
        "Excellent visibility and warm water year-round",
        "Local guide with deep site knowledge",
      ],
      es: [
        "Dos inmersiones en sitios locales emblemáticos",
        "Sitios elegidos a diario según las condiciones",
        "Opciones de naufragio, arrecife, pasajes y pared",
        "Excelente visibilidad y agua cálida todo el año",
        "Guía local con profundo conocimiento de los sitios",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Two boat dives with local guide",
        "Full scuba equipment",
        "Two air tanks and weights",
        "Bottled water on board",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Dos inmersiones en barco con guía local",
        "Equipo de buceo completo",
        "Dos tanques de aire y plomos",
        "Agua embotellada a bordo",
      ],
    },
    restrictions: {
      en: [
        "Requires any Open Water certification or equivalent",
        "Minimum age: 10 years",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        "Not recommended for pregnant women",
        NO_FLYING.en,
      ],
      es: [
        "Requiere cualquier certificación Open Water o equivalente",
        "Edad mínima: 10 años",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        "No recomendado para mujeres embarazadas",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Are dive sites preselected?", es: "¿Los sitios de buceo están preseleccionados?" },
        a: {
          en: "No. Sites are selected daily based on weather, sea conditions, and visibility for the best and safest experience.",
          es: "No. Los sitios se seleccionan a diario según el clima, el estado del mar y la visibilidad para la mejor y más segura experiencia.",
        },
      },
      {
        q: { en: "What is visibility like?", es: "¿Cómo es la visibilidad?" },
        a: {
          en: "Visibility typically ranges between 10 and 20 meters (30–65 ft) depending on ocean conditions.",
          es: "La visibilidad suele oscilar entre 10 y 20 metros (30–65 ft) según las condiciones del océano.",
        },
      },
    ],
    sortOrder: 10,
  }),

  divingExc({
    slugEn: "shark-diving-punta-cana",
    slugEs: "buceo-con-tiburones-punta-cana",
    title: { en: "Shark Diving in Punta Cana", es: "Buceo con Tiburones en Punta Cana" },
    summary: {
      en: "An advanced dive at Shark Point, descending to 24–30 meters to encounter nurse sharks, blacktip reef sharks, and occasionally hammerheads in their natural habitat.",
      es: "Una inmersión avanzada en Shark Point, descendiendo a 24–30 metros para encontrar tiburones gata, tiburones punta negra y ocasionalmente martillos en su hábitat natural.",
    },
    description: {
      en: "This dive is for experienced divers ready to push deeper. At roughly 24–30 meters you'll explore an expansive coral garden where nurse sharks rest on the sand while blacktip reef sharks patrol open water — and hammerheads have occasionally been spotted. Sharks are often misunderstood; diving with them in their natural environment is both an adrenaline-filled adventure and a meaningful perspective shift. Led by experienced PADI instructors using premium equipment and strict safety protocols. This is a natural-encounter dive — no baiting or feeding.",
      es: "Esta inmersión es para buzos experimentados listos para ir más profundo. A unos 24–30 metros explorarás un extenso jardín de coral donde los tiburones gata descansan en la arena mientras los tiburones punta negra patrullan el agua abierta — y ocasionalmente se han avistado martillos. Los tiburones suelen ser incomprendidos; bucear con ellos en su entorno natural es a la vez una aventura llena de adrenalina y un cambio de perspectiva significativo. Guiado por instructores PADI experimentados con equipo premium y estrictos protocolos de seguridad. Es una inmersión de encuentro natural — sin cebo ni alimentación.",
    },
    audienceType: "certified",
    experienceLevel: "advanced",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Advanced Open Water Diver or equivalent (certified to 30 m). Minimum 15 logged dives recommended. Minimum age 15.",
      es: "Requiere PADI Advanced Open Water Diver o equivalente (certificado a 30 m). Se recomiendan mínimo 15 inmersiones registradas. Edad mínima 15.",
    },
    maxDepth: { en: "24–30 meters (80–100 ft)", es: "24–30 metros (80–100 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Nurse sharks", "Blacktip reef sharks", "Caribbean reef sharks", "Expansive coral garden", "Large pelagic fish"],
      es: ["Tiburones gata", "Tiburones punta negra", "Tiburones de arrecife del Caribe", "Extenso jardín de coral", "Grandes peces pelágicos"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Air tanks", "Weights"],
      es: ["Equipo de buceo completo", "Tanques de aire", "Plomos"],
    },
    price: 190,
    deposit: 50,
    duration: { en: "2.5 hours", es: "2.5 horas" },
    groupSize: { en: "Small group of advanced divers", es: "Grupo pequeño de buzos avanzados" },
    highlights: {
      en: [
        "Dive with nurse and blacktip reef sharks",
        "Expansive coral garden at 24–30 m",
        "Strict safety protocols and pro equipment",
        "Led by experienced PADI instructors",
        "Natural encounter — no baiting or feeding",
      ],
      es: [
        "Bucea con tiburones gata y punta negra",
        "Extenso jardín de coral a 24–30 m",
        "Estrictos protocolos de seguridad y equipo profesional",
        "Guiado por instructores PADI experimentados",
        "Encuentro natural — sin cebo ni alimentación",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Certified PADI instructor or divemaster",
        "Full scuba gear",
        "Two boat dives",
        "Bottled water on the boat",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Instructor PADI o divemaster certificado",
        "Equipo de buceo completo",
        "Dos inmersiones en barco",
        "Agua embotellada en el barco",
      ],
    },
    restrictions: {
      en: [
        "Requires PADI Advanced Open Water Diver or equivalent (certified to 30 m)",
        "Minimum 15 logged dives recommended",
        "Minimum age: 15 years",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        NO_FLYING.en,
      ],
      es: [
        "Requiere PADI Advanced Open Water Diver o equivalente (certificado a 30 m)",
        "Se recomiendan mínimo 15 inmersiones registradas",
        "Edad mínima: 15 años",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Is shark diving safe?", es: "¿Es seguro bucear con tiburones?" },
        a: {
          en: "Yes, when done with experienced professionals. We use top equipment and strict safety protocols; the shark species at Shark Point are generally non-aggressive and accustomed to divers.",
          es: "Sí, cuando se hace con profesionales experimentados. Usamos equipo de primera y estrictos protocolos; las especies de tiburón en Shark Point son generalmente no agresivas y están acostumbradas a los buzos.",
        },
      },
      {
        q: { en: "Which sharks am I likely to see?", es: "¿Qué tiburones es probable que vea?" },
        a: {
          en: "Nurse sharks and blacktip reef sharks are the most common. Hammerheads are occasionally spotted but can't be guaranteed.",
          es: "Los tiburones gata y punta negra son los más comunes. Los martillos se avistan ocasionalmente pero no se pueden garantizar.",
        },
      },
    ],
    sortOrder: 11,
    badge: { en: "Advanced", es: "Avanzado" },
  }),

  divingExc({
    slugEn: "catalina-island-dive-trip",
    slugEs: "buceo-isla-catalina",
    title: { en: "Catalina Island Dive Trip", es: "Buceo en Isla Catalina" },
    summary: {
      en: "A full-day boat trip to Catalina Island with two dives — a dramatic vertical wall and a sheltered coral garden — plus lunch and drinks. Snorkelers welcome.",
      es: "Un viaje en barco de día completo a Isla Catalina con dos inmersiones — una dramática pared vertical y un jardín de coral protegido — más almuerzo y bebidas. Snorkelistas bienvenidos.",
    },
    description: {
      en: "Catalina Island is renowned for crystal-clear turquoise water and thriving coral reefs. The Wall starts as a gentle sandy slope (1.5–6 m) before dropping to an impressive vertical face to 30 meters, covered in sponges and hard and soft corals. The Aquarium is a sheltered, calm site at about 12 meters with healthy coral, yellow stingrays, lobsters, moray eels, and tropical fish. The full day includes a freshly prepared lunch on the beach plus alcoholic and non-alcoholic drinks. Snorkelers are welcome alongside divers, making it perfect for mixed-certification groups.",
      es: "Isla Catalina es famosa por su agua turquesa cristalina y sus prósperos arrecifes. La Pared comienza como una suave pendiente arenosa (1.5–6 m) antes de caer en una impresionante cara vertical hasta 30 metros, cubierta de esponjas y corales duros y blandos. El Acuario es un sitio protegido y tranquilo a unos 12 metros con coral saludable, rayas amarillas, langostas, morenas y peces tropicales. El día completo incluye un almuerzo recién preparado en la playa más bebidas con y sin alcohol. Los snorkelistas son bienvenidos junto a los buzos, perfecto para grupos de certificación mixta.",
    },
    audienceType: "certified",
    experienceLevel: "intermediate",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Open Water Diver or equivalent (sufficient for The Wall, depth-limited to 30 m). Minimum age 10.",
      es: "Requiere PADI Open Water Diver o equivalente (suficiente para La Pared, limitada a 30 m). Edad mínima 10.",
    },
    maxDepth: { en: "30 meters (100 ft)", es: "30 metros (100 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Yellow stingrays", "Lobsters", "Moray eels", "Angelfish & snappers", "Vase and barrel sponges", "Hard and soft corals"],
      es: ["Rayas amarillas", "Langostas", "Morenas", "Peces ángel y pargos", "Esponjas de vaso y barril", "Corales duros y blandos"],
    },
    equipmentProvided: {
      en: ["Full scuba gear (divers)", "Snorkel gear (companions)", "Two air tanks", "Weights"],
      es: ["Equipo de buceo completo (buzos)", "Equipo de snorkel (acompañantes)", "Dos tanques de aire", "Plomos"],
    },
    price: 220,
    deposit: 100,
    duration: { en: "Full day (7:30 AM – 6:00 PM)", es: "Día completo (7:30 AM – 6:00 PM)" },
    groupSize: { en: "Mixed group of divers and snorkelers", es: "Grupo mixto de buzos y snorkelistas" },
    highlights: {
      en: [
        "Two dives: The Wall and The Aquarium",
        "Dramatic vertical wall drop-off",
        "Snorkelers welcome with non-diving companions",
        "Lunch and drinks included",
        "Full-day Caribbean island experience",
      ],
      es: [
        "Dos inmersiones: La Pared y El Acuario",
        "Dramática caída de pared vertical",
        "Snorkelistas bienvenidos con acompañantes no buzos",
        "Almuerzo y bebidas incluidos",
        "Experiencia de isla caribeña de día completo",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Boat trip to Catalina Island",
        "Two guided dives or snorkel sessions",
        "Full scuba or snorkel equipment",
        "Two air tanks and weights",
        "Lunch on the beach",
        "Alcoholic and non-alcoholic drinks",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Viaje en barco a Isla Catalina",
        "Dos inmersiones o sesiones de snorkel guiadas",
        "Equipo completo de buceo o snorkel",
        "Dos tanques de aire y plomos",
        "Almuerzo en la playa",
        "Bebidas con y sin alcohol",
      ],
    },
    restrictions: {
      en: [
        "Requires PADI Open Water Diver or equivalent",
        "Minimum age: 10 years",
        "Long travel day — not ideal for very young children",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        NO_FLYING.en,
      ],
      es: [
        "Requiere PADI Open Water Diver o equivalente",
        "Edad mínima: 10 años",
        "Día largo de viaje — no ideal para niños muy pequeños",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Can non-divers join?", es: "¿Pueden unirse los no buzos?" },
        a: {
          en: "Yes — snorkeling companions are welcome and snorkel the shallow reef while divers are below.",
          es: "Sí — los acompañantes de snorkel son bienvenidos y hacen snorkel en el arrecife poco profundo mientras los buzos están abajo.",
        },
      },
      {
        q: { en: "Is Advanced certification required?", es: "¿Se requiere certificación Advanced?" },
        a: {
          en: "No — Open Water certification is sufficient. Advanced is recommended for those wanting to explore deeper sections.",
          es: "No — la certificación Open Water es suficiente. Se recomienda Advanced para quienes quieran explorar secciones más profundas.",
        },
      },
    ],
    sortOrder: 12,
  }),

  divingExc({
    slugEn: "bayahibe-dive-trip-st-george-wreck",
    slugEs: "buceo-bayahibe-naufragio-st-george",
    title: { en: "Bayahibe Dive Trip – St. George Wreck", es: "Buceo en Bayahibe – Naufragio St. George" },
    summary: {
      en: "Dive one of the Caribbean's premier wrecks — the 240-foot St. George cargo ship at 40 meters off Bayahibe's protected waters — on a two-tank advanced dive day.",
      es: "Bucea uno de los mejores naufragios del Caribe — el carguero St. George de 73 metros a 40 metros frente a las aguas protegidas de Bayahibe — en un día de buceo avanzado de dos tanques.",
    },
    description: {
      en: "The St. George, a 73-meter cargo vessel built in 1962, was intentionally sunk in 1999 to create an artificial reef. Once used to transport wheat and barley between Europe and the Caribbean, it's now a thriving marine habitat. The day includes hotel pickup, boat transport to the site, and two dives — the wreck plus a shallower local reef or wreck. Bayahibe offers excellent visibility, warm temperatures, and minimal currents year-round.",
      es: "El St. George, un carguero de 73 metros construido en 1962, fue hundido intencionalmente en 1999 para crear un arrecife artificial. Antes usado para transportar trigo y cebada entre Europa y el Caribe, ahora es un próspero hábitat marino. El día incluye recogida en el hotel, traslado en barco al sitio y dos inmersiones — el naufragio más un arrecife o naufragio local más superficial. Bayahibe ofrece excelente visibilidad, temperaturas cálidas y corrientes mínimas todo el año.",
    },
    audienceType: "certified",
    experienceLevel: "advanced",
    certificationRequired: true,
    certificationDetails: {
      en: "Requires PADI Advanced Open Water Diver or equivalent for the St. George wreck (40 m). Open Water divers may join shallower sites only. Minimum age 15.",
      es: "Requiere PADI Advanced Open Water Diver o equivalente para el naufragio St. George (40 m). Los buzos Open Water pueden unirse solo a sitios más superficiales. Edad mínima 15.",
    },
    maxDepth: { en: "40 meters (131 ft)", es: "40 metros (131 ft)" },
    numberOfDives: 2,
    marineLife: {
      en: ["Barracudas", "Groupers", "Moray eels", "King mackerels", "Wreck-dwelling fish schools"],
      es: ["Barracudas", "Meros", "Morenas", "Carites reales", "Cardúmenes en el naufragio"],
    },
    equipmentProvided: {
      en: ["Full scuba gear", "Two air tanks", "Weights"],
      es: ["Equipo de buceo completo", "Dos tanques de aire", "Plomos"],
    },
    price: 180,
    deposit: 100,
    duration: { en: "Half day (7:30 AM – 2:30 PM)", es: "Medio día (7:30 AM – 2:30 PM)" },
    groupSize: { en: "Small group of advanced divers", es: "Grupo pequeño de buzos avanzados" },
    highlights: {
      en: [
        "Dive the historic St. George cargo-ship wreck",
        "240-ft vessel at 40 meters depth",
        "Calm, protected waters year-round",
        "Led by experienced PADI professionals",
        "Charming Bayahibe village experience",
      ],
      es: [
        "Bucea el histórico naufragio del carguero St. George",
        "Buque de 73 metros a 40 metros de profundidad",
        "Aguas tranquilas y protegidas todo el año",
        "Guiado por profesionales PADI experimentados",
        "Encantadora experiencia del pueblo de Bayahibe",
      ],
    },
    whatsIncluded: {
      en: [
        "Round-trip hotel transportation",
        "Boat transfer in Bayahibe",
        "Two boat dives (wreck + second site)",
        "Certified PADI instructor or divemaster",
        "Full scuba gear, two air tanks, and weights",
        "Bottled water on board",
      ],
      es: [
        "Transporte de ida y vuelta al hotel",
        "Traslado en barco en Bayahibe",
        "Dos inmersiones en barco (naufragio + segundo sitio)",
        "Instructor PADI o divemaster certificado",
        "Equipo de buceo completo, dos tanques de aire y plomos",
        "Agua embotellada a bordo",
      ],
    },
    restrictions: {
      en: [
        "Advanced Open Water certification required for the wreck",
        "Minimum age: 15 years",
        "Good buoyancy control recommended",
        "Not recommended for guests with serious heart, respiratory, or ear conditions",
        NO_FLYING.en,
      ],
      es: [
        "Se requiere certificación Advanced Open Water para el naufragio",
        "Edad mínima: 15 años",
        "Se recomienda buen control de flotabilidad",
        "No recomendado para huéspedes con afecciones graves de corazón, respiratorias o de oído",
        NO_FLYING.es,
      ],
    },
    faq: [
      {
        q: { en: "Do I need Advanced certification?", es: "¿Necesito certificación Advanced?" },
        a: {
          en: "Yes — the wreck rests at 40 meters, beyond the 18-meter Open Water limit. Open Water divers can join shallower local sites instead.",
          es: "Sí — el naufragio está a 40 metros, más allá del límite de 18 metros de Open Water. Los buzos Open Water pueden unirse a sitios locales más superficiales.",
        },
      },
      {
        q: { en: "Is wreck penetration included?", es: "¿Se incluye penetración en el naufragio?" },
        a: {
          en: "External exploration is included for all advanced divers; interior penetration requires the Wreck Diver specialty certification.",
          es: "La exploración externa se incluye para todos los buzos avanzados; la penetración interior requiere la certificación de especialidad Wreck Diver.",
        },
      },
    ],
    sortOrder: 13,
  }),
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
    ...divingExcursions,
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

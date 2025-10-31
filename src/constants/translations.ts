
export type Language = 'en' | 'sv';

export const translations = {
  en: {
    navbar: {
      services: 'Services',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      headline: 'Building The Future',
      description: 'Discover our expertise in crafting visually stunning websites that captivate your audience. From ',
      descriptionHighlight: 'Intuitive UX',
      descriptionEnd: ' to seamless app functionality.',
    },
    services: {
      header: 'Scope of Services',
      subheader: 'Need something new or just rebranding? I will find a solution that fit your needs!',
      items: [
        {
          title: 'Websites',
          description: 'From simple landing pages to complex structures. I build modern, responsive websites regardless of scope.',
          highlightedWord: 'modern',
        },
        {
          title: 'Applications',
          description: 'I can provide custom business portals, dashboards, e-commerce or advanced tools. Your imagination is the limit!',
          highlightedWord: 'advanced',
        },
        {
          title: 'Web3',
          description: 'Looking for blockchain dApps? I have the experience to develop in the crypto world as well, being infra, backend or frontend.',
          highlightedWord: 'experience',
        },
      ],
    },
    reasons: {
      header: 'Why Choose OptiCode?',
      features: [
        {
          title: 'Long Experience',
          description: 'With over 20 years of coding, photography and IT skills (many years as full time web developer); I\'m well equipped to build your ideas.',
        },
        {
          title: 'Latest Technology',
          description: 'I believe in continuous improvement and always stay up to date with the latest trends and tech, such as the best coding stacks and agentic coding.',
        },
        {
          title: 'Competitive',
          description: 'By using optimized workflows I\'m able to go from idea to launch in a rapid pace, keeping the cost down while still providing cutting edge UI/UX.',
        },
      ],
    },
    cta: {
      headline: 'Ready to bring your ideas into action?',
      tagline: 'Let us discuss the next chapter together!',
      button: 'Contact Me',
    },
    contact: {
      linkedin: 'Visit Profile'
    }
  },
  sv: {
    navbar: {
      services: 'Tjänster',
      about: 'Om oss',
      contact: 'Kontakt',
    },
    hero: {
      headline: 'Bygger Framtiden',
      description: 'Upptäck vår expertis i att skapa visuellt grymma webbplatser som fångar in dina kunder. Från ',
      descriptionHighlight: 'Intuitiv UX',
      descriptionEnd: ' till smidig funktionalitet.',
    },
    services: {
      header: 'Utbud av Tjänster',
      subheader: 'Behöver du något nytt eller bara ändra om? Jag fixar en lösning som passar dina behov!',
      items: [
        {
          title: 'Webbplatser',
          description: 'Från enkla startsidor till komplexa strukturer. Jag bygger moderna, responsiva webbplatser oavsett omfattning.',
          highlightedWord: 'moderna',
        },
        {
          title: 'Applikationer',
          description: 'Jag kan fixa anpassade företagsportaler, instrumentbrädor, e-handel eller avancerade verktyg. Din fantasi sätter gränsen!',
          highlightedWord: 'avancerade',
        },
        {
          title: 'Web3',
          description: 'Gillar du blockkedjor? Jag utvecklar inom kryptovärlden också, vare sig det är infrastruktur, backend eller frontend.',
          highlightedWord: 'erfarenhet',
        },
      ],
    },
    reasons: {
      header: 'Varför OptiCode?',
      features: [
        {
          title: 'Lång Erfarenhet',
          description: 'Med över 20 års erfarenhet av programmering, fotografering och IT (med många år som webbutvecklare); så är jag väl rustad att bygga dina idéer.',
        },
        {
          title: 'Senaste Teknologin',
          description: 'Jag tror på kontinuerlig förädling och håller mig alltid uppdaterad med de senaste trenderna och teknikerna, såsom de bästa kodverktygen och AI.',
        },
        {
          title: 'Konkurrenskraftig',
          description: 'Genom optimerade arbetsflöden kan jag snabbt gå från idé till lansering, hålla nere kostnaderna samtidigt som jag fortfarande levererar modern UI/UX.',
        },
      ],
    },
    cta: {
      headline: 'Redo att förverkliga dina idéer?',
      tagline: 'Låt oss diskutera det tillsammans!',
      button: 'Kontakta Mig',
    },
    contact: {
      linkedin: 'Visa Profil'
    }
  },
} as const;


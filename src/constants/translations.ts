
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
      description: 'Discover my expertise in crafting visually stunning websites that captivate your audience. From ',
      descriptionHighlight: 'Intuitive UX',
      descriptionEnd: ' to seamless app functionality.',
    },
    services: {
      header: 'Scope of Services',
      subheader: 'Need something new or just rebranding? I will find a solution that fits your needs!',
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
          description: 'Looking for blockchain dApps? I have experience in developing for the crypto world as well, being infra, backend or frontend.',
          highlightedWord: 'experience',
        },
      ],
    },
    reasons: {
      header: 'Why Choose OptiCode?',
      features: [
        {
          title: 'Long Experience',
          description: 'I have over 20 years of coding, photography and IT skills, with many years as a full-time web developer. I\'m well equipped to build your next idea.',
        },
        {
          title: 'Latest Technology',
          description: 'I believe in continuous improvement and always stay up to date with the latest trends and tech, such as the best coding stacks and agentic coding.',
        },
        {
          title: 'Competitive',
          description: 'By using optimized workflows I\'m able to go from idea to launch in a rapid pace, keeping the cost down while still providing cutting edge intuitive UI/UX.',
        },
      ],
    },
    cta: {
      headline: 'Ready to bring your ideas into action?',
      tagline: 'Let us discuss the next chapter together. I\'m located in Kungsbacka, south of Gothenburg in Sweden. Can work on-site or remotely world wide at any time. Can be project based, hourly rate or whatever suits you best.',
      tagline2: 'Just define your scope and I\'m sure we can find a solution. I love solving complex problems and will not disappoint you!',
      button1: 'Contact Info',
      button2: 'About Me',
    },
    aboutMe: {
      title: 'David Mattiasson',
      subtitle: 'Full-Stack Developer & Company Owner',
      bio1: 'I was born in 1984 in Sweden and have a Bachelor\'s and Master\'s degree in Systems, Control and Mechatronics from Chalmers University of Technology.',
      bio2: 'I have worked 13 years as IT administrator and in various application manager roles. I\'ve been coding as a hobby my whole life and spent full time as a web developer since 2021.',
      bio3: 'Built very advanced frontend applications, tools, scripts, Figma designs and more. I\'m mastering JS stacks (React, Next, Node, Vue), CSS, HTML, TypeScript, Tailwind, Python, Google Cloud Services, Terraform and much more.',
    },
  },
  sv: {
    navbar: {
      services: 'Tjänster',
      about: 'Om Mig',
      contact: 'Kontakt',
    },
    hero: {
      headline: 'Bygger Framtiden',
      description: 'Upptäck min expertis i att skapa visuellt snygga webbplatser. Från ',
      descriptionHighlight: 'Intuitiv UX',
      descriptionEnd: ' till komplett funktionalitet.',
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
      header: 'Varför Välja OptiCode?',
      features: [
        {
          title: 'Lång Erfarenhet',
          description: 'Jag har över 20 års erfarenhet av programmering, fotografering och IT, med många år som webbutvecklare på heltid. Jag bygger gärna din nästa idé.',
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
      headline: 'Redo att förvandla dina idéer till verklighet?',
      tagline: 'Låt oss diskutera det tillsammans. Jag håller till i Kungsbacka, söder om Göteborg. Kan arbeta på plats eller på distans världen över när som helst. Kan vara projektbaserad, timpris eller vad som passar dig bäst.',
      tagline2: 'Beskriv ditt ärende och jag är säker på att vi kan hitta en lösning. Jag brinner för att lösa komplexa problem och kommer inte göra dig besviken!',
      button1: 'Kontaktinfo',
      button2: 'Om Mig',
    },
    aboutMe: {
      title: 'David Mattiasson',
      subtitle: 'Full-Stack Utvecklare & Företagare',
      bio1: 'Jag är född 1984 i Sverige och har kandidat- och masterexamen i Reglerteknik och Mekatronik från Chalmers Tekniska Högskola.',
      bio2: 'Jag har jobbat 13 år som IT-administratör och i olika roller som applikationsansvarig. Jag har programmerat som hobby hela livet och arbetat heltid som webbutvecklare sedan 2021.',
      bio3: 'Byggt mycket avancerade frontend-applikationer, verktyg, skripts, Figma-designer med mera. Jag behärskar JS-stackar (React, Next, Node, Vue), CSS, HTML, TypeScript, Tailwind, Python, Google Cloud Services, Terraform och mycket mer.',
    },
  },
} as const;


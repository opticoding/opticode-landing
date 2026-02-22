
export type Language = 'en' | 'sv';

export const translations = {
  en: {
    navbar: {
      services: 'Services',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      companyName: 'OptiCode AB',
      taglinePart1: 'Web Applications',
      taglinePart2: 'Built to Last',
      intro: 'I\'m David Mattiasson — one developer, fully focused on your project. I build',
      highlight: 'complex web applications',
      introEnd: 'for companies that need things done properly. You talk directly to the person writing the code.',
      locationBase: 'Based in Kungsbacka, Sweden',
      locationAvailability: 'Available Worldwide',
    },
    services: {
      header: 'What I Build',
      subheader: 'Whether you have a clear spec or just a rough idea — both are fine. Here\'s what I work on.',
      items: [
        {
          title: 'Websites',
          description: 'Fast, modern, clean and written in real code — not a page builder. Anything from a single landing page to a full company site, I build them properly and to last.',
          highlightedWord: 'properly',
        },
        {
          title: 'Applications',
          description: 'Custom dashboards, internal tools, business portals. The kind of builds that actually require thought — I\'m at my best when the problem is genuinely difficult.',
          highlightedWord: 'difficult',
        },
        {
          title: 'Web3',
          description: 'If your project touches blockchain — smart contracts, dApps, crypto infrastructure — I\'ve built in that space too. Have delivered advanced marketplaces and games.',
          highlightedWord: 'advanced',
        },
      ],
    },
    reasons: {
      header: 'Why Work With Me',
      features: [
        {
          title: '20 Years of Code',
          description: 'I\'ve been writing code since before most coding tools existed — 13 years as an IT professional and with a university degree. I think about how systems break, not just how they\'re built.',
        },
        {
          title: 'Modern Stack',
          description: 'React, Next.js, TypeScript, HTML, CSS, Tailwind, Material UI, Node, Python — frameworks that hold up. I work with top-notch AI tooling daily, which speeds things up without skipping the thinking.',
        },
        {
          title: 'Direct - No Fluff',
          description: 'You work with me, not a project manager relaying messages. If something in your brief doesn\'t make sense, I\'ll say so. If a better approach exists, I\'ll tell you. You can count on me to deliver the best solution!',
        },
      ],
    },
    cta: {
      headline: 'Have a project in mind?',
      tagline: 'Whether you have a clear scope or just a rough idea — I\'m happy to have a conversation with you. No pitch, no sale talk. Let\'s build something!',
      tagline2: 'Based in Kungsbacka (south of Gothenburg), working with clients worldwide. Project-based, hourly, or whatever fits your situation.',
      button1: 'Contact Info',
      button2: 'About Me',
    },
    aboutMe: {
      title: 'David Mattiasson',
      subtitle: 'Full-Stack Developer & Company Owner',
      bio1: 'I have a Master\'s degree in Systems, Control and Mechatronics from Chalmers — which maybe doesn\'t sound like web development, but gave me an analytical way of thinking that I use every day.',
      bio2: 'I\'ve been writing code since I was a kid, spent 13 years working in IT and application management, and have been fully focused on web development since 2021. That background means I understand how systems work, not just how they look.',
      bio3: 'Main stack: React, Next.js, TypeScript, Node, Python — with infrastructure on Google Cloud and Terraform. I also have experience in Web3 development and UI/UX design (Figma).',
    },
  },
  sv: {
    navbar: {
      services: 'Tjänster',
      about: 'Om Mig',
      contact: 'Kontakt',
    },
    hero: {
      companyName: 'OptiCode AB',
      taglinePart1: 'Webbapplikationer',
      taglinePart2: 'Som Funkar',
      intro: 'Jag heter David Mattiasson — en utvecklare som arbetar direkt med dig, utan mellanhänder. Jag bygger',
      highlight: 'komplexa webbapplikationer',
      introEnd: 'för företag som vill ha saker gjorda ordentligt. Du pratar direkt med den som skriver koden.',
      locationBase: 'Baserad i Kungsbacka, Sverige',
      locationAvailability: 'Tillgänglig Globalt',
    },
    services: {
      header: 'Vad Jag Bygger',
      subheader: 'Oavsett om du har en tydlig kravlista eller bara en lös idé — båda fungerar. Detta jobbar jag med.',
      items: [
        {
          title: 'Webbplatser',
          description: 'Snabbt, modernt och skriven med riktig kod — ingen sidbyggare. Allt från enkla startsidor till fullständiga plattformar, byggda ordentligt och för att hålla.',
          highlightedWord: 'ordentligt',
        },
        {
          title: 'Applikationer',
          description: 'Anpassade dashboards, interna verktyg, affärsportaler. Den typ av byggen som faktiskt kräver eftertanke — jag trivs bäst när problemet är genuint utmanande.',
          highlightedWord: 'utmanande',
        },
        {
          title: 'Web3',
          description: 'Om ditt projekt rör blockchain — smarta kontrakt, dApps, kryptoinfrastruktur — har jag byggt i den sektorn också. Har levererat avancerade marknadsplatser och spel.',
          highlightedWord: 'avancerade',
        },
      ],
    },
    reasons: {
      header: 'Varför Jobba Med Mig',
      features: [
        {
          title: '20 år av Kod',
          description: 'Jag har skrivit kod sedan innan de flesta verktygen existerade — 13 år som IT-proffs och en masterexamen från Chalmers. Jag tänker på hur system går sönder, inte bara hur de är konstruerade.',
        },
        {
          title: 'Modern Stack',
          description: 'React, Next.js, TypeScript, HTML, CSS, Tailwind, Node, Python — ramverk som håller. Jag jobbar med AI-verktyg dagligen, vilket gör leveransen snabbare utan att tumma på kvaliteten.',
        },
        {
          title: 'Direkt - Inget Fusk',
          description: 'Du jobbar med mig, inte en projektledare som vidarebefordrar meddelanden. Om något med din idé inte stämmer säger jag det. Om ett bättre tillvägagångssätt finns berättar jag det.',
        },
      ],
    },
    cta: {
      headline: 'Har du ett projekt i åtanke?',
      tagline: 'Oavsett om du har en tydlig kravlista eller bara en lös idé — jag tar gärna ett samtal med dig. Ingen pitch, inget sälj-trams. Låt oss bygga något!',
      tagline2: 'Baserad i Kungsbacka (söder om Göteborg), jobbar med kunder världen över. Projektbaserat eller löpande — det som passar din situation.',
      button1: 'Kontaktinfo',
      button2: 'Om Mig',
    },
    aboutMe: {
      title: 'David Mattiasson',
      subtitle: 'Full-Stack Utvecklare & Företagare',
      bio1: 'Jag har en masterexamen i Reglerteknik och Mekatronik från Chalmers — kanske inte låter som webbutveckling, men gav mig ett analytiskt tankesätt som jag använder varje dag.',
      bio2: 'Jag har skrivit kod sedan jag var liten, jobbat 13 år inom IT och applikationsförvaltning, och har sedan 2021 fokuserat helt på webbutveckling. Den bakgrunden gör att jag förstår hur system fungerar — inte bara hur de ser ut.',
      bio3: 'Huvudstack: React, Next.js, TypeScript, Node, Python — med infrastruktur på Google Cloud och Terraform. Har även erfarenhet av Web3-utveckling och UI/UX-design (Figma).',
    },
  },
} as const;


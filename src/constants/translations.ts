
export type Language = 'en' | 'sv';

export const translations = {
  en: {
    navbar: {
      services: 'Services',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      companyName: 'OptiCode AB',
      taglinePart1: 'Web Applications',
      taglinePart2: 'Built to Last',
      intro: 'I\'m David Mattiasson. I build',
      highlight: 'complex web applications',
      introEnd: 'for companies that need things done properly. You talk directly to the person writing the code.',
      locationBase: 'Based in Kungsbacka, Sweden',
      locationAvailability: 'Available Worldwide',
    },
    services: {
      header: 'What I Build',
      subheader: 'Whether you have a clear spec or just a rough idea, both are fine. Here\'s what I work on.',
      items: [
        {
          title: 'Websites',
          description: 'Fast, modern, clean and written in real code, not a page builder. Anything from a single landing page to a full company site, I build them properly and to last.',
          highlightedWord: 'properly',
        },
        {
          title: 'Applications',
          description: 'Custom dashboards, internal tools, business portals. The kind of builds that actually require thought. I\'m at my best when the problem is genuinely difficult.',
          highlightedWord: 'difficult',
        },
        {
          title: 'Web3',
          description: 'Does your project touch blockchain like smart contracts, dApps, or crypto infrastructure? I\'ve built advanced marketplaces and games in that space too.',
          highlightedWord: 'advanced',
        },
      ],
    },
    reasons: {
      header: 'Why Work With Me',
      features: [
        {
          title: '20 Years of Code',
          description: 'I\'ve been writing code since before most coding tools existed. 13 years as an IT professional and with a university degree. I think about how systems break, not just how they\'re built.',
        },
        {
          title: 'Modern Stack',
          description: 'React, Next.js, TypeScript, HTML, CSS, Tailwind, Material UI, Node, Python, etc. I work with top-notch AI tooling daily, which speeds things up without skipping the thinking.',
        },
        {
          title: 'Direct - No Fluff',
          description: 'You work with me, not a project manager relaying messages. If something in your brief doesn\'t make sense, I\'ll say so. If a better approach exists, I\'ll tell you. You can count on me to deliver the best solution!',
        },
      ],
    },
    projects: {
      header: 'My Projects',
      subheader: 'Some examples of what I\'ve built.',
      customer: 'Customer',
      type: 'Type',
      active: 'Active',
      inactive: 'Inactive',
      tech: 'Built with',
      techGroups: {
        frontend: 'Frontend',
        backend: 'Backend',
        contracts: 'Smart contracts',
        hosting: 'Hosting',
        watch: 'Watch app',
      },
      showMore: 'View Screenshots',
      website: 'Visit website',
      github: 'View on GitHub',
      newTab: 'opens in a new tab',
      previous: 'Previous project',
      next: 'Next project',
      chooseProject: 'Choose a project',
      carousel: 'carousel',
      slide: 'slide',
      of: 'of',
      images: 'images',
      image: 'image',
      preview: 'project preview',
      scrollGallery: 'Scroll to explore',
      closeGallery: 'Close gallery',
      items: {
        grq: {
          title: 'Hollywood App',
          customer: 'Film producer Steven Bernstein',
          type: 'Web application',
          description: [
            'A promotional web app for the independent film, GRQ. It brought together a trailer, interactive 3D environments, an NFT minting platform, and paid access to the film.',
            'At its heart was a treasure hunt spanning Web3 (blockchain) and encrypted clues stored securely. Players could win prizes and explore digital merchandise in 3D.',
          ],
          screenshots: ['Landing page with trailer', 'About the movie', 'Game prizes and interview', 'Game content', 'NFT clues and 3D scratch tickets', 'Treasure hunt submission', 'Interactive puzzle game'],
        },
        stepcrafter: {
          title: 'Garmin Game',
          customer: 'Myself',
          type: 'Garmin watch app + web application',
          description: [
            'A free training app for Garmin watches that turns your steps into progress in a text-based RPG. Craft materials from recipes, earn XP, and unlock new skills and materials.',
            'Everything runs from your watch, with progress and global leaderboards also available on the web. Climbing the ranks takes planning and strategy.',
          ],
          screenshots: ['Example screens from the watch app', 'Global leaderboard', 'Profile page', 'Item collection', 'Item details'],
        },
        more: {
          title: 'More Projects',
          customer: null,
          type: 'Open source',
          description: [
            'Coding projects and experiments, open for everyone to explore. Feel free to come back and see what I\'m working on!',
          ],
          screenshots: ['AI snake game', 'App for projecting investments'],
        },
      },
    },
    cta: {
      headline: 'Have a project in mind?',
      tagline: 'Whether you have a clear scope or just a rough idea, I\'m happy to have a conversation with you. No pitch, no sale talk. Let\'s build something!',
      tagline2: 'Based in Kungsbacka (south of Gothenburg), working with clients worldwide. Project-based, hourly, or whatever fits your situation.',
      button1: 'Contact Info',
      button2: 'About Me',
    },
    aboutMe: {
      title: 'David Mattiasson',
      subtitle: 'Full-Stack Developer & Company Owner',
      bio1: 'I have a Master\'s degree in Systems, Control and Mechatronics from Chalmers, which maybe doesn\'t sound like web development, but gave me an analytical way of thinking that I use every day.',
      bio2: 'I\'ve been writing code since I was a kid, spent 13 years working in IT and application management, and have been fully focused on web development since 2021. That background means I understand how systems work, not just how they look.',
      bio3: 'Main stack: React, Next.js, TypeScript, Node, Python and with infrastructure on Google Cloud and Terraform. I also have experience in Web3 development and UI/UX design (Figma).',
    },
    snakeGame: {
      title: 'Play some snake before you leave',
    },
  },
  sv: {
    navbar: {
      services: 'Tjänster',
      about: 'Om Mig',
      projects: 'Projekt',
      contact: 'Kontakt',
    },
    hero: {
      companyName: 'OptiCode AB',
      taglinePart1: 'Webbapplikationer',
      taglinePart2: 'Som Funkar',
      intro: 'Jag heter David Mattiasson. Jag bygger',
      highlight: 'komplexa webbapplikationer',
      introEnd: 'för företag som vill ha saker gjorda ordentligt. Du pratar direkt med den som skriver koden.',
      locationBase: 'Baserad i Kungsbacka, Sverige',
      locationAvailability: 'Tillgänglig Globalt',
    },
    services: {
      header: 'Vad Jag Bygger',
      subheader: 'Oavsett om du har en tydlig kravlista eller bara en lös idé, båda funkar fint. Detta jobbar jag med.',
      items: [
        {
          title: 'Webbplatser',
          description: 'Snabbt, modernt och skriven med riktig kod, ingen sidbyggare. Allt från enkla startsidor till fullständiga plattformar, byggda ordentligt och för att hålla.',
          highlightedWord: 'ordentligt',
        },
        {
          title: 'Applikationer',
          description: 'Anpassade dashboards, interna verktyg, affärsportaler. Den typ av byggen som faktiskt kräver eftertanke. Jag trivs bäst när problemet är genuint utmanande.',
          highlightedWord: 'utmanande',
        },
        {
          title: 'Web3',
          description: 'Om ditt projekt rör blockchain, smarta kontrakt, dApps eller kryptoinfrastruktur så har jag levererat avancerade marknadsplatser och spel i den sektorn också.',
          highlightedWord: 'avancerade',
        },
      ],
    },
    reasons: {
      header: 'Varför Jobba Med Mig',
      features: [
        {
          title: '20 år av Kod',
          description: 'Jag har skrivit kod sedan innan de flesta verktygen existerade. 13 år som IT-proffs och en masterexamen från Chalmers. Jag tänker på hur system går sönder, inte bara hur de är konstruerade.',
        },
        {
          title: 'Modern Stack',
          description: 'React, Next.js, TypeScript, HTML, CSS, Tailwind, Node, Python, dvs. ramverk som håller. Jag jobbar med AI-verktyg dagligen, vilket gör leveransen snabbare utan att tumma på kvaliteten.',
        },
        {
          title: 'Direkt - Inget Fusk',
          description: 'Du jobbar med mig, inte en projektledare som vidarebefordrar meddelanden. Om något med din idé inte stämmer säger jag det. Om ett bättre tillvägagångssätt finns berättar jag det.',
        },
      ],
    },
    projects: {
      header: 'Mina Projekt',
      subheader: 'Några exempel på det jag har byggt.',
      customer: 'Kund',
      type: 'Typ',
      active: 'Aktivt',
      inactive: 'Inaktivt',
      tech: 'Byggt med',
      techGroups: {
        frontend: 'Frontend',
        backend: 'Backend',
        contracts: 'Smarta kontrakt',
        hosting: 'Hosting',
        watch: 'Klockapp',
      },
      showMore: 'Visa Bilder',
      website: 'Besök webbplatsen',
      github: 'Se på GitHub',
      newTab: 'öppnas i en ny flik',
      previous: 'Föregående projekt',
      next: 'Nästa projekt',
      chooseProject: 'Välj ett projekt',
      carousel: 'karusell',
      slide: 'projekt',
      of: 'av',
      images: 'bilder',
      image: 'bild',
      preview: 'förhandsvisning av projektet',
      scrollGallery: 'Scrolla för att se mer',
      closeGallery: 'Stäng bildgalleriet',
      items: {
        grq: {
          title: 'Hollywood App',
          customer: 'Filmproducent Steven Bernstein',
          type: 'Webbapplikation',
          description: [
            'En webbapp för att marknadsföra indiefilmen GRQ. Här samlades trailern, interaktiva 3D-miljöer, en plattform för att skapa NFT:er och möjligheten att se filmen mot betalning.',
            'Kärnan var en skattjakt som sträckte sig över både Web3 (blockkedja) och krypterade ledtrådar. Spelarna kunde vinna priser och utforska digitala filmprylar i 3D.',
          ],
          screenshots: ['Landningssida med trailer', 'Om filmen', 'Spelpriser och intervju', 'Spelinnehåll', 'NFT-ledtrådar och 3D-lotter', 'Svar på skattjakt', 'Interaktivt pusselspel'],
        },
        stepcrafter: {
          title: 'Garmin Spel',
          customer: 'Mig själv',
          type: 'App för smartklockor + webbapp',
          description: [
            'StepCrafer är en gratis träningsapp för Garmin-klockor som gör dina steg till framsteg i ett textbaserat rollspel. Skapa material efter recept, samla XP och lås upp nya färdigheter och material. Ju längre du kommer, desto mer finns att klura på.',
            'Du styr allt från klockan och kan följa din utveckling och den globala topplistan på webben. För att komma långt behövs planering och strategi. En god anledning att ta en extra promenad!',
          ],
          screenshots: ['Exempelskärmar från appen', 'Global topplista', 'Profilsida', 'Materialsamling', 'Materialdetaljer'],
        },
        more: {
          title: 'Fler Projekt',
          customer: null,
          type: 'Öppen källkod',
          description: [
            'Kodprojekt och experiment som är öppna för alla. Kika gärna in igen och se vad jag jobbar på!',
          ],
          screenshots: ['Snakespel med AI', 'App för att projektera investeringar'],
        },
      },
    },
    cta: {
      headline: 'Har du ett projekt i åtanke?',
      tagline: 'Oavsett om du har en tydlig kravlista eller bara en lös idé så tar jag gärna ett samtal med dig. Ingen pitch, inget sälj-trams. Låt oss bygga något kul!',
      tagline2: 'Baserad i Kungsbacka (söder om Göteborg), jobbar med kunder världen över. Projektbaserat eller löpande, dvs. det som passar din situation.',
      button1: 'Kontaktinfo',
      button2: 'Om Mig',
    },
    aboutMe: {
      title: 'David Mattiasson',
      subtitle: 'Full-Stack Utvecklare & Företagare',
      bio1: 'Jag har en masterexamen i Reglerteknik och Mekatronik från Chalmers. Det kanske inte låter som webbutveckling, men gav mig ett analytiskt tankesätt som jag använder varje dag.',
      bio2: 'Jag har skrivit kod sedan jag var liten, jobbat 13 år inom IT och applikationsförvaltning, och har sedan 2021 fokuserat helt på webbutveckling. Den bakgrunden gör att jag förstår hur system fungerar och inte bara hur de ser ut.',
      bio3: 'Huvudstack: React, Next.js, TypeScript, Node, Python och med infrastruktur på Google Cloud och Terraform. Har även erfarenhet av Web3-utveckling och UI/UX-design (Figma).',
    },
    snakeGame: {
      title: 'Kör lite snake innan du går',
    },
  },
} as const;


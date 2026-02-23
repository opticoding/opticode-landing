import type { Metadata, Viewport } from 'next';
import { Audiowide, Urbanist } from 'next/font/google';
import CustomCursor from '@/components/CustomCursor';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-audiowide',
});

const urbanist = Urbanist({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-urbanist',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://opticode.se'),
  title: 'OptiCode AB | Web Application Developer in Sweden',
  description: 'I build web applications and custom tools for businesses. One developer, direct access, no agency overhead. Based in Kungsbacka, Sweden.',
  applicationName: 'OptiCode AB',
  keywords: [
    // Core — high intent, specific
    'web developer sweden',
    'webbutvecklare kungsbacka',
    'webbutvecklare göteborg',
    'full stack developer sweden',
    'david mattiasson',
    'opticode',
    'opticode ab',

    // Services
    'web application development',
    'custom web applications',
    'custom software development',
    'dashboard development',
    'business portals',
    'internal tools development',
    'webbapplikation',
    'webb konsult',

    // Tech stack (for technical clients)
    'react developer sweden',
    'next.js developer',
    'typescript developer',
    'node.js development',
    'python developer',

    // Specialized
    'web3 development',
    'blockchain applications',

    // Location
    'kungsbacka',
    'göteborg',
    'halland',
    'sweden',
    'sverige',

    // Engagement model
    'freelance web developer',
    'contract web developer',
    'remote web development',
  ],
  authors: [{ name: 'David Mattiasson', url: 'https://opticode.se' }],
  creator: 'David Mattiasson',
  publisher: 'OptiCode AB',
  alternates: {
    canonical: 'https://opticode.se',
    languages: {
      'en': 'https://opticode.se',
      'sv': 'https://opticode.se',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OptiCode AB | Web Application Developer in Sweden',
    description: 'David Mattiasson builds web applications and custom tools for businesses. One developer, direct access, no agency overhead.',
    images: '/og.png',
  },
  openGraph: {
    title: 'OptiCode AB | Web Application Developer in Sweden',
    description: 'I build web applications and custom tools for businesses. One developer, direct access, no agency overhead. Based in Kungsbacka, Sweden.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'OptiCode AB — Web Application Developer' }],
    url: 'https://opticode.se',
    siteName: 'OptiCode AB',
    locale: 'en_US',
    alternateLocale: 'sv_SE',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OptiCode AB',
  },
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'SE-N',
    'geo.placename': 'Kungsbacka, Sweden',
    'geo.position': '57.4897;12.0765',
    'ICBM': '57.4897, 12.0765',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://opticode.se/#person',
      name: 'David Mattiasson',
      jobTitle: 'Full-Stack Web Developer',
      url: 'https://opticode.se',
      sameAs: [
        'https://www.linkedin.com/in/davidmattiasson/',
        'https://github.com/opticoding',
      ],
      worksFor: { '@id': 'https://opticode.se/#business' },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Chalmers University of Technology',
        url: 'https://www.chalmers.se',
      },
      knowsAbout: [
        'Web Application Development',
        'Full-Stack Development',
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'Python',
        'Google Cloud',
        'Terraform',
        'Web3',
        'UI/UX Design',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://opticode.se/#business',
      name: 'OptiCode AB',
      url: 'https://opticode.se',
      description: 'Full-stack web application development for businesses. Custom dashboards, internal tools, business portals and product launches. One developer, direct access.',
      founder: { '@id': 'https://opticode.se/#person' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kungsbacka',
        addressRegion: 'Halland',
        addressCountry: 'SE',
        postalCode: '43430',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 57.4897,
        longitude: 12.0765,
      },
      areaServed: 'Worldwide',
      serviceType: [
        'Web Application Development',
        'Custom Software Development',
        'Full-Stack Development',
        'Dashboard Development',
        'Business Portal Development',
        'Web3 Development',
      ],
      sameAs: [
        'https://www.linkedin.com/in/davidmattiasson/',
        'https://github.com/opticoding',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${audiowide.variable} ${urbanist.variable}`} suppressHydrationWarning={true}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <CustomCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

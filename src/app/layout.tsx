import type { Metadata, Viewport } from 'next';
import { Audiowide, Urbanist } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import { LanguageProvider } from '@/contexts/LanguageContext';

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
  title: 'OptiCode AB - Full-Stack Web Development & Digital Solutions',
  description: 'Professional web development services. 13 years of IT experience building advanced web applications and custom business solutions. Based in Sweden, available worldwide.',
  applicationName: 'OptiCode AB',
  keywords: [
    // Core Services (High Intent)
    'web developer sweden',
    'web development kungsbacka',
    'webbutvecklare göteborg',
    'full stack developer sweden',
    'custom web applications',
    'business web solutions',
    
    // Service Types
    'web development',
    'web application development',
    'custom software development',
    'responsive web design',
    'e-commerce development',
    'business portals',
    'dashboard development',
    
    // Tech Stack (For Technical Clients)
    'react developer',
    'next.js development',
    'typescript developer',
    'tailwind',
    'css',
    'node.js development',
    'python developer',
    
    // Specialized
    'web3 development',
    'blockchain applications',
    'dApps development',
    
    // Location-Based
    'kungsbacka',
    'göteborg',
    'västra götaland',
    'sweden',
    'sverige',
    
    // Business Terms
    'freelance web developer',
    'contract web developer',
    'remote web development',
    'opticode ab',
  ],
  authors: [{ name: 'David Mattiasson' }],
  creator: 'David Mattiasson - OptiCode AB',
  publisher: 'OptiCode AB',
  twitter: {
    card: 'summary_large_image',
    title: 'OptiCode AB - Professional Web Development Services',
    description: 'Building advanced web applications and digital solutions worldwide.',
    images: 'https://opticode.se/og.png',
  },
  openGraph: {
    title: 'OptiCode AB - Full-Stack Web Development in Sweden',
    description: 'Professional web development services. 13 years of IT experience building advanced web applications and custom business solutions. Based in Sweden, available worldwide.',
    images: 'https://opticode.se/og.png',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${audiowide.variable} ${urbanist.variable}`} suppressHydrationWarning={true}>
        <LanguageProvider>
          <CustomCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

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
  title: 'OptiCode - Building Future Web Applications',
  description: 'Discover our expertise in crafting visually stunning websites that captivate your audience. From intuitive UX to seamless app functionality. We build modern, responsive websites, custom applications, and Web3 solutions.',
  applicationName: 'OptiCode',
  keywords: [
    'web development',
    'website design',
    'web design',
    'responsive design',
    'UI/UX',
    'custom websites',
    'landing pages',
    'web applications',
    'business portals',
    'dashboards',
    'e-commerce',
    'Web3',
    'blockchain',
    'dApps',
    'decentralized applications',
    'crypto',
    'frontend development',
    'backend development',
    'full stack',
    'Next.js',
    'React',
    'modern web',
    'cutting edge UI',
    'Sweden',
    'web development services',
    'application development',
    'IT services',
    'software development',
  ],
  authors: [{ name: 'OptiCode' }],
  creator: 'OptiCode',
  publisher: 'OptiCode',
  twitter: {
    card: 'summary_large_image',
    title: 'OptiCode - Building The Future Web',
    description: 'Discover our expertise in crafting visually stunning websites that captivate your audience. From intuitive UX to seamless app functionality.',
    images: 'https://opticode.se/og.png',
    site: '@opticoding',
    creator: '@opticoding',
  },
  openGraph: {
    title: 'OptiCode - Building The Future Web',
    description: 'Discover our expertise in crafting visually stunning websites that captivate your audience. From intuitive UX to seamless app functionality.',
    images: 'https://opticode.se/og.png',
    url: 'https://opticode.se',
    siteName: 'OptiCode',
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
    title: 'OptiCode',
  },
  category: 'technology',
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

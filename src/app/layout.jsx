import './globals.css';
import ClientLayout from './ClientLayout';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'DirectorioPY - Directorio de Comercios en Paraguay',
  description: 'El directorio web de comercios, empresas y servicios de Paraguay optimizado para búsquedas.',
  openGraph: {
    title: 'DirectorioPY - Directorio de Comercios en Paraguay',
    description: 'Encontrá empresas verificadas en Asunción, Luque, San Lorenzo, CDE y Encarnación. Contactá directo por WhatsApp.',
    url: 'https://directoriopy.com',
    siteName: 'DirectorioPY',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DirectorioPY - Comercios en Paraguay',
      },
    ],
    locale: 'es_PY',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.className}>
      <head>
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

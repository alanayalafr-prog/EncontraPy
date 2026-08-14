import './globals.css';
import ClientLayout from './ClientLayout';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'DirectorioPY - Directorio de Comercios en Paraguay',
  description: 'El directorio web de comercios, empresas y servicios de Paraguay optimizado para búsquedas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.className}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

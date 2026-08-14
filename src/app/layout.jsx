import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'DirectorioPY - Directorio de Comercios en Paraguay',
  description: 'El directorio web de comercios, empresas y servicios de Paraguay optimizado para búsquedas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

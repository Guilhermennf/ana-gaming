import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation/Navigation';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper/SessionProviderWrapper';
import { ReactQueryProvider } from '@/lib/queryProvider';
import anaGamingLogo from '@/assets/imgs/ana_gaming_logo.jpeg';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ana Gaming',
  description:
    'Visualize apostas esportivas online, filtre por ligas específicas e explore odds específicas.',
  icons: {
    icon: anaGamingLogo.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ReactQueryProvider>
          <SessionProviderWrapper>
            <Navigation />
            {children}
          </SessionProviderWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

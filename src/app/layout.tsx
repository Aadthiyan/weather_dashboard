import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

export const metadata: Metadata = {
  title: 'Weather Dashboard',
  description: 'Historical Weather Data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable}`}>
        <Header />
        <Sidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  );
}

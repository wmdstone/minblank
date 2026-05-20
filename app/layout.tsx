import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Lomba Kitab Fiqih - Ansor Ngembal',
  description: 'Pendaftaran Lomba Kitab Fiqih Spesial Harlah Ansor Ngembal',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-slate-800" suppressHydrationWarning>{children}</body>
    </html>
  );
}

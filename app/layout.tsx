import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CookbookProvider } from '@/components/CookbookProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dishcovery | Cook tested recipes without ads or blog essays',
    template: '%s | Dishcovery',
  },
  description:
    'Cook tested recipes from TheMealDB with ingredient checklists, step guides with screen wake lock, and personal cookbook lists without ads.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-orange-100 selection:text-orange-900">
        <CookbookProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CookbookProvider>
      </body>
    </html>
  );
}
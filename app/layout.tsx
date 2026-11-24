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
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dishcovery_theme');var isDark=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(isDark){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');}else{document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-orange-100 selection:text-orange-900 transition-colors dark:bg-stone-950 dark:text-stone-100 dark:selection:bg-orange-900/50 dark:selection:text-orange-200">
        <CookbookProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CookbookProvider>
      </body>
    </html>
  );
}
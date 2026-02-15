import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Repo Insights — GitHub Repository Analytics',
  description:
    'Visualize commit patterns, language breakdown, and contributor stats for any GitHub repository.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link
                href="/"
                className="text-lg font-bold text-zinc-900 dark:text-white"
              >
                Repo Insights
              </Link>
              <nav className="flex items-center gap-4">
                <Link
                  href="/compare"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  Compare
                </Link>
                <AuthButton />
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-zinc-500">
              Built with Next.js, Recharts & GitHub API
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}

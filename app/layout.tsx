import type {Metadata} from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mailing Frontend - Marketing Campaign & Subscriber Dashboard',
  description: 'Email marketing campaign management dashboard with subscriber tracking, visual email template builder, project SMTP integration, and role-based access control.',
  openGraph: {
    title: 'Mailing Frontend - Marketing Campaign & Subscriber Dashboard',
    description: 'Email marketing campaign management dashboard with subscriber tracking, visual email template builder, project SMTP integration, and role-based access control.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mailing Frontend - Marketing Campaign & Subscriber Dashboard',
    description: 'Email marketing campaign management dashboard with subscriber tracking, visual email template builder, project SMTP integration, and role-based access control.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${roboto.variable}`}>
      <body className="font-[family-name:var(--font-roboto)] antialiased bg-white text-slate-700 min-h-screen" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


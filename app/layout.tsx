import { Fraunces } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ReactNode } from 'react';
import AppleTouchIcon from '../public/favicon/apple-touch-icon.png';
import Favicon32 from '../public/favicon/favicon-32x32.png';
import Favicon16 from '../public/favicon/favicon-16x16.png';
import { Nav } from '@/components/nav';
import { DialogProvider } from '@/lib/providers/dialog';

interface LayoutProps {
  children: ReactNode;
}

const fontHeading = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={AppleTouchIcon.src} />
        <link rel="icon" type="image/png" sizes="32x32" href={Favicon32.src} />
        <link rel="icon" type="image/png" sizes="16x16" href={Favicon16.src} />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable,
        )}>
        <DialogProvider>
          <div>
            <Nav />
            <div className="pt-[73px]">
              {children}
            </div>
          </div>
        </DialogProvider>
      </body>
    </html>
  );
}
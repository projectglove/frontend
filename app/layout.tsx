'use client';

import { Fraunces } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { ReactNode, useEffect, useState } from 'react';
import AppleTouchIcon from '../public/favicon/apple-touch-icon.png';
import Favicon32 from '../public/favicon/favicon-32x32.png';
import Favicon16 from '../public/favicon/favicon-16x16.png';
import Nav from '@/components/nav';
import { DialogProvider } from '@/lib/providers/dialog';
import { ApiProvider } from '@/lib/providers/api';
import { AccountProvider, useAccounts } from '@/lib/providers/account';
import { SnackbarProvider } from '@/lib/providers/snackbar';
import Footer from '@/components/footer';
import LearnMore from '@/components/learn-more';
import dynamic from 'next/dynamic';
import AccountSelector from '@/components/account-selector';
import VoteHistory from '@/components/vote-history';
import VerifyVote from '@/components/verify-vote';
import GloveTest from '@/components/__tests__/e2e/glove-test';
import Script from 'next/script';
// import ConfirmVote from '@/components/confirm-vote';

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

const GloveProxy = dynamic(() => import('../components/glove-proxy'), { ssr: false });
const ConfirmVote = dynamic(() => import('../components/confirm-vote'), { ssr: false });

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
        <noscript>
          <div className="bg-primary text-foreground p-4 text-center">
            This website requires JavaScript to function properly. Please enable JavaScript in your browser settings.
          </div>
        </noscript>
        <ApiProvider>
          <DialogProvider>
            <AccountProvider>
              <SnackbarProvider>
                <div>
                  <AccountSelector />
                  <ConfirmVote />
                  <GloveProxy />
                  <LearnMore />
                  <VerifyVote />
                  <VoteHistory />
                  <Nav />
                  <div className="pt-[73px]">
                    {children}
                  </div>
                  <Footer />
                </div>
                {/* TODO: cypress-polkadot-wallet does not work in our repo for somem reason */}
                <GloveTest />
                {/* <Script type="module" src="/app/glove-test.ts" defer></Script> */}
              </SnackbarProvider>
            </AccountProvider>
          </DialogProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
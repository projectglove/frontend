"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import GloveIcon from '../public/glove.png';
import Image from "next/image";
import { useDialog } from "@/lib/providers/dialog";
import { useEffect, useState } from "react";
import { useAccounts } from "@/lib/providers/account";
import ConnectWallet from "./connect-wallet";
import dynamic from "next/dynamic";

// const ConnectWallet = dynamic(() => import('./connect-wallet'), { ssr: false });

const GloveLogo = () => {
  return (
    <a href="#" className="flex items-center">
      <Image src={GloveIcon} alt="Glove Logo" className="h-8 w-8 mr-1" />
      <span className="text-xl font-bold">Glove</span>
    </a>
  );
};

export default function Nav() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const { openNavMenu, setOpenNavMenu, setOpenGloveProxy } = useDialog();
  const { currentProxy } = useAccounts();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setVisible(lastScrollY > currentScrollY || currentScrollY < 10);
        setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const handleJoinGlove = () => {
    setOpenGloveProxy(true);
  };
  const viewDocs = () => {
    window.open('https://github.com/projectglove/glove-monorepo/?tab=readme-ov-file#building-glove', '_blank');
  };

  const Links = () => {
    return (
      <div className="flex flex-col md:flex-row sm:justify-center space-y-4 md:space-y-0 md:space-x-4">
        <ConnectWallet />
        <Button onClick={viewDocs} variant="outline" className="px-4 py-2 rounded-md">
          Docs
        </Button>
        <Button
          onClick={handleJoinGlove}
          variant="secondary"
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-bold">
          {currentProxy ? 'Exit Glove' : 'Join Glove'}
        </Button>
      </div>
    );
  };

  return (
    <nav className={`fixed bg-background top-0 left-0 right-0 transition-transform duration-300 ${ visible ? 'translate-y-0' : '-translate-y-full' } z-50 flex items-center justify-between p-4 border-b`}>
      <GloveLogo />
      <div className="hidden md:flex space-x-4">
        <Links />
      </div>
      <div className="md:hidden">
        <Dialog open={openNavMenu} onOpenChange={setOpenNavMenu}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-md">
              <MenuIcon className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
            <div className="bg-background rounded-lg border-2 border-primary p-6 w-full flex items-center justify-center">
              <div className="w-full">
                <DialogHeader className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-bold mb-4"><GloveLogo /></DialogTitle>
                </DialogHeader>
                <Links />
                <DialogFooter className="mt-4">
                  <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenNavMenu(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
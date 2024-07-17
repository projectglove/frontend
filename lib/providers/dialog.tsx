'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextType {
  openLoginScreen: boolean;
  setOpenLoginScreen: (open: boolean) => void;
  openNavMenu: boolean;
  setOpenNavMenu: (openMenu: boolean) => void;
  openExtensions: boolean;
  setOpenExtensions: (openExtensions: boolean) => void;
  openJoinGlove: boolean;
  setOpenJoinGlove: (openJoinGlove: boolean) => void;
  openVote: boolean;
  setOpenVote: (openVote: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode; }) => {
  const [openLoginScreen, setOpenLoginScreen] = useState(true);
  const [openNavMenu, setOpenNavMenu] = useState(false);
  const [openExtensions, setOpenExtensions] = useState(false);
  const [openJoinGlove, setOpenJoinGlove] = useState(false);
  const [openVote, setOpenVote] = useState(false);

  return (
    <DialogContext.Provider value={{
      openLoginScreen,
      setOpenLoginScreen,
      openNavMenu,
      setOpenNavMenu,
      openExtensions,
      setOpenExtensions,
      openJoinGlove,
      setOpenJoinGlove,
      openVote,
      setOpenVote
    }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
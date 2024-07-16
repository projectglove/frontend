'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMenu: boolean;
  setOpenMenu: (openMenu: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode; }) => {
  const [openConnect, setOpenConnect] = useState(false);
  const [openNavMenu, setOpenNavMenu] = useState(false);

  return (
    <DialogContext.Provider value={{ open: openConnect, setOpen: setOpenConnect, openMenu: openNavMenu, setOpenMenu: setOpenNavMenu }}>
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
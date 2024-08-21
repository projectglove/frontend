'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Conviction, DialogContextType, PreferredDirection, ReferendumData, ReferendumDialogProps } from '../types';

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode; }) => {
  const [openLoginScreen, setOpenLoginScreen] = useState(true);
  const [openNavMenu, setOpenNavMenu] = useState(false);
  const [openExtensions, setOpenExtensions] = useState(false);
  const [openGloveProxy, setOpenGloveProxy] = useState(false);
  const [openVote, setOpenVote] = useState(false);
  const [openLearnMore, setOpenLearnMore] = useState(false);
  const [openReferendumDialog, setOpenReferendumDialog] = useState<boolean>(false);
  const [openVoteHistory, setOpenVoteHistory] = useState<boolean>(false);
  const [referendum, setReferendum] = useState<ReferendumDialogProps | null>(null);
  const [amounts, setAmounts] = useState<{ [key: number]: number | string; }>({});
  const [multipliers, setMultipliers] = useState<{ [key: number]: Conviction; }>({});
  const [directions, setDirections] = useState<{ [key: number]: PreferredDirection; }>({});

  const setVotingOptions = (amounts: { [key: number]: number | string; }, multipliers: { [key: number]: Conviction; }, directions: { [key: number]: PreferredDirection; }) => {
    setAmounts(amounts);
    setMultipliers(multipliers);
    setDirections(directions);
  };

  return (
    <DialogContext.Provider value={{
      openLoginScreen,
      setOpenLoginScreen,
      openNavMenu,
      setOpenNavMenu,
      openExtensions,
      setOpenExtensions,
      openGloveProxy,
      setOpenGloveProxy,
      openVote,
      setOpenVote,
      openLearnMore,
      setOpenLearnMore,
      openReferendumDialog,
      setOpenReferendumDialog,
      referendum,
      setReferendum,
      amounts,
      multipliers,
      directions,
      setVotingOptions,
      openVoteHistory,
      setOpenVoteHistory
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
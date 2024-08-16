import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import { ReactNode } from "react";

export interface LinearDecreasing {
  length: string;
  floor: string;
  ceil: string;
}

export interface Reciprocal {
  factor: number;
  xOffset: number;
  yOffset: number;
}

export interface MinApproval {
  LinearDecreasing: LinearDecreasing;
}

export interface MinSupport {
  Reciprocal: Reciprocal;
}

export interface TrackConfig {
  name: string;
  maxDeciding: number;
  decisionDeposit: number;
  preparePeriod: number;
  decisionPeriod: number;
  confirmPeriod: number;
  minEnactmentPeriod: number;
  minApproval: MinApproval;
  minSupport: MinSupport;
}

export type TrackEntry = [number, TrackConfig];

export type PreferredDirection = 'Aye' | 'Nay' | 'None';

export interface ExtensionConfig {
  disallowed: string[];
  supported: Array<{
    id: string;
    title: string;
    description: string;
    urls: {
      main: string;
      browsers: {
        chrome: string;
        firefox: string;
      };
    };
    iconUrl: string;
  }>;
}

export interface VotingOptionsProps {
  index: number;
  amounts: { [key: number]: number | string; };
  multipliers: { [key: number]: Conviction; };
  preferredDirection: { [key: number]: PreferredDirection; };
  handlePreferredDirectionChange: (index: number, value: PreferredDirection) => void;
  handleAmountChange: (index: number, value: string) => void;
  handleMultiplierChange: (index: number, value: Conviction) => void;
}

export interface ReferendumData {
  account: {
    address: string;
  };
  approval_rate: string;
  approval_threshold: string;
  call_module: string;
  call_name: string;
  created_block: number;
  created_block_timestamp: number;
  latest_block_num: number;
  latest_block_timestamp: number;
  origins: string;
  origins_id: number;
  referendum_index: number;
  status: string;
  title: string;
}

export interface ReferendumDialogProps {
  index: number;
  referendumNumber: number;
  confirmVote: ReactNode;
}

export interface VoteRequest {
  account: string;
  genesisHash: string;
  pollIndex: number;
  nonce: number;
  aye: boolean;
  balance: number;
  conviction: Conviction;
}

export interface ComponentTestProps {
  isTest?: boolean;
  callbackTest?: () => void;
}

export interface Message {
  id: number;
  type: "default" | "success" | "error" | "info";
  title: string;
  content: string;
}

export interface SnackbarProps {
  message: Message;
  initialOpen?: boolean;
}

export interface DialogStateType {
  openLoginScreen: boolean;
  openNavMenu: boolean;
  openExtensions: boolean;
  openGloveProxy: boolean;
  openVote: boolean;
  openLearnMore: boolean;
  openReferendumDialog: boolean;
  referendum: ReferendumDialogProps | null;
  amounts: { [key: number]: number | string; };
  multipliers: { [key: number]: Conviction; };
  directions: { [key: number]: PreferredDirection; };
}

export interface DialogActionType {
  setOpenLoginScreen: (open: boolean) => void;
  setOpenNavMenu: (openMenu: boolean) => void;
  setOpenExtensions: (openExtensions: boolean) => void;
  setOpenGloveProxy: (openJoinGlove: boolean) => void;
  setOpenVote: (openVote: boolean) => void;
  setOpenLearnMore: (openLearnMore: boolean) => void;
  setOpenReferendumDialog: (openReferendumDialog: boolean) => void;
  setReferendum: (referendum: ReferendumDialogProps | null) => void;
  setVotingOptions: (amounts: { [key: number]: number | string; }, multipliers: { [key: number]: Conviction; }, directions: { [key: number]: PreferredDirection; }) => void;
}

export type DialogContextType = DialogStateType & DialogActionType;

export interface SnackbarMessage {
  id: number;
  type: 'default' | 'success' | 'error' | 'info';
  title: string;
  content: string;
}

export interface SnackbarContextType {
  messages: SnackbarMessage[];
  addMessage: (message: Omit<SnackbarMessage, 'id'>) => void;
  removeMessage: (id: number) => void;
}

export enum Conviction {
  None = "None",
  Locked1x = "Locked1x",
  Locked2x = "Locked2x",
  Locked3x = "Locked3x",
  Locked4x = "Locked4x",
  Locked5x = "Locked5x",
  Locked6x = "Locked6x",
}

export type VoteData = {
  address: string;
  proxy: string;
  pollIndex: number;
  amount: number;
  conviction: Conviction;
  direction: PreferredDirection;
};

export type AccountState = {
  accounts: InjectedAccountWithMeta[];
  extensions: InjectedExtension[];
  selectedAccount: InjectedAccountWithMeta | null;
  selectedExtension: InjectedExtension | null;
  currentProxy: string | null;
  gloveProxy: string | null;
  currentNetwork: string | null;
  voteData: VoteData[] | null;
};

export type AccountContextType = AccountState & {
  setAccounts: (accounts: InjectedAccountWithMeta[]) => void;
  setExtensions: (extensions: InjectedExtension[]) => void;
  setSelectedAccount: (account: InjectedAccountWithMeta | null) => void;
  setSelectedExtension: (extension: InjectedExtension | null) => void;
  setCurrentProxy: (proxy: string | null) => void;
  setCurrentNetwork: (network: string | null) => void;
  setVoteData: (voteData: VoteData[] | null) => void;
};

export enum WalletNameEnum {
  SUBWALLET = "subwallet-js",
  TALISMAN = "talisman",
  NOVAWALLET = "nova wallet",
  PJS = "polkadot-js",
}
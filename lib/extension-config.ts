import { ExtensionConfig, WalletNameEnum } from "./types";

export const extensionConfig: Partial<ExtensionConfig> = {
  disallowed: [],
  supported: [
    {
      id: WalletNameEnum.PJS,
      title: 'PolkadotJS',
      description: 'Basic account injection and signer',
      urls: {
        main: '',
        browsers: {
          chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
          firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
        },
      },
      iconUrl: 'pjs-icon.svg',
    },
    {
      id: WalletNameEnum.TALISMAN,
      title: 'Talisman',
      description: 'Talisman is a Polkadot wallet that unlocks a new world of multichain web3 applications in the Paraverse',
      urls: {
        main: '',
        browsers: {
          chrome: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
          firefox: 'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
        },
      },
      iconUrl: 'talisman-icon.svg',
    },
    {
      id: WalletNameEnum.NOVAWALLET,
      title: 'Nova Wallet',
      description: 'Nova Wallet',
      iconUrl: 'nova-icon.svg',
      urls: {
        main: '',
        browsers: {
          chrome: '',
          firefox: '',
        },
      },
    },
    {
      id: WalletNameEnum.SUBWALLET,
      title: 'Subwallet',
      description: 'Subwallet',
      iconUrl: 'subwallet-icon.svg',
      urls: {
        main: '',
        browsers: {
          chrome: '',
          firefox: '',
        },
      },
    },
  ],
};
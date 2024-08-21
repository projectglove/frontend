export const APP_NAME = 'Glove';

export const GLOVE_URL = "https://enclave.test.projectglove.io";
export const TEST_SUBSCAN_NETWORK = "rococo";
export const PROD_SUBSCAN_NETWORK = "kusama";
export const TEST_WSS = `wss://${ TEST_SUBSCAN_NETWORK }-rpc.polkadot.io`; // Rococo
export const PROD_WSS = `wss://${ PROD_SUBSCAN_NETWORK }-rpc.polkadot.io`; // Kusama
export const TEST_SS58_FORMAT = 42; // Rococo
export const PROD_SS58_FORMAT = 2; // Kusama
export const TEST_DECIMALS = 12; // Rococo
export const PROD_DECIMALS = 12; // Kusama

export const WALLET_BUTTON_STYLE = "rounded-md text-base font-medium bg-primary/90 text-primary-foreground hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-primary/80 transition-colors";
import { createContext, useContext, useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { PROD_WSS, TEST_WSS } from '../consts';

const ApiContext = createContext<ApiPromise | null>(null);

const ApiProvider = ({ children }: { children: React.ReactNode; }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider(TEST_WSS);
      const types = {
        VoteRequest: {
          "account": "AccountId32",
          "genesis_hash": "H256",
          "poll_index": "Compact<u32>",
          "nonce": "u32",
          "aye": "bool",
          "balance": "u128",
          "conviction": "Conviction"
        },
        RemoveVoteRequest: {
          "account": "AccountId32",
          "poll_index": "Compact<u32>"
        },
        Conviction: {
          "_enum": {
            "None": null,
            "Locked1x": null,
            "Locked2x": null,
            "Locked3x": null,
            "Locked4x": null,
            "Locked5x": null,
            "Locked6x": null
          }
        }
      };
      try {
        const api = await ApiPromise.create({ provider, noInitWarn: true, types });
        setApi(api);
      } catch (error) {
        console.error(error);
      }
    };

    setupApi();

    return () => {
      api?.disconnect();
    };
  }, []);

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => useContext(ApiContext);

export { ApiProvider, useApi };

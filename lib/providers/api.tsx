import { createContext, useContext, useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { PROD_WSS, TEST_WSS } from '../consts';

const ApiContext = createContext<ApiPromise | null>(null);

const ApiProvider = ({ children }: { children: React.ReactNode; }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider(TEST_WSS);
      try {
        const api = await ApiPromise.create({ provider, noInitWarn: true });
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

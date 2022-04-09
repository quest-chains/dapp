import { useCallback, useEffect, useState } from 'react';
import { getEthersProvider } from 'web3/providers';

export const useENS = (
  address: string | null | undefined,
): {
  ens: string | null | undefined;
  fetching: boolean;
} => {
  const [ens, setENS] = useState<string | null | undefined>();
  const [fetching, setFetching] = useState(false);

  const populateENS = useCallback(async () => {
    try {
      setFetching(true);
      const ethProvider = getEthersProvider('0x1');
      if (address && ethProvider) {
        const ens = await ethProvider.lookupAddress(address);
        setENS(ens);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error populating ENS', error);
    } finally {
      setFetching(false);
    }
  }, [address]);

  useEffect(() => {
    populateENS();
  }, [populateENS]);

  return {
    ens: ens,
    fetching,
  };
};

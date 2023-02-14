import { constants, utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { getEthersProvider } from '@/web3/providers';

export const fetchENSFromAddress = async (
  address: string | null | undefined,
): Promise<string | null> => {
  if (!address || !utils.isAddress(address)) return null;
  const ethProvider = getEthersProvider('0x1');
  if (!ethProvider) return null;

  const ens = await ethProvider.lookupAddress(address);
  return ens;
};

export const useENS = (
  address: string | null | undefined,
): {
  ens: string | null | undefined;
  fetching: boolean;
} => {
  const [ens, setENS] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const populateENS = useCallback(async () => {
    try {
      setFetching(true);
      const name = await fetchENSFromAddress(address);
      setENS(name);
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
    ens,
    fetching,
  };
};

export const fetchAddressFromENS = async (
  name: string | null | undefined,
): Promise<string | null> => {
  if (!name || !name.endsWith('.eth')) return null;
  const ethProvider = getEthersProvider('0x1');
  if (!ethProvider) return null;

  const addr = await ethProvider.resolveName(name);
  return constants.AddressZero === addr ? null : addr;
};

export const useAddressFromENS = (
  ens: string,
): {
  address: string | null;
  fetching: boolean;
} => {
  const [address, setAddress] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const populateAddress = useCallback(async () => {
    try {
      setFetching(true);
      const addr = await fetchAddressFromENS(ens);
      setAddress(addr);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error populating ENS', error);
    } finally {
      setFetching(false);
    }
  }, [ens]);

  useEffect(() => {
    populateAddress();
  }, [populateAddress]);

  return {
    address,
    fetching,
  };
};

export const useENSAvatar = (
  address: string | null | undefined,
): {
  avatar: string | null | undefined;
  fetching: boolean;
} => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const populateAvatar = useCallback(async () => {
    if (!address || !utils.isAddress(address)) {
      setAvatar(null);
      return;
    }
    try {
      setFetching(true);
      const ethProvider = getEthersProvider('0x1');
      if (ethProvider) {
        const ens = await ethProvider.lookupAddress(address);
        const resolver = ens ? await ethProvider.getResolver(ens) : null;
        const avatar = resolver ? await resolver.getAvatar() : null;

        setAvatar(avatar?.url ?? null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error populating Avatar', error);
    } finally {
      setFetching(false);
    }
  }, [address]);

  useEffect(() => {
    populateAvatar();
  }, [populateAvatar]);

  return {
    avatar,
    fetching,
  };
};

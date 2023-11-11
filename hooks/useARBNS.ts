import { isAddress } from '@ethersproject/address';
import { createWeb3Name } from '@web3-name-sdk/core';
import { useCallback, useEffect, useState } from 'react';

export const fetchARBNSFromAddress = async (
  address: string | null | undefined,
): Promise<string | null> => {
  if (!address || !isAddress(address)) return null;
  const web3Name = createWeb3Name();
  if (!web3Name) return null;
  const name = await web3Name.getDomainName({
    address,
    queryChainIdList: [42161],
  });

  return name;
};

export const fetchAddressFromARBNS = async (
  name: string | null | undefined,
): Promise<string | null> => {
  if (!name) return null;
  const web3Name = createWeb3Name();
  if (!web3Name) return null;
  const address = await web3Name.getAddress(name);

  return address;
};

export const fetchAvatarFromAddressOrARBNS = async (
  name: string | null | undefined,
): Promise<string | null> => {
  if (!name) return null;
  const web3Name = createWeb3Name();
  if (!web3Name) return null;
  let avatar: string | null;

  // if name is an address, convert to name
  if (name?.includes('0x')) name = await fetchARBNSFromAddress(name);
  // check again if the address was indeed resolved
  if (!name) return null;

  const record = await web3Name.getDomainRecord({
    name,
    key: 'avatar',
  });
  if (record) {
    avatar = record;
  } else {
    // if the user did not set an avatar, get default from the metadata image
    const metadata = await web3Name.getMetadata({ name });
    avatar = metadata?.image;
  }
  return avatar;
};

export const useARBNS = (
  address: string | null | undefined,
): {
  arbns: string | null | undefined;
  fetching: boolean;
} => {
  const [arbns, setARBNS] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const populateARBNS = useCallback(async () => {
    try {
      setFetching(true);
      const name = await fetchARBNSFromAddress(address);
      setARBNS(name);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error populating ARBNS', error);
    } finally {
      setFetching(false);
    }
  }, [address]);

  useEffect(() => {
    populateARBNS();
  }, [populateARBNS]);

  return {
    arbns,
    fetching,
  };
};

export const useARBNSAvatar = (
  name: string | null | undefined,
): {
  avatar: string | null | undefined;
  fetching: boolean;
} => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const populateAvatar = useCallback(async () => {
    try {
      setFetching(true);
      const avatarUri = await fetchAvatarFromAddressOrARBNS(name);
      setAvatar(avatarUri);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error populating Avatar', error);
    } finally {
      setFetching(false);
    }
  }, [name]);

  useEffect(() => {
    populateAvatar();
  }, [populateAvatar]);

  return {
    avatar,
    fetching,
  };
};

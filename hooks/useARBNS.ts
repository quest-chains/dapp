import { isAddress } from '@ethersproject/address';
import SID, { getSidAddress } from '@siddomains/sidjs';
import { createWeb3Name } from '@web3-name-sdk/core';
import { useCallback, useEffect, useState } from 'react';

import { getEthersProvider } from '@/web3/providers';

let sid: any;
let web3Name: any;
const provider = getEthersProvider('0xa4b1');
const chainId = 42161; //Arbitrum One chain id

const buildSID = async () => {
  const sidAddress = getSidAddress(chainId);
  sid = new SID({
    provider,
    sidAddress,
  });
};

const buildWeb3Name = () => {
  web3Name = createWeb3Name();
};

export const fetchARBNSFromAddress = async (
  address: string | null | undefined,
): Promise<string | null> => {
  if (!address || !isAddress(address)) return null;
  if (!sid) await buildSID();
  const { name: arbitrum1_name } = await sid.getName(address);

  return arbitrum1_name;
};

export const fetchAddressFromARBNS = async (
  name: string | null | undefined,
): Promise<string | null> => {
  if (!name) return null;
  if (!sid) await buildSID();
  const arbitrum1_address = await sid.name(name).getAddress('ARB1');

  return arbitrum1_address;
};

export const fetchAvatarFromAddressOrARBNS = async (
  name: string | null | undefined,
): Promise<string | null> => {
  if (!name) return null;
  if (!sid) await buildSID();
  if (!web3Name) buildWeb3Name();
  let avatar: string | null;
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

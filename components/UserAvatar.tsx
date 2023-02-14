import { Box } from '@chakra-ui/react';

import { useENSAvatar } from '@/hooks/useENS';
import { MongoUser } from '@/lib/mongodb/types';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { useWallet } from '@/web3';

import { Jazzicon } from './Jazzicon';

const ENSAvatar: React.FC<{
  address: string;
  size: number;
}> = ({ address, size }) => {
  const { ensAvatar: walletAvatar, address: walletAddress } = useWallet();

  const isWalletUser = walletAddress === address.toLowerCase();

  const { avatar } = useENSAvatar(isWalletUser ? '' : address);

  const avatarUri = isWalletUser ? walletAvatar : avatar;

  if (avatarUri)
    return (
      <Box
        width={size + 'px'}
        height={size + 'px'}
        borderRadius="50%"
        bgImage={`url(${ipfsUriToHttp(avatarUri)})`}
        bgPos="center"
        bgSize="cover"
      />
    );

  // fallback to jazzicon
  return <Jazzicon address={address} size={size} />;
};

export const UserAvatar: React.FC<{
  address: string | null | undefined;
  profile: MongoUser | null | undefined;
  size: number;
}> = ({ address, profile, size }) => {
  const avatarUri = profile?.avatarUri;

  if (avatarUri)
    return (
      <Box
        width={size + 'px'}
        height={size + 'px'}
        borderRadius="50%"
        bgImage={`url(${ipfsUriToHttp(avatarUri)})`}
        bgPos="center"
        bgSize="cover"
      />
    );

  if (address) {
    return <ENSAvatar address={address} size={size} />;
  }

  return null;
};

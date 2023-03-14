import { Box } from '@chakra-ui/react';

import { useENSAvatar } from '@/hooks/useENS';
import { MongoUser } from '@/lib/mongodb/types';
import { ZERO_ADDRESS } from '@/utils/constants';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { useWallet } from '@/web3';

import { Jazzicon } from './Jazzicon';

export const UserAvatar: React.FC<{
  address: string | null | undefined;
  profile: MongoUser | null | undefined;
  size: number;
}> = ({ address, profile, size }) => {
  const {
    ensAvatar: walletENSAvatar,
    address: walletAddress,
    user: walletProfile,
  } = useWallet();

  const isWalletUser = walletAddress === address?.toLowerCase();

  const { avatar: ensAvatar } = useENSAvatar(isWalletUser ? '' : address);

  const displayProfile = isWalletUser ? walletProfile ?? profile : profile;

  const avatarUri =
    displayProfile?.avatarUri ?? (isWalletUser ? walletENSAvatar : ensAvatar);

  if (avatarUri)
    return (
      <Box
        width={size + 'px'}
        height={size + 'px'}
        borderRadius="50%"
        bgColor="whiteAlpha.300"
        bgImage={`url(${ipfsUriToHttp(avatarUri)})`}
        bgPos="center"
        bgSize="cover"
      />
    );

  // fallback to jazzicon
  return <Jazzicon address={address ?? ZERO_ADDRESS} size={size} />;
};

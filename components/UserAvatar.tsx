import { Box } from '@chakra-ui/react';
import Davatar from '@davatar/react';

import { MongoUser } from '@/lib/mongodb/types';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { getEthersProvider } from '@/web3/providers';

export const UserAvatar: React.FC<{
  address: string | null | undefined;
  profile: MongoUser | null;
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

  if (address)
    return (
      <Davatar
        address={address}
        size={size}
        generatedAvatarType="jazzicon"
        provider={getEthersProvider('0x1')}
      />
    );

  return null;
};

import { Button, Link, StackProps } from '@chakra-ui/react';

import { MastodonIcon } from './icons/MastodonIcon';

export const MastodonShareButton: React.FC<
  {
    message: string;
  } & StackProps
> = ({ message }) => {
  return (
    <Link
      href={`https://mastodon.social//share?text=${message}`}
      isExternal
      _hover={{}}
    >
      <Button bgColor="#5560F8" p={4} h={7} leftIcon={<MastodonIcon />}>
        Publish
      </Button>
    </Link>
  );
};

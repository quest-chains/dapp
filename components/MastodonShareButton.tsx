import { Button, Image, StackProps } from '@chakra-ui/react';

export const MastodonShareButton: React.FC<
  {
    message: string;
  } & StackProps
> = ({ message }) => {
  return (
    <a
      href={`https://mastodon.social//share?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button bgColor="#5560F8" p={4} h={7}>
        <Image src="/mastodon.svg" alt="twitter" height={4} mr={1} />
        Publish
      </Button>
    </a>
  );
};

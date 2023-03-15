import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';

import PoH from '@/assets/PoH.png';

export const PoHBadge: React.FC<{
  address: string | undefined | null;
  size?: number;
}> = ({ address, size = 4 }) => (
  <Popover trigger="hover">
    <PopoverTrigger>
      <CheckCircleIcon h={size} w={size} />
    </PopoverTrigger>
    <PopoverContent
      cursor="initial"
      p={2}
      w="15rem"
      justifyContent="space-around"
      alignItems="center"
      fontWeight={400}
    >
      <PopoverArrow />
      <Flex alignItems="center" mb={2}>
        <Text mr={2}>Proof of Humanity verified</Text>
        <Image src={PoH.src} w={4} h={4} alt="PoH" />
      </Flex>
      <Text
        cursor="pointer"
        pointerEvents="all"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          window.open(
            `https://app.proofofhumanity.id/profile/${address}`,
            '_blank',
          );
        }}
        color="main"
        fontSize="sm"
        borderBottom="1px solid"
        borderBottomColor="main"
        _hover={{ borderBottomColor: 'white' }}
      >
        Learn more
      </Text>
    </PopoverContent>
  </Popover>
);

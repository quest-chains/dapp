import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';

import { CHAIN_URL_MAPPINGS } from '@/web3';

import { Tile } from './Tile';

export const Featured: React.FC = () => {
  return (
    <Flex w="full" direction="column">
      <Flex justifyContent="space-between">
        <Text>Featured</Text>
        <Flex>
          <IconButton
            aria-label="Left"
            icon={<ChevronLeftIcon h={10} w={10} />}
          />
          <IconButton
            aria-label="Right"
            icon={<ChevronRightIcon h={10} w={10} />}
          />
        </Flex>
      </Flex>
      <Flex justify="space-between" w="full" alignItems="stretch">
        <Tile chainId={CHAIN_URL_MAPPINGS.polygon} slug="roving-with-rionna" />
        <Tile chainId={CHAIN_URL_MAPPINGS.polygon} slug="pagedao-onboarding" />
        <Tile chainId={CHAIN_URL_MAPPINGS.polygon} slug="how-to-champion" />
      </Flex>
    </Flex>
  );
};

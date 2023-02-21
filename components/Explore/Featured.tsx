import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';

import { QuestChainTile } from '../QuestChainTile';
import Carousel from './Carousel';

const featuredQuestChains = [
  {
    address: '0x0fe8c3464aa12eb43ec3f0322e4631479f16ddd6',
    chainId: '0x89',
    createdBy: {
      id: '0x1cd031ced1d63ac57592ca291f9c5c4772fe7549',
    },
    name: 'Roving with Rionna: The Craft of Writing - Symbolism  ',
    description:
      'Hello and Welcome to the Roving with Rionna: The Craft of Writing Quest!   ',
    imageUrl:
      'ipfs://bafkreigdqj452cggpnwvprbdbsrs5dqbmz56wokmj6nxg44s7w5lppxzim',
    slug: 'roving-with-rionna-the-craft-of-writing-symbolism',
  },
];

export const Featured: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const handlePrev = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  };
  const maxChildrenPerSlide = isSmallScreen ? 1 : 3;
  const numberOfSlides = 6 / maxChildrenPerSlide;

  const arrayOfSix = [1, 2, 3, 4, 5, 6];

  return (
    <Flex w="full" direction="column">
      <Flex justifyContent="space-between">
        <Heading fontSize={28} fontWeight="normal">
          Featured quest chains
        </Heading>
        <Flex>
          <IconButton
            aria-label="Left"
            icon={<ChevronLeftIcon h={6} w={6} />}
            onClick={handlePrev}
            isDisabled={currentSlide === 0}
            mr={2}
          />
          <IconButton
            aria-label="Right"
            icon={<ChevronRightIcon h={6} w={6} />}
            onClick={handleNext}
            isDisabled={currentSlide === numberOfSlides - 1}
          />
        </Flex>
      </Flex>
      {/* <Flex justify="space-between" w="full" alignItems="stretch" gap={6}> */}
      <Carousel gap={50} currentSlide={currentSlide}>
        {arrayOfSix.map(_item => (
          <QuestChainTile
            key={_item}
            quests={1}
            chainId={featuredQuestChains[0].chainId}
            address={featuredQuestChains[0].address}
            name={featuredQuestChains[0].name}
            description={featuredQuestChains[0].description}
            imageUrl={featuredQuestChains[0].imageUrl}
            createdBy={featuredQuestChains[0].createdBy.id}
            slug={featuredQuestChains[0].slug}
          />
        ))}
      </Carousel>
      {/* </Flex> */}
    </Flex>
  );
};

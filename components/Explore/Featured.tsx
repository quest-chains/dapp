import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useFeaturedQuestChains } from '@/hooks/useFeaturedQuestChains';

import { LoadingState } from '../LoadingState';
import { QuestChainTile } from '../QuestChainTile';
import Carousel from './Carousel';

export const Featured: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => setCurrentSlide(currentSlide - 1);
  const handleNext = () => setCurrentSlide(currentSlide + 1);

  const maxChildrenPerSlide =
    useBreakpointValue({
      base: 1,
      md: 2,
      xl: 3,
    }) ?? 3;

  const { results, fetching } = useFeaturedQuestChains();

  let numberOfSlides = Math.ceil((results.length * 1.0) / maxChildrenPerSlide);

  numberOfSlides = numberOfSlides > 0 ? numberOfSlides : 1;

  useEffect(() => setCurrentSlide(0), [maxChildrenPerSlide]);

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
      {fetching ? (
        <Flex w="100%" justify="center" align="center" h="17rem">
          <LoadingState />
        </Flex>
      ) : (
        <Carousel
          currentSlide={currentSlide}
          maxChildrenPerSlide={maxChildrenPerSlide}
        >
          {results.map(item => (
            <QuestChainTile
              key={item.address}
              quests={item.numQuests}
              chainId={item.chainId}
              address={item.address}
              name={item.name}
              description={item.description}
              imageUrl={item.imageUrl}
              createdBy={item.createdBy.id}
              slug={item.slug}
              featured
            />
          ))}
        </Carousel>
      )}
    </Flex>
  );
};

import 'react-multi-carousel/lib/styles.css';

import { Box, Flex, Heading } from '@chakra-ui/react';
import Carousel from 'react-multi-carousel';

import { useQuestChainSearchForAllChains } from '@/hooks/useQuestChainSearchForAllChains';

import { CustomButtonGroupAsArrows } from '../CustomArrows';
import { QuestChainTile } from '../QuestChainTile';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export const Featured: React.FC = () => {
  // TODO add a loading state.
  // TODO change this to fetch only featured quests
  const { fetching, results, error } = useQuestChainSearchForAllChains('');

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error while searching for quest chains:', error);
  }

  return (
    <Flex w="full" direction="column" gap={4} position={'relative'}>
      <Flex justifyContent="space-between">
        <Heading fontSize={28} fontWeight="normal">
          Featured quest chains
        </Heading>
      </Flex>
      {!fetching && !error && results.length > 0 && (
        <Carousel
          arrows={false}
          draggable={false}
          responsive={responsive}
          renderButtonGroupOutside={true}
          // @ts-ignore
          customButtonGroup={<CustomButtonGroupAsArrows />}
          ssr={true} // means to render carousel on server-side.
          // infinite={true}
          // autoPlay={true}
          // autoPlaySpeed={3000}
          itemClass="carousel-item-padding-40-px"
        >
          {results.map(
            ({
              address,
              name,
              description,
              slug,
              chainId,
              quests,
              imageUrl,
            }) => (
              <Box mr={5} key={address}>
                <QuestChainTile
                  {...{
                    address,
                    name,
                    description,
                    slug,
                    chainId,
                    quests: quests.filter(q => !q.paused).length,
                    imageUrl,
                  }}
                />
              </Box>
            ),
          )}
        </Carousel>
      )}
    </Flex>
  );
};

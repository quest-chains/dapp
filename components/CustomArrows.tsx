import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';

export const CustomButtonGroupAsArrows = ({
  // @ts-ignore
  next,
  // @ts-ignore
  previous,
  // @ts-ignore
  carouselState,
}) => {
  const { totalItems, currentSlide } = carouselState;

  return (
    <Box top={'0'} right={'0'} position={'absolute'}>
      <Flex gap={2}>
        <IconButton
          aria-label="Left"
          icon={<ChevronLeftIcon h={5} w={5} />}
          onClick={previous}
          disabled={currentSlide === 0}
          opacity={currentSlide === 0 ? 0.5 : 1}
        />
        <IconButton
          aria-label="Right"
          icon={<ChevronRightIcon h={5} w={5} />}
          onClick={next}
          disabled={currentSlide === totalItems}
          //   TODO need to be fixed
          opacity={currentSlide === totalItems ? 0.5 : 1}
        />
      </Flex>
    </Box>
  );
};

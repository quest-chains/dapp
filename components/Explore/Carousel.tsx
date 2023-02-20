import { Box, Flex, Grid, useBreakpointValue } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode[];
  gap?: number;
  currentSlide: number;
}

const Carousel: React.FC<Props> = ({ children, currentSlide }) => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const maxChildrenPerSlide = isSmallScreen ? 1 : 3;
  const numberOfSlides = children.length / maxChildrenPerSlide;

  const slidesSmall = children;
  const slidesBig = [
    children.slice(0, maxChildrenPerSlide),
    children.slice(maxChildrenPerSlide, maxChildrenPerSlide * 2),
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Grid
        w="full"
        gridTemplateColumns={`repeat(${numberOfSlides}, 100%)`}
        ml={`calc(${-currentSlide * 100}% - ${currentSlide * 1.5 * 16}px)`}
        transition="margin-left 0.5s ease-in-out"
        py={6}
        gap={6}
      >
        {isSmallScreen
          ? slidesSmall.map((child, index) => (
              <Flex w="100%" key={index}>
                {child}
              </Flex>
            ))
          : slidesBig.map((slide, index) => (
              <Flex gap={6} w="100%" key={index}>
                {slide.map((child, index) => (
                  <Box key={index}>{child}</Box>
                ))}
              </Flex>
            ))}
      </Grid>
    </div>
  );
};

export default Carousel;

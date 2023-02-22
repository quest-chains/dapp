import { Box, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import { useMemo } from 'react';

interface Props {
  children: React.ReactNode[];
  currentSlide: number;
  maxChildrenPerSlide: number;
}

const Carousel: React.FC<Props> = ({
  children,
  currentSlide,
  maxChildrenPerSlide,
}) => {
  const numberOfSlides = children.length / maxChildrenPerSlide;

  const slides = useMemo(() => {
    const s = [];
    const copy = children.slice();
    while (copy.length > 0) {
      s.push(copy.splice(0, maxChildrenPerSlide));
    }
    return s;
  }, [children, maxChildrenPerSlide]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Grid
        w="full"
        gridTemplateColumns={`repeat(${numberOfSlides}, 100%)`}
        gridAutoFlow="column"
        ml={`calc(${-currentSlide * 100}% - ${currentSlide * 1.25 * 16}px)`}
        transition="margin-left 0.5s ease-in-out"
        py={6}
        gap={5}
      >
        {slides.map((slide, index) => (
          <GridItem key={index}>
            <SimpleGrid columns={maxChildrenPerSlide} gap={5} w="100%">
              {slide.map((child, index) => (
                <Box key={index}>{child}</Box>
              ))}
            </SimpleGrid>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default Carousel;

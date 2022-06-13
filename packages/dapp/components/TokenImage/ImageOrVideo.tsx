import {
  BoxProps,
  Flex,
  Image as ChakraImage,
  Spinner,
} from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import React, { useEffect, useState } from 'react';

const FallbackImage = (props: BoxProps) => (
  <ChakraImage src={NoImageAvailable} p="1.5rem" {...props} />
);
const LoadingImage = (props: BoxProps) => (
  <Flex p="1.5rem" justify="center" align="center" {...props}>
    <Spinner color="main" size="xl" speed="0.75s" thickness="3px" />
  </Flex>
);

export const ImageOrVideo: React.FC<
  {
    src: string;
    onLoadError: () => void;
    onLoadSuccess?: () => void;
  } & BoxProps
> = ({ src, onLoadError, onLoadSuccess = () => undefined, ...props }) => {
  const [isImageErrored, setImageErrored] = useState(false);
  const [isVideoErrored, setVideoErrored] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isVideoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isImageErrored && isVideoErrored) {
      onLoadError();
    }
  }, [isImageErrored, isVideoErrored, onLoadError]);

  useEffect(() => {
    if (isImageLoaded || isVideoLoaded) {
      onLoadSuccess();
      setLoading(false);
    }
  }, [isImageLoaded, isVideoLoaded, onLoadSuccess]);

  let render = (): null | JSX.Element => null;
  if (!isImageErrored) {
    render = () => (
      <ChakraImage
        src={src}
        onError={() => setImageErrored(true)}
        onLoad={() => setImageLoaded(true)}
        objectFit="contain"
        objectPosition="center"
        opacity={isLoading ? 0 : 1}
        pointerEvents="none"
        width="100%"
        height="100%"
      />
    );
  } else if (!isVideoErrored) {
    render = () => (
      <video
        src={src}
        controls={false}
        autoPlay
        loop
        muted
        onError={() => setVideoErrored(true)}
        onCanPlay={() => setVideoLoaded(true)}
        style={{
          opacity: isLoading ? '0' : '1',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
        }}
      />
    );
  } else {
    render = () => <FallbackImage opacity={isLoading ? 0 : 1} {...props} />;
  }
  return (
    <Flex justify="center" align="center" overflow="hidden" {...props}>
      <LoadingImage {...props} display={isLoading ? undefined : 'none'} />
      {render()}
    </Flex>
  );
};

import { BoxProps, Image as ChakraImage } from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import React, { useCallback, useMemo, useState } from 'react';
import { uriToHttpAsArray } from 'utils/uriHelpers';

import { ImageOrVideo } from './ImageOrVideo';

const FallbackImage = (props: BoxProps) => (
  <ChakraImage
    src={NoImageAvailable}
    p="1.5rem"
    objectFit="contain"
    objectPosition="center"
    {...props}
  />
);

const BAD_SRCS: { [uri: string]: boolean } = {};

export const TokenImageOrVideo: React.FC<{ uri: string } & BoxProps> = ({
  uri,
  ...props
}) => {
  const [, refresh] = useState(0);
  const srcs = useMemo(() => uriToHttpAsArray(uri), [uri]);

  const src = srcs.find(s => !BAD_SRCS[s]);

  const onError = useCallback((badSrc: string) => {
    if (badSrc && !BAD_SRCS[badSrc]) {
      BAD_SRCS[badSrc] = true;
      refresh(i => i + 1);
    }
  }, []);

  if (src) {
    return (
      <ImageOrVideo src={src} onLoadError={() => onError(src)} {...props} />
    );
  }

  return <FallbackImage {...props} />;
};

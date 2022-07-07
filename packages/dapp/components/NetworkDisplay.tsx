import {
  Image,
  ImageProps,
  Stack,
  StackProps,
  Tag,
  Text,
  TextProps,
} from '@chakra-ui/react';

import { AVAILABLE_NETWORK_INFO } from '@/web3';

export const NetworkDisplay: React.FC<
  {
    chainId: string;
    asTag?: boolean;
    imageProps?: ImageProps;
    textProps?: TextProps;
  } & StackProps
> = ({ chainId, imageProps, asTag = false, textProps, ...props }) => {
  const networkInfo = AVAILABLE_NETWORK_INFO[chainId];
  if (!networkInfo) return null;
  const { image, label } = networkInfo;
  const inner = (
    <Stack
      direction="row"
      align="center"
      letterSpacing={0}
      {...props}
      color="white"
    >
      <Image src={image} alt={label} boxSize="1.5rem" {...imageProps} />
      <Text as="span" {...textProps}>
        {label}
      </Text>
    </Stack>
  );

  return asTag ? (
    <Tag borderRadius="full" p={1} pl={2} maxHeight="2rem">
      {inner}
    </Tag>
  ) : (
    inner
  );
};

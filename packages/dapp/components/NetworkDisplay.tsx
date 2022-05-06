import {
  Image,
  ImageProps,
  Stack,
  StackProps,
  Tag,
  Text,
  TextProps,
} from '@chakra-ui/react';

import { NETWORK_INFO } from '@/web3';

export const NetworkDisplay: React.FC<
  {
    chainId: string;
    asTag?: boolean;
    imageProps?: ImageProps;
    textProps?: TextProps;
  } & StackProps
> = ({ chainId, imageProps, asTag = false, textProps, ...props }) => {
  const networkInfo = NETWORK_INFO[chainId];
  if (!networkInfo) return null;
  const { image, label, name } = networkInfo;
  const inner = (
    <Stack
      direction={asTag ? 'row-reverse' : 'row'}
      align="center"
      letterSpacing={0}
      {...props}
    >
      <Image
        src={image}
        alt={label}
        boxSize={asTag ? '1.5rem' : '2rem'}
        {...imageProps}
      />
      <Text as="span" fontWeight="bold" {...textProps}>
        {asTag ? label : name}
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

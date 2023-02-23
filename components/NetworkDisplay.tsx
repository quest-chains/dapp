import {
  Image,
  ImageProps,
  Stack,
  StackProps,
  Tag,
  TagLabel,
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
  const TextComponent = asTag ? TagLabel : Text;
  const inner = (
    <Stack
      direction="row"
      align="center"
      letterSpacing={0}
      color="white"
      {...props}
    >
      <Image src={image} alt={label} boxSize="1.5rem" {...imageProps} />
      <TextComponent as="span" {...textProps}>
        {label}
      </TextComponent>
    </Stack>
  );

  return asTag ? (
    <Tag borderRadius="full" py={1} px={2} maxHeight="2rem">
      {inner}
    </Tag>
  ) : (
    inner
  );
};

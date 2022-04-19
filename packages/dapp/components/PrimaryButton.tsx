import { Button, ButtonProps } from '@chakra-ui/react';

export const PrimaryButton: React.FC<ButtonProps> = props => (
  <Button
    px={20}
    background="whiteAlpha.50"
    fontWeight="400"
    borderRadius="full"
    backdropFilter="blur(40px)"
    boxShadow="inset 0px 0px 0px 1px #AD90FF"
    color="main"
    letterSpacing={4}
    fontSize={30}
    height={16}
    _hover={{
      background: 'whiteAlpha.200',
    }}
    {...props}
  />
);

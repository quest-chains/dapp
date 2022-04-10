import { Button, ButtonProps } from '@chakra-ui/react';

export const PrimaryButton: React.FC<ButtonProps> = props => (
  <Button
    px={20}
    background="rgba(255, 255, 255, 0.05)"
    fontWeight="400"
    backdropFilter="blur(40px)"
    borderRadius="full"
    boxShadow="inset 0px 0px 0px 1px #AD90FF"
    color="main"
    letterSpacing={4}
    fontSize={30}
    height={16}
    {...props}
  />
);

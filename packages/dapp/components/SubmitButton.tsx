import { Button, ButtonProps } from '@chakra-ui/react';

export const SubmitButton: React.FC<ButtonProps> = props => (
  <Button
    px={{ base: 6, md: 10 }}
    background="rgba(255, 255, 255, 0.05)"
    fontWeight="400"
    backdropFilter="blur(40px)"
    borderRadius="full"
    boxShadow="inset 0px 0px 0px 1px #AD90FF"
    color="main"
    fontSize={{ base: 16, md: 20 }}
    height={{ base: 10, md: 12 }}
    _hover={{
      background: 'whiteAlpha.200',
    }}
    {...props}
  />
);

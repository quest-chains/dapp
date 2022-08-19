import { Button, ButtonProps } from '@chakra-ui/react';

export const SubmitButton: React.FC<ButtonProps> = props => (
  <Button
    px={{ base: 6, md: 10 }}
    borderRadius="full"
    fontSize={16}
    height={{ base: 10, md: 12 }}
    _hover={{
      bg: 'main.950',
    }}
    bg="main"
    color="black"
    {...props}
  />
);

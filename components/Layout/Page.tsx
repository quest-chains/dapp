import { StackProps, VStack } from '@chakra-ui/react';

export const Page: React.FC<StackProps> = ({ children, ...props }) => (
  <VStack
    w="100%"
    px={{ base: 0, md: 4, lg: 12, xl: 40 }}
    spacing={8}
    align="stretch"
    {...props}
  >
    {children}
  </VStack>
);

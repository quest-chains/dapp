import { Flex, Image, Text, useBoolean } from '@chakra-ui/react';

import play from '@/assets/play.svg';

export const CollapsableText: React.FC<{
  title: string | null | undefined;
  children: unknown;
}> = ({ title, children }) => {
  const [isOpen, { toggle }] = useBoolean(false);
  return (
    <Flex flexDir="column" w="full">
      <Flex
        onClick={toggle}
        cursor="pointer"
        w={isOpen ? 'full' : 'initial'}
        justifyContent="space-between"
      >
        <Text fontWeight={700}>{title}</Text>
        {isOpen && <Image src={play.src} alt="play" />}
      </Flex>
      <>{isOpen && children}</>
    </Flex>
  );
};

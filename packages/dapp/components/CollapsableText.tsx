import { CloseIcon } from '@chakra-ui/icons';
import { Flex, Image, Text, useBoolean } from '@chakra-ui/react';

import play from '@/assets/play.svg';

export const CollapsableText: React.FC<{
  title: string | null | undefined;
  children: unknown;
  mode: string;
}> = ({ title, children, mode }) => {
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
        {!isOpen && mode !== 'MEMBER' && (
          <Image src={play.src} alt="play" h={6} />
        )}
        {isOpen && mode !== 'MEMBER' && <CloseIcon h={8} />}
      </Flex>
      <>{isOpen && children}</>
    </Flex>
  );
};

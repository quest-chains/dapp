import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, Text, useBoolean } from '@chakra-ui/react';

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
        {isOpen && <ChevronUpIcon height={6} width={6} />}
        {!isOpen && <ChevronDownIcon height={6} width={6} />}
      </Flex>
      <>{isOpen && children}</>
    </Flex>
  );
};

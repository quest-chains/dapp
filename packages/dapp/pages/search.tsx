/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';

import { daos } from '@/utils/mockData';

interface DAOsData {
  name: string;
  questChainName: string;
}

const Search: React.FC = () => {
  const [value, setValue] = useState('');
  const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
    setValue(event.target.value);

  const [results, setResults] = useState<DAOsData[]>([]);

  useEffect(() => {
    console.log('new value of input: ', value);

    const filteredDAOs = daos.filter(
      DAO =>
        DAO.name.toLowerCase().includes(value.toLowerCase()) ||
        DAO.questChainName.toLowerCase().includes(value.toLowerCase()),
    );

    setResults(filteredDAOs);
  }, [value]);

  return (
    <VStack px={40} alignItems="flex-start" gap={4}>
      <Text color="main" fontSize={20}>
        Search for Quest Chain
      </Text>
      <InputGroup maxW="2xl">
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={<SearchIcon color="main" />}
        />
        <Input
          placeholder="search for Quest Chain or DAO"
          value={value}
          onChange={handleChange}
          mb={6}
        />
      </InputGroup>

      <Text color="main" fontSize={20}>
        Results
      </Text>
      <VStack w="full" gap={4}>
        {results.map(({ name, questChainName }) => (
          <NextLink href={`/quest-chain/${name}`} passHref key={name}>
            <ChakraLink display="block" _hover={{}} w="full">
              <HStack
                cursor="pointer"
                justify="space-between"
                w="full"
                px={10}
                py={4}
                background="rgba(255, 255, 255, 0.02)"
                _hover={{
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                fontWeight="400"
                backdropFilter="blur(40px)"
                borderRadius="full"
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
                letterSpacing={4}
              >
                <Box>
                  <Text mb={4}>{name}</Text>
                  <Text>{questChainName}</Text>
                </Box>
                <Text>1/20</Text>
              </HStack>
            </ChakraLink>
          </NextLink>
        ))}
      </VStack>
    </VStack>
  );
};

export default Search;

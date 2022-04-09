/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
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

    const filteredDAOs = daos.filter(DAO =>
      DAO.name.toLowerCase().includes(value.toLowerCase()),
    );

    setResults(filteredDAOs);
  }, [value]);

  return (
    <VStack px={40} alignItems="flex-start" gap={4}>
      <Text color="main" fontSize={20}>
        Search for DAO
      </Text>
      <InputGroup maxW="2xl">
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={<SearchIcon color="main" />}
        />
        <Input
          placeholder="Search for DAO"
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
            key={name}
          >
            <Box>
              <Text mb={4}>{name}</Text>
              <Text>{questChainName}</Text>
            </Box>
            <Text>1/20</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default Search;

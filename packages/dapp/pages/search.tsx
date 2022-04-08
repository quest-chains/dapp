/* eslint-disable no-console */
import { Box, Heading, Input, VStack } from '@chakra-ui/react';
import { SetStateAction, useEffect, useState } from 'react';

const dummyDAOs = [
  {
    name: 'MetaGame',
  },
  {
    name: 'MetaCartel',
  },
  {
    name: 'KlimaDAO',
  },
  {
    name: 'OlympusDAO',
  },
  {
    name: '1Hive',
  },
  {
    name: 'Giveth',
  },
];

interface DAOsData {
  name: string;
}

const Search: React.FC = () => {
  const [value, setValue] = useState('');
  const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
    setValue(event.target.value);

  const [results, setResults] = useState<DAOsData[]>([]);

  useEffect(() => {
    console.log('new value of input: ', value);

    const filteredDAOs = dummyDAOs.filter(DAO => DAO.name.includes(value));

    setResults(filteredDAOs);
  }, [value]);

  return (
    <VStack>
      <Heading>Search for DAO</Heading>
      <Input
        placeholder="Search for DAO"
        value={value}
        onChange={handleChange}
      />
      {results.map(({ name }) => (
        <Box key={name}>{name}</Box>
      ))}
    </VStack>
  );
};

export default Search;

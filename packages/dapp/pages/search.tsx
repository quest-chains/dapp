/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import { Box, Input, VStack } from '@chakra-ui/react';
import { SetStateAction, useEffect, useState } from 'react';

import { daos } from '@/utils/mockData';

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

    const filteredDAOs = daos.filter(DAO =>
      DAO.name.toLowerCase().includes(value.toLowerCase()),
    );

    setResults(filteredDAOs);
  }, [value]);

  return (
    <VStack>
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

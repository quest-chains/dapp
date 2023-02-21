import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { Category, Filter, Network } from './QuestChains';

const FilterDropdown: React.FC<{
  filter: Filter;
  setFilters: (value: Record<Category | Network, boolean>) => void;
  label: string;
}> = ({ filter, setFilters, label }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover
      placement="bottom-start"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          gap={3}
          fontSize={14}
          fontWeight="bold"
          bgColor="whiteAlpha.100"
          borderRadius={24}
          // borderColor="transparent"
        >
          <Text>{label}</Text>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </PopoverTrigger>
      <PopoverContent bgColor="#0F172A" maxW={200}>
        {/* <PopoverArrow /> */}
        <PopoverBody gap={2}>
          <Flex direction="column" gap={3}>
            {Object.keys(filter).map((category, index) => {
              return (
                <Flex justifyContent="space-between" key={index}>
                  <Text fontSize="sm">{category}</Text>
                  <Checkbox
                    isChecked={filter[category as Category | Network]}
                    iconColor="white"
                    bgColor="transparent"
                    onChange={() =>
                      setFilters({
                        ...filter,
                        [category as Category | Network]:
                          !filter[category as Category | Network],
                      })
                    }
                  />
                </Flex>
              );
            })}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;

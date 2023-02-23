import { ChevronDownIcon } from '@chakra-ui/icons';
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

export type FilterOption = { label: string; value: string };

export const FilterDropdown: React.FC<{
  filter: Record<string, boolean>;
  options: FilterOption[];
  setFilters: (value: Record<string, boolean>) => void;
  label: string;
  isMultiple?: boolean;
}> = ({ filter, options, setFilters, label, isMultiple = true }) => {
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
          fontSize="sm"
          fontWeight="bold"
          bgColor="whiteAlpha.100"
          borderRadius="full"
          size="lg"
        >
          <Text>{label}</Text>
          <ChevronDownIcon
            fontSize="md"
            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
            transition="all 0.15s"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bgColor="#0F172A"
        borderRadius={16}
        border="1px solid #475569"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        maxW="200px"
      >
        <PopoverBody py="11px" pl={4} pr={3}>
          <Flex direction="column">
            {options.map(option => {
              const checked = filter[option.value];
              let changes = {};
              if (!isMultiple) {
                const trueKey = Object.keys(filter).find(
                  k => filter[k] === true,
                );
                if (trueKey) {
                  changes = { [trueKey]: false };
                }
              }

              return (
                <Checkbox
                  key={option.value}
                  isChecked={checked}
                  borderRadius={4}
                  {...(isMultiple
                    ? {
                        iconColor: 'white',
                        bgColor: 'transparent',
                      }
                    : {
                        variant: 'circular',
                        fontSize: 'xs',
                      })}
                  onChange={() =>
                    setFilters({
                      ...filter,
                      ...changes,
                      [option.value]: !checked,
                    })
                  }
                  flexDirection="row-reverse"
                  justifyContent="space-between"
                  width="100%"
                  py={2}
                  pr={2}
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  {option.label}
                </Checkbox>
              );
            })}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Flex,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemo } from 'react';

export type FilterOption = { label: string; value: string };

export const FilterDropdown: React.FC<{
  filter: Record<string, boolean>;
  options: FilterOption[];
  setFilters: (value: Record<string, boolean>) => void;
  label: string;
  isMultiple?: boolean;
  placement?: PopoverProps['placement'];
}> = ({
  filter,
  options,
  setFilters,
  label,
  isMultiple = true,
  placement = 'bottom-start',
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [trueValue, trueLabel] = useMemo(() => {
    if (isMultiple) return [null, null];

    const trueValue = Object.keys(filter).find(k => filter[k] === true);

    const trueLabel = options.find(o => o.value === trueValue)?.label;

    return [trueValue ?? null, trueLabel ?? null];
  }, [isMultiple, filter, options]);

  const numSelected = useMemo(
    () =>
      Object.values(filter).reduce((t: number, v: boolean) => {
        if (v) t = t + 1;
        return t;
      }, 0),
    [filter],
  );
  return (
    <HStack spacing={4} justify="flex-end">
      {!isMultiple && trueLabel && <Text fontSize="sm">{label}</Text>}
      <Popover
        placement={placement}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            gap={3}
            fontWeight="bold"
            bgColor="whiteAlpha.100"
            borderRadius="full"
            size={{ base: 'md', md: 'lg' }}
          >
            <Text fontSize="sm">{isMultiple ? label : trueLabel ?? label}</Text>
            {isMultiple && numSelected !== 0 && (
              <Flex
                justify="center"
                align="center"
                px="6px"
                py="2px"
                fontSize="xs"
                bgColor="#0F2E27"
                borderRadius="full"
                borderColor="green.900"
                borderWidth={1}
              >
                {numSelected}
              </Flex>
            )}
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
          maxW="220px"
        >
          <PopoverBody py="11px" pl={4} pr={3}>
            <Flex direction="column">
              {options.map(option => {
                const checked = filter[option.value];
                let changes = {};
                if (!isMultiple) {
                  if (trueValue && trueValue !== option.value) {
                    changes = { [trueValue]: false, [option.value]: !checked };
                  }
                } else {
                  changes = {
                    [option.value]: !checked,
                  };
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
                    onChange={() => {
                      if (Object.keys(changes).length > 0) {
                        setFilters({
                          ...filter,
                          ...changes,
                        });
                      }
                    }}
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
    </HStack>
  );
};

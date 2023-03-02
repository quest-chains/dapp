import { Button, Flex, Text, Tooltip } from '@chakra-ui/react';

export const NFTDetail: React.FC<{
  label: string;
  value: string;
  tooltip?: string;
  onCopy: () => void;
}> = ({ label, value, tooltip, onCopy }) => (
  <>
    <Text fontWeight="bold" textAlign="right" fontSize="lg">
      {label}
    </Text>
    <Flex
      align="center"
      justify="space-between"
      bg="blackAlpha.400"
      p={2}
      borderRadius={6}
    >
      {tooltip ? (
        <Tooltip label={tooltip} minW="370px" p={3}>
          <Text fontWeight="bold" ml={2}>
            {value}
          </Text>
        </Tooltip>
      ) : (
        <Text fontWeight="bold" ml={2}>
          {value}
        </Text>
      )}
      <Button
        bgColor="green.400"
        color="black"
        borderRadius="6"
        px="1.25rem"
        size="sm"
        _hover={{ bgColor: 'green.700' }}
        onClick={onCopy}
      >
        Copy
      </Button>
    </Flex>
  </>
);

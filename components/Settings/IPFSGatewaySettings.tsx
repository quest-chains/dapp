import {
  Box,
  Button,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

import { EditIcon } from '@/components/icons/EditIcon';
import { uniqueList } from '@/utils/helpers';
import { setInStorage, STORAGE_KEYS } from '@/utils/storageHelpers';
import {
  checkIPFSGateway,
  getIPFSGateway,
  IPFS_GATEWAYS,
} from '@/utils/uriHelpers';

import { SubmitButton } from '../SubmitButton';

type Option = {
  readonly label: string;
  readonly value: string;
};

const createOption = (input: string): Option => {
  const url = new URL(input);
  const label = `${url.protocol}//${url.hostname}`;
  return {
    label,
    value: label,
  };
};

export const IPFSGatewaySettings: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ipfsGateway = getIPFSGateway();

  const [isLoading, setLoading] = useState(false);

  const defaultOptions = uniqueList([ipfsGateway, ...IPFS_GATEWAYS]).map(g =>
    createOption(g),
  );

  const [options, setOptions] = useState<Option[]>(defaultOptions);
  useEffect(() => setOptions(defaultOptions), [defaultOptions, isOpen]);

  const [value, setValue] = useState<Option | null>(createOption(ipfsGateway));
  useEffect(() => setValue(createOption(ipfsGateway)), [ipfsGateway, isOpen]);

  const handleCreate = useCallback(async (inputValue: string) => {
    try {
      setLoading(true);
      await checkIPFSGateway(inputValue);
      const newOption = createOption(inputValue);
      setOptions(prev => [...prev, newOption]);
      setValue(newOption);
    } catch (error) {
      toast.error('IPFS gateway invalid or not reachable');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'start', md: 'center' }}
      fontWeight="bold"
    >
      <Text fontSize="lg">IPFS Gateway:</Text>
      <HStack pl={4} borderRadius="full" bg="whiteAlpha.100">
        <Text>{ipfsGateway}</Text>
        <Button
          variant="ghost"
          bgColor="rgba(71, 85, 105, 0.4)"
          onClick={onOpen}
          fontSize="xs"
          leftIcon={<EditIcon fontSize="sm" />}
        >
          Change
        </Button>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="48rem">
          <ModalHeader>Change IPFS Gateway</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Please select a gateway from the following list or add your own.
            </Text>
            <Text>
              You can use the{' '}
              <Link
                href="https://ipfs.github.io/public-gateway-checker/"
                isExternal
                textDecor="underline"
                color="main"
              >
                IPFS Public Gateway Checker
              </Link>{' '}
              to find what works best for your location.
            </Text>
            <Box w="100%" pt={6} color="black">
              <CreatableSelect
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={setValue}
                onCreateOption={handleCreate}
                options={options}
                value={value}
              />
            </Box>
          </ModalBody>
          <ModalFooter alignItems="baseline">
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setInStorage(STORAGE_KEYS.IPFS_GATEWAY, ipfsGateway);
                onClose();
              }}
              borderRadius="full"
            >
              Close
            </Button>
            <SubmitButton
              mt={4}
              isDisabled={!value || value.value === ipfsGateway}
              onClick={() => {
                if (!value) return;
                setInStorage(STORAGE_KEYS.IPFS_GATEWAY, value.value);
                onClose();
              }}
            >
              Submit
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

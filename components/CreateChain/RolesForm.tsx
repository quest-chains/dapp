import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import AddUser from '@/assets/add-user.svg';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { isSupportedNetwork, useWallet } from '@/web3';

export interface Member {
  role: string;
  address: string;
}

export const RolesForm: React.FC<{
  onSubmit: (members: Member[]) => void;
  address: string | undefined | null;
}> = ({ onSubmit, address }) => {
  const { isConnected, chainId } = useWallet();

  const [members, setMembers] = useState<Member[]>([]);

  const setRole = (role: string, address: string) => {
    const newMembers = members.map(member => {
      if (member.address === address) return { address, role };
      else return member;
    });

    setMembers(newMembers);
  };

  const addNewAddress = (address: string) => {
    setMembers(members.concat({ address, role: '' }));
  };

  useEffect(() => {
    if (address && !members.length) {
      setMembers([{ role: 'owner', address }]);
    }
  }, [address, members.length]);

  const isDisabled = !isConnected || !isSupportedNetwork(chainId);

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={10}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={10}
      px={{ base: 4, md: 12 }}
      py={8}
    >
      <HStack w="100%">
        <Box
          py={1}
          px={3}
          borderWidth={1}
          borderColor="gray.500"
          color="gray.500"
          borderRadius={4}
          mr={4}
        >
          STEP 3
        </Box>
        <Text fontWeight="bold" fontSize={16}>
          Members
        </Text>
      </HStack>
      <Box maxW="3xl">
        <Text>
          A quest chain can exist with only you - its owner - as a member.
        </Text>
        <Text>
          However, adding members may be beneficial when you want to divide the
          responsibilities of maintenance and reviewing of quest submissions
          between multiple people.
        </Text>
      </Box>
      <Flex w="full" gap={16} flexDir={{ base: 'column', md: 'row' }} mb={8}>
        <VStack w={{ base: '100%', md: '50%' }} align="flex-start" spacing={4}>
          <Roles
            members={members}
            setRole={setRole}
            ownerAddress={address}
            addNewAddress={addNewAddress}
          />
        </VStack>
        <Grid
          templateColumns="2fr 1fr 1fr 1fr 1fr"
          w="50%"
          alignItems="center"
          justifyItems="center"
          h="fit-content"
        >
          <GridItem bgColor="" />
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <Text fontWeight="bold" fontSize={{ base: 8, md: 14 }}>
              Owner
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" fontSize={{ base: 8, md: 14 }}>
              Admin
            </Text>
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <Text fontWeight="bold" fontSize={{ base: 8, md: 14 }}>
              Editor
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" fontSize={{ base: 8, md: 14 }}>
              Reviewer
            </Text>
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <Text fontWeight="bold" p={4} fontSize={{ base: 8, md: 14 }}>
              Add/remove owners & upgrade to premium chain
            </Text>
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.08)">
            <CheckIcon />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CloseIcon color="gray.600" />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.08)">
            <CloseIcon color="gray.600" />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CloseIcon color="gray.600" />
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" p={4} fontSize={{ base: 8, md: 14 }}>
              Add/remove admins, editors and reviewers
            </Text>
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CheckIcon />
          </GridItem>
          <GridItem>
            <CheckIcon />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CloseIcon color="gray.600" />
          </GridItem>
          <GridItem>
            <CloseIcon color="gray.600" />
          </GridItem>

          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <Text fontWeight="bold" p={4} fontSize={{ base: 8, md: 14 }}>
              Add/edit/delete quests
            </Text>
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.08)">
            <CheckIcon />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CheckIcon />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.08)">
            <CheckIcon />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CloseIcon color="gray.600" />
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" p={4} fontSize={{ base: 8, md: 14 }}>
              Approve/decline submissions
            </Text>
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CheckIcon />
          </GridItem>
          <GridItem>
            <CheckIcon />
          </GridItem>
          <GridItem bgColor="rgba(255, 255, 255, 0.04)">
            <CheckIcon />
          </GridItem>
          <GridItem>
            <CheckIcon />
          </GridItem>
        </Grid>
      </Flex>

      <SubmitButton
        onClick={() => onSubmit(members)}
        isDisabled={isDisabled}
        w="full"
      >
        Continue to Step 4
      </SubmitButton>
    </VStack>
  );
};

const GridItem: React.FC<{
  bgColor?: string | undefined;
  children?: unknown;
}> = ({ bgColor, children }) => {
  return (
    <Flex
      bgColor={bgColor}
      w="full"
      h="full"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <>{children}</>
    </Flex>
  );
};

const Roles: React.FC<{
  members: Member[];
  ownerAddress?: string | undefined | null;
  setRole: (role: string, address: string) => void;
  addNewAddress: (address: string) => void;
}> = ({ members, setRole, ownerAddress, addNewAddress }) => {
  const [newAddress, setNewAddress] = useState('');

  return (
    <Flex flexDir="column" w="full" gap={4}>
      <Text fontSize={14} fontWeight="bold">
        Add a member
      </Text>
      <Flex bgColor="gray.800" alignItems="center" p={1} borderRadius={8}>
        <InputGroup flexGrow={1}>
          <InputLeftElement
            pointerEvents="none"
            // eslint-disable-next-line react/no-children-prop, jsx-a11y/alt-text
            children={<Image src={AddUser.src} left={6} position="absolute" />}
          />
          <Input
            border={0}
            pl={16}
            type="address"
            placeholder="Paste or write in ETH address..."
            value={newAddress}
            onChange={e => setNewAddress(e.target.value)}
          />
        </InputGroup>
        <Tooltip
          isDisabled={ethers.utils.isAddress(newAddress)}
          label="Please input a valid address"
          shouldWrapChildren
        >
          <IconButton
            isDisabled={!ethers.utils.isAddress(newAddress)}
            onClick={() => {
              if (members.find(member => member.address === newAddress)) {
                setNewAddress('');
                toast.error('Address has already been added');
                return;
              }
              addNewAddress(newAddress);
              setNewAddress('');
            }}
            icon={<CheckIcon />}
            aria-label="Add"
            height={9}
            w={16}
          />
        </Tooltip>
      </Flex>

      {members.map(({ role, address }) => (
        <Flex key={role + address}>
          {address && (
            <Flex w="full" justifyContent="space-between" alignItems="center">
              <UserDisplay address={address} full />
              <Select
                onChange={e => setRole(e.target.value, address)}
                value={role}
                placeholder="Select role"
                isDisabled={ownerAddress === address}
                w="auto"
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="reviewer">Reviewer</option>
              </Select>
            </Flex>
          )}
        </Flex>
      ))}
    </Flex>
  );
};

import {
  Box,
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';

import { useUserRolesForAllChains } from '@/hooks/useUserRolesForAllChains';

import { NetworkDisplay } from './NetworkDisplay';
import { Role } from './RoleTag';

type QuestChainRoleInfo = {
  address: string;
  chainId: string;
  name?: string | null | undefined;
  role: Role;
};

export const UserRoles: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userRoles } = useUserRolesForAllChains(address);
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  const roles: QuestChainRoleInfo[] = useMemo(() => {
    const questRoles: { [addressChainId: string]: QuestChainRoleInfo } = {};

    userRoles?.forEach(chainRoles => {
      chainRoles?.reviewerOf?.forEach(chain => {
        const id = chain.address
          .toLowerCase()
          .concat('-')
          .concat(chain.chainId.toLowerCase());
        questRoles[id] = {
          ...chain,
          role: 'Reviewer' as Role,
        };
      });
      chainRoles?.editorOf?.forEach(chain => {
        const id = chain.address
          .toLowerCase()
          .concat('-')
          .concat(chain.chainId.toLowerCase());
        questRoles[id] = {
          ...chain,
          role: 'Editor' as Role,
        };
      });
      chainRoles?.adminOf?.forEach(chain => {
        const id = chain.address
          .toLowerCase()
          .concat('-')
          .concat(chain.chainId.toLowerCase());
        questRoles[id] = {
          ...chain,
          role: 'Admin' as Role,
        };
      });
      chainRoles?.ownerOf?.forEach(chain => {
        const id = chain.address
          .toLowerCase()
          .concat('-')
          .concat(chain.chainId.toLowerCase());
        questRoles[id] = {
          ...chain,
          role: 'Owner' as Role,
        };
      });
    });

    return Object.values(questRoles);
  }, [userRoles]);

  return (
    <VStack spacing={4} align="stretch">
      <Flex justifyContent="space-between" alignItems="baseline">
        <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
          Roles
        </Heading>
        {roles?.length > 4 && (
          <Button
            variant="ghost"
            whiteSpace="nowrap"
            fontWeight="bold"
            color="main"
            borderRadius="3xl"
            onClick={onOpenSeeAll}
          >
            SEE ALL
          </Button>
        )}
      </Flex>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {roles.length === 0 && <Text color="white">No roles found</Text>}
          {roles?.slice(0, 2).map(({ address, chainId, name, role }) => (
            <Flex
              key={address}
              gap={3}
              alignItems="center"
              w="full"
              background="whiteAlpha.50"
              p={4}
              justifyContent="space-between"
            >
              <Box>
                <NextLink
                  key={address}
                  as={`/chain/${chainId}/${address}`}
                  href={`/chain/[chainId]/[address]`}
                  passHref
                >
                  <ChakraLink
                    display="block"
                    _hover={{}}
                    w="full"
                    borderRadius="3xl"
                  >
                    <Text fontSize={20} fontWeight="bold">
                      {name}
                    </Text>
                  </ChakraLink>
                </NextLink>
              </Box>
              <Flex gap={4} alignItems="center">
                <Text fontSize={16} fontWeight="bold">
                  {role.toUpperCase()}
                </Text>
                <NetworkDisplay asTag chainId={chainId} />
              </Flex>
            </Flex>
          ))}
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>Roles</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {roles?.map(({ address, chainId, name, role }) => (
              <Flex
                key={address}
                gap={3}
                alignItems="center"
                w="full"
                background="whiteAlpha.50"
                p={4}
                justifyContent="space-between"
              >
                <Box>
                  <NextLink
                    key={address}
                    as={`/chain/${chainId}/${address}`}
                    href={`/chain/[chainId]/[address]`}
                    passHref
                  >
                    <ChakraLink
                      display="block"
                      _hover={{}}
                      w="full"
                      borderRadius="3xl"
                    >
                      <Text fontSize={20} fontWeight="bold">
                        {name}
                      </Text>
                    </ChakraLink>
                  </NextLink>
                </Box>
                <Flex gap={4} alignItems="center">
                  <Text fontSize={16} fontWeight="bold">
                    {role.toUpperCase()}
                  </Text>
                  <NetworkDisplay asTag chainId={chainId} />
                </Flex>
              </Flex>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

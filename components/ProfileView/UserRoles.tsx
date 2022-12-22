import { WarningIcon } from '@chakra-ui/icons';
import {
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
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { Role } from '@/components/RoleTag';
import { useUserRolesForAllChains } from '@/hooks/useUserRolesForAllChains';
import { useWallet } from '@/web3';

type QuestChainRoleInfo = {
  address: string;
  createdAt: string;
  chainId: string;
  paused: boolean;
  name?: string | null | undefined;
  role: Role;
};

export const UserRoles: React.FC<{
  address: string;
}> = ({ address }) => {
  const { address: userAddress } = useWallet();
  const isLoggedInUser = address === userAddress?.toLowerCase();

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

    return Object.values(questRoles).sort(
      (a, b) => Number(a.createdAt) - Number(b.createdAt),
    );
  }, [userRoles]);

  return (
    <VStack spacing={4} align="stretch">
      <Flex justifyContent="space-between" alignItems="baseline">
        <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
          {isLoggedInUser ? 'My ' : ''}Roles
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
          {roles.length === 0 && (
            <Flex>
              <Text color="white" ml={4}>
                No roles found
              </Text>
            </Flex>
          )}
          {roles?.slice(0, 4).map(roleInfo => (
            <RoleDisplay roleInfo={roleInfo} key={roleInfo.address} />
          ))}
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>Roles</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {roles?.map(roleInfo => (
              <RoleDisplay roleInfo={roleInfo} key={roleInfo.address} />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

const RoleDisplay: React.FC<{ roleInfo: QuestChainRoleInfo }> = ({
  roleInfo: { address, chainId, name, role, paused },
}) => (
  <NextLink
    as={`/${chainId}/${address}`}
    href={`/[chainId]/[address]`}
    passHref
  >
    <ChakraLink
      display="block"
      background="whiteAlpha.50"
      _hover={{ background: 'whiteAlpha.100' }}
      w="full"
      borderRadius={8}
      overflow="hidden"
    >
      <Flex
        gap={3}
        alignItems={{ base: 'stretch', md: 'center' }}
        w="full"
        p={4}
        justifyContent="space-between"
        borderRadius={8}
        direction={{ base: 'column', md: 'row' }}
      >
        <Text fontSize={20} fontWeight="bold">
          {name}
        </Text>
        <Flex gap={4} alignItems="center" justifyContent="flex-end">
          {paused && (
            <Tag
              variant="subtle"
              colorScheme="orange"
              size="sm"
              borderRadius="full"
            >
              <TagLeftIcon as={WarningIcon} boxSize=".75rem" />
              <TagLabel color="white">Disabled</TagLabel>
            </Tag>
          )}
          <Text fontSize={16} fontWeight="bold">
            {role.toUpperCase()}
          </Text>
          <NetworkDisplay asTag chainId={chainId} />
        </Flex>
      </Flex>
    </ChakraLink>
  </NextLink>
);

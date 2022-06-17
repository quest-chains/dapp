import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';

import { useUserRolesForAllChains } from '@/hooks/useUserRolesForAllChains';

import { NetworkDisplay } from './NetworkDisplay';
import { Role, RoleTag } from './RoleTag';

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
      <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
        Roles
      </Heading>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {roles.length === 0 && <Text color="white">No roles found</Text>}
          {roles?.map(({ address, chainId, name, role }) => (
            <Flex key={address} gap={3} alignItems="center">
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
                    {name}
                  </ChakraLink>
                </NextLink>
              </Box>
              <NetworkDisplay asTag chainId={chainId} />
              <RoleTag role={role} />
            </Flex>
          ))}
        </>
      )}
    </VStack>
  );
};

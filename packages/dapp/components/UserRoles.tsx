import {
  Box,
  Flex,
  Link as ChakraLink,
  Spinner,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

import { useUserRolesForAllChains } from '@/hooks/useUserRolesForAllChains';

import { NetworkDisplay } from './NetworkDisplay';

type RoleProps = {
  address: string;
  chainId: string;
  name: string | null | undefined;
  role: string;
};

export const UserRoles = () => {
  const { fetching, results: userRoles } = useUserRolesForAllChains();
  const [roles, setRoles] = useState<RoleProps[]>([]);

  useEffect(() => {
    if (userRoles) {
      const roles = userRoles.map(chainRoles => {
        const adminOf = chainRoles?.adminOf?.map(chain => ({
          ...chain,
          role: 'Admin',
        }));

        const editorOf = chainRoles?.editorOf
          ?.filter(
            ({ address }) =>
              !adminOf?.map(({ address }) => address).includes(address),
          )
          ?.map(chain => ({
            ...chain,
            role: 'Editor',
          }));

        const reviewerOf = chainRoles?.reviewerOf
          ?.filter(
            ({ address }) =>
              !editorOf
                ?.concat(adminOf || [])
                ?.map(({ address }) => address)
                .includes(address),
          )
          ?.map(chain => ({
            ...chain,
            role: 'Reviewer',
          }));

        const rolesForChain = (adminOf || [])
          .concat(editorOf || [])
          .concat(reviewerOf || [])
          .map(({ address, chainId, name, role }) => ({
            address,
            chainId,
            name,
            role,
          }));

        return rolesForChain;
      });

      setRoles(roles.flat()?.filter(role => role));
    }
  }, [userRoles]);

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="center" mb={2} color="main" fontSize={20}>
        ROLES
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {roles.length === 0 && (
            <VStack w="100%">
              <Text color="white">No roles found</Text>
            </VStack>
          )}
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
              {role === 'Reviewer' && (
                <Tag fontSize="sm" color="neutral">
                  {role}
                </Tag>
              )}
              {role === 'Editor' && (
                <Tag fontSize="sm" color="rejected">
                  {role}
                </Tag>
              )}
              {role === 'Admin' && (
                <Tag fontSize="sm" color="pending">
                  {role}
                </Tag>
              )}
            </Flex>
          ))}
        </>
      )}
    </VStack>
  );
};

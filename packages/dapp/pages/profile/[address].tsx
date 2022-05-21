import {
  Box,
  Flex,
  Link as ChakraLink,
  Spinner,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { UserProgress } from '@/components/UserProgress';
import { useUserRolesForAllChains } from '@/hooks/useUserRolesForAllChains';

type Props = { address: string };

type RoleProps = {
  address: string;
  chainId: string;
  name: string | null | undefined;
  role: string;
};

const Explore: React.FC<Props> = () => {
  const [address, setAddress] = useState('');
  const { fetching, results: userRoles } = useUserRolesForAllChains();
  const [roles, setRoles] = useState<RoleProps[]>([]);

  useEffect(() => {
    const address = window.location.href.split('/').pop();

    if (address) setAddress(address);
  }, []);

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
    <VStack px={{ base: 0, lg: 40 }} alignItems="flex-start" gap={4}>
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Text>Address: {address}</Text>

      {fetching ? (
        <Spinner />
      ) : (
        <VStack alignItems="end">
          <Text w="100%" textAlign="center" mb={2} color="main" fontSize={20}>
            USER ROLES
          </Text>
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
        </VStack>
      )}
      <UserProgress />
    </VStack>
  );
};

export default Explore;

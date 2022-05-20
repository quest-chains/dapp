import {
  Box,
  Flex,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

import { UserProgress } from '@/components/UserProgress';
import { useUserRolesForAllChains } from '@/hooks/useUserRolesForAllChains';
import { NETWORK_INFO } from '@/web3';

type Props = { address: string };

const Explore: React.FC<Props> = () => {
  const [address, setAddress] = useState('');
  const { fetching, results: userRoles } = useUserRolesForAllChains();

  useEffect(() => {
    const address = window.location.href.split('/').pop();

    if (address) setAddress(address);
  }, []);

  return (
    <VStack px={{ base: 0, lg: 40 }} alignItems="flex-start" gap={4}>
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Text>Address: {address}</Text>

      <Text>User Roles: </Text>
      {fetching ? (
        <Spinner />
      ) : (
        <>
          {userRoles.map(chainRoles => (
            <Box key={chainRoles?.chainId}>
              {chainRoles && (
                <Box>
                  <Text>chain: {NETWORK_INFO[chainRoles.chainId]?.name}</Text>
                  <Text>Admin Of: </Text>
                  <Flex>
                    {chainRoles.adminOf?.map(({ name, chainId, address }) => (
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
                    ))}
                  </Flex>
                  <Text>Editor Of: </Text>
                  <Flex>
                    {chainRoles.editorOf?.map(({ name, chainId, address }) => (
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
                    ))}
                  </Flex>
                  <Text>Reviewer Of: </Text>
                  <Flex>
                    {chainRoles.reviewerOf?.map(
                      ({ name, chainId, address }) => (
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
                      ),
                    )}
                  </Flex>
                </Box>
              )}
            </Box>
          ))}
        </>
      )}
      <UserProgress />
    </VStack>
  );
};

export default Explore;

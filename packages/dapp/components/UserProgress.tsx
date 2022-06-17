import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useUserProgressForAllChains } from '@/hooks/useUserProgressForAllChains';

import { NetworkDisplay } from './NetworkDisplay';

export const UserProgress: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userStatuses } =
    useUserProgressForAllChains(address);
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  return (
    <VStack spacing={4} align="stretch">
      <Flex justifyContent="space-between" alignItems="baseline">
        <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
          My Progress
        </Heading>
        {userStatuses.length > 2 && (
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
          {userStatuses.length === 0 && (
            <Text color="white">No progress found</Text>
          )}
          <Grid gap={8} templateColumns="repeat(2, 1fr)">
            {userStatuses.slice(0, 2).map(us => (
              <NextLink
                as={`/chain/${us.chain.chainId}/${us.chain.address}`}
                href={`/chain/[chainId]/[address]`}
                passHref
                key={us.chain.address}
              >
                <ChakraLink display="block" _hover={{}}>
                  <Flex flexDirection="column" alignItems="center">
                    <VStack
                      w="full"
                      boxShadow="inset 0px 0px 0px 1px white"
                      p={8}
                      background="#171F2B"
                      _hover={{
                        background: 'whiteAlpha.100',
                      }}
                      align="stretch"
                      spacing={4}
                      justify="space-between"
                    >
                      <HStack justify="space-between" w="100%">
                        <Heading fontSize="xl" fontWeight="bold">
                          {us.chain.name}
                        </Heading>
                      </HStack>
                      <Flex justifyContent="space-between" alignItems="center">
                        <Progress
                          value={(us.completed / us.total) * 100 || 1}
                          size="xs"
                          w="85%"
                        />
                        <Text>{(us.completed / us.total) * 100} %</Text>
                      </Flex>
                      <Text>{us.chain.description}</Text>

                      <Flex justifyContent="space-between">
                        <Text># quests: {us.total}</Text>
                        <NetworkDisplay asTag chainId={us.chain.chainId} />
                      </Flex>
                    </VStack>
                    <Box
                      boxShadow="inset 0px 0px 0px 1px white"
                      w="95%"
                      h="0.5rem"
                    ></Box>
                    <Box
                      boxShadow="inset 0px 0px 0px 1px white"
                      w="90%"
                      h="0.5rem"
                    ></Box>
                  </Flex>
                </ChakraLink>
              </NextLink>
            ))}
          </Grid>
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>My Progress</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={8} templateColumns="repeat(2, 1fr)">
              {userStatuses.map(us => (
                <NextLink
                  as={`/chain/${us.chain.chainId}/${us.chain.address}`}
                  href={`/chain/[chainId]/[address]`}
                  passHref
                  key={us.chain.address}
                >
                  <ChakraLink display="block" _hover={{}}>
                    <Flex flexDirection="column" alignItems="center">
                      <VStack
                        w="full"
                        boxShadow="inset 0px 0px 0px 1px white"
                        p={8}
                        background="#171F2B"
                        _hover={{
                          background: 'whiteAlpha.100',
                        }}
                        align="stretch"
                        spacing={4}
                        justify="space-between"
                      >
                        <HStack justify="space-between" w="100%">
                          <Heading fontSize="xl" fontWeight="bold">
                            {us.chain.name}
                          </Heading>
                        </HStack>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Progress
                            value={(us.completed / us.total) * 100 || 1}
                            size="xs"
                            w="85%"
                          />
                          <Text>{(us.completed / us.total) * 100} %</Text>
                        </Flex>
                        <Text>{us.chain.description}</Text>

                        <Flex justifyContent="space-between">
                          <Text># quests: {us.total}</Text>
                          <NetworkDisplay asTag chainId={us.chain.chainId} />
                        </Flex>
                      </VStack>
                      <Box
                        boxShadow="inset 0px 0px 0px 1px white"
                        w="95%"
                        h="0.5rem"
                      ></Box>
                      <Box
                        boxShadow="inset 0px 0px 0px 1px white"
                        w="90%"
                        h="0.5rem"
                      ></Box>
                    </Flex>
                  </ChakraLink>
                </NextLink>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

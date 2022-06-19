import {
  Button,
  Flex,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalContent,
  Portal,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { Link } from 'react-scroll';

import { NavToggle } from '../Layout/NavToggle';

export const MenuLandingMobile: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(o => !o);

  return (
    <>
      <Portal>
        <NavToggle isOpen={isOpen} onClick={toggleOpen} />
      </Portal>

      <Modal isOpen={isOpen} onClose={toggleOpen}>
        <ModalContent
          minW="100%"
          h="100%"
          minH="100%"
          m={0}
          p={0}
          borderRadius={0}
        >
          <ModalBody h="100%">
            <Flex
              flexDir="column"
              alignItems="center"
              h="full"
              justifyContent="center"
              gap={4}
            >
              <NextLink href="/explore" passHref>
                <ChakraLink display="block" _hover={{}}>
                  <Button
                    fontSize={20}
                    ml={3}
                    cursor="pointer"
                    fontFamily="headingLight"
                    onClick={toggleOpen}
                  >
                    Explore Quests
                  </Button>
                </ChakraLink>
              </NextLink>

              <Link
                activeClass="active"
                onClick={toggleOpen}
                to="what"
                spy={true}
                smooth={true}
                duration={500}
              >
                <Text
                  fontSize={20}
                  ml={3}
                  cursor="pointer"
                  fontFamily="headingLight"
                >
                  What
                </Text>
              </Link>
              <Link
                activeClass="active"
                onClick={toggleOpen}
                to="who"
                spy={true}
                smooth={true}
                duration={500}
              >
                <Text
                  fontSize={20}
                  ml={3}
                  cursor="pointer"
                  fontFamily="headingLight"
                >
                  Who
                </Text>
              </Link>
              <Link
                activeClass="active"
                onClick={toggleOpen}
                to="how"
                spy={true}
                smooth={true}
                duration={500}
              >
                <Text
                  fontSize={20}
                  ml={3}
                  cursor="pointer"
                  fontFamily="headingLight"
                >
                  How
                </Text>
              </Link>
              <Link
                activeClass="active"
                onClick={toggleOpen}
                to="creators"
                spy={true}
                smooth={true}
                duration={500}
                offset={-70}
              >
                <Text
                  fontSize={20}
                  ml={3}
                  cursor="pointer"
                  fontFamily="headingLight"
                >
                  Creators
                </Text>
              </Link>
              <Link
                activeClass="active"
                onClick={toggleOpen}
                to="questers"
                spy={true}
                smooth={true}
                duration={500}
                offset={-110}
              >
                <Text
                  fontSize={20}
                  ml={3}
                  cursor="pointer"
                  fontFamily="headingLight"
                >
                  Questers
                </Text>
              </Link>
              <Link
                activeClass="active"
                onClick={toggleOpen}
                to="team"
                spy={true}
                smooth={true}
                duration={500}
              >
                <Text
                  fontSize={20}
                  ml={3}
                  cursor="pointer"
                  fontFamily="headingLight"
                >
                  Team
                </Text>
              </Link>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

import {
  Avatar,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';

export const Team: React.FC = () => {
  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      minH={{ base: 'full', md: '110vh' }}
      bg="dark"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      id="team"
    >
      <Flex
        display="flex"
        flexDirection="column"
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        marginInlineStart="0 !important"
        zIndex={100}
        w="full"
        fontWeight="normal"
        color="white"
      >
        <Flex align="center" mb={10} flexDir="column">
          <Heading
            color="main"
            fontSize={{ base: 36, md: 79 }}
            pb={4}
            fontWeight="normal"
            display="flex"
          >
            Team
          </Heading>

          <Grid
            gap={8}
            // display={{ base: 'flex', md: 'grid' }}
            templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
            height={{ base: 'initial', md: '20rem' }}
          >
            <ProfileCard
              name="Vid"
              role="Front-End Developer"
              image="/Landing/profile/vid.png"
              github="https://github.com/vidvidvid"
              linkedin="https://www.linkedin.com/in/vid-topolovec-62a152a4/"
              twitter="https://twitter.com/viiiiiiiiiiiid"
            />
            <ProfileCard
              name="Dan"
              role="Full-Stack Developer"
              image="/Landing/profile/dan.jpeg"
              github="https://github.com/dan13ram"
              twitter="https://twitter.com/dan13ram"
            />
            <ProfileCard
              name="Dave"
              role="Product Designer"
              image="/Landing/profile/dave.jpg"
              linkedin="https://www.linkedin.com/in/davortomic/"
              portfolio="https://bit.ly/Portfolio-Davor_Tomic"
            />
            <ProfileCard
              name="Parv"
              role="Solidity Developer"
              image="/Landing/profile/parv.jpeg"
              github="https://github.com/parv3213"
              twitter="https://twitter.com/parv3213"
            />
            <ProfileCard
              name="Tony"
              role="Writer"
              image="/Landing/profile/tony.jpg"
              twitter="https://twitter.com/anthonyihediwa1"
            />
            <ProfileCard
              name="Beti"
              role="Artist"
              image="/Landing/profile/beti.png"
              portfolio="https://www.behance.net/betifrim"
            />
          </Grid>
        </Flex>
      </Flex>
    </HStack>
  );
};

const ProfileCard = ({
  name,
  role,
  image,
  github,
  linkedin,
  twitter,
  portfolio,
}: {
  name: string;
  image: string;
  role: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}) => (
  <Flex
    flexDir="column"
    alignItems="center"
    background="linear-gradient(transparent, rgba(45, 248, 199, 0.2))"
    p={8}
    borderRadius={12}
  >
    <Avatar name={name} src={image} size="2xl" showBorder borderColor="main" />
    <Text fontWeight="bold" mt={3} fontSize="lg" fontFamily="heading" mb={2}>
      {name}
    </Text>
    <Text marginBottom="auto" fontSize="sm" mb={2}>
      {role}
    </Text>

    <Flex alignItems="center" justifyContent="center" gap={2}>
      {github && (
        <ChakraLink href={github} isExternal borderRadius="full">
          <Image src="/Landing/contact/github.png" alt="ipfs" height={6} />
        </ChakraLink>
      )}
      {linkedin && (
        <ChakraLink href={linkedin} isExternal borderRadius="full">
          <Image src="/Landing/contact/linkedin.png" alt="ipfs" height={6} />
        </ChakraLink>
      )}
      {twitter && (
        <ChakraLink href={twitter} isExternal borderRadius="full">
          <Image src="/Landing/contact/twitter.png" alt="ipfs" height={6} />
        </ChakraLink>
      )}
      {portfolio && (
        <ChakraLink href={portfolio} isExternal borderRadius="full" _hover={{}}>
          <Heading
            color="blue.200"
            fontSize={'xl'}
            fontWeight="normal"
            lineHeight="1rem"
          >
            Portfolio
          </Heading>
        </ChakraLink>
      )}
    </Flex>
  </Flex>
);

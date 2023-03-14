import {
  ComponentWithAs,
  HStack,
  IconProps,
  Link as ChakraLink,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { DiscordIcon } from '../icons/DiscordIcon';
import { GithubIcon } from '../icons/GithubIcon';
import { MediumIcon } from '../icons/MediumIcon';
import { TwitterIcon } from '../icons/TwitterIcon';

type TextLinkType = {
  label: string;
  href: string;
  external: boolean;
};

const textLinks: TextLinkType[] = [
  { label: 'What is Quest Chains?', href: '/', external: false },
  { label: 'Explore quest chains', href: '/explore', external: false },
  {
    label: 'Documentation',
    href: 'https://quest-chains.gitbook.io/app-documentation/',
    external: true,
  },
  { label: 'Support', href: 'https://discord.gg/sjnh6cuVcN', external: true },
];

const TextLink = ({ label, href, external }: TextLinkType) =>
  external ? (
    <ChakraLink
      href={href}
      color="main"
      borderBottom="1px solid"
      borderBottomColor="main"
      _hover={{ borderBottomColor: 'white' }}
      isExternal
    >
      {label}
    </ChakraLink>
  ) : (
    <NextLink href={href} passHref>
      <ChakraLink
        color="main"
        borderBottom="1px solid"
        borderBottomColor="main"
        _hover={{ borderBottomColor: 'white' }}
      >
        {label}
      </ChakraLink>
    </NextLink>
  );

type IconLinkType = {
  Icon: ComponentWithAs<'svg', IconProps>;
  href: string;
  external: boolean;
};

const iconLinks: IconLinkType[] = [
  {
    Icon: TwitterIcon,
    href: 'https://twitter.com/questchainz',
    external: true,
  },
  { Icon: GithubIcon, href: 'https://github.com/quest-chains', external: true },
  {
    Icon: DiscordIcon,
    href: 'https://discord.com/invite/sjnh6cuVcN',
    external: true,
  },
  { Icon: MediumIcon, href: 'https://medium.com/quest-chains', external: true },
];

const IconLink = ({ Icon, href, external }: IconLinkType) =>
  external ? (
    <ChakraLink href={href} color="white" _hover={{ color: 'main' }} isExternal>
      <Icon />
    </ChakraLink>
  ) : (
    <NextLink href={href} passHref>
      <ChakraLink color="white" _hover={{ color: 'main' }}>
        <Icon />
      </ChakraLink>
    </NextLink>
  );

export const Footer: React.FC = () => (
  <VStack
    w="100%"
    justify="center"
    align="center"
    zIndex={1000}
    gap={2}
    pt={8}
    pb={4}
    fontSize="sm"
    background="linear-gradient(transparent, rgba(255, 255, 255, 0.1))"
    h={{ base: '16rem', md: '10rem' }}
  >
    <Stack
      gap={{ base: 1, md: 2, lg: 4 }}
      direction={{ base: 'column', md: 'row' }}
      align="center"
    >
      {textLinks.map(l => (
        <TextLink key={l.href} {...l} />
      ))}
    </Stack>
    <HStack gap={4} fontSize="xl">
      {iconLinks.map(l => (
        <IconLink key={l.href} {...l} />
      ))}
    </HStack>
    <Text>2023 © Quest Chains.</Text>
  </VStack>
);

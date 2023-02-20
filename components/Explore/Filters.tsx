import { HStack, Select, Text } from '@chakra-ui/react';

import { CHAIN_URL_MAPPINGS } from '@/web3';

enum Category {
  All = 'All',
  NFT = 'NFT',
  GameFi = 'GameFi',
  DeFi = 'DeFi',
  DAO = 'DAO',
  SocialFi = 'SocialFi',
  Metaverse = 'Metaverse',
  Tools = 'Tools',
  Others = 'Others',
  Ecosystem = 'Ecosystem',
}

enum NftType {
  'All' = 'All',
  '2D' = '2D',
  '3D' = '3D',
  'Custom' = 'Custom',
}

enum Verified {
  'All' = 'All',
  'Verified' = 'Verified',
  'Unverified' = 'Unverified',
}

const Filters: React.FC<{
  category: string;
  setCategory: (value: string) => void;
  chain: string;
  setChain: (value: string) => void;
  nftType: string;
  setNftType: (value: string) => void;
  verified: string;
  setVerified: (value: string) => void;
}> = ({
  category,
  setCategory,
  chain,
  setChain,
  nftType,
  setNftType,
  verified,
  setVerified,
}) => {
  return (
    <HStack>
      <Text fontSize="sm">Filter by</Text>
      <Select
        onChange={e => setCategory(e.target.value)}
        value={category}
        placeholder="Category"
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value={Category.All}>All</option>
        <option value={Category.NFT}>NFT</option>
        <option value={Category.GameFi}>GameFi</option>
        <option value={Category.DeFi}>DeFi</option>
        <option value={Category.DAO}>DAO</option>
        <option value={Category.SocialFi}>SocialFi</option>
        <option value={Category.Metaverse}>Metaverse</option>
        <option value={Category.Tools}>Tools</option>
        <option value={Category.Others}>Others</option>
        <option value={Category.Ecosystem}>Ecosystem</option>
      </Select>
      <Select
        onChange={e => setChain(e.target.value)}
        value={chain}
        placeholder="Network"
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value="All">All</option>
        <option value={CHAIN_URL_MAPPINGS.polygon}>Polygon</option>
        <option value={CHAIN_URL_MAPPINGS.optimism}>Optimism</option>
        <option value={CHAIN_URL_MAPPINGS.arbitrum}>Arbitrum</option>
        <option value={CHAIN_URL_MAPPINGS.gnosis}>Gnosis</option>
      </Select>
      <Select
        onChange={e => setNftType(e.target.value)}
        value={nftType}
        placeholder="NFT Type"
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value={NftType.All}>All</option>
        <option value={NftType['2D']}>2D</option>
        <option value={NftType['3D']}>3D</option>
        <option value={NftType.Custom}>Custom</option>
      </Select>
      <Select
        onChange={e => setVerified(e.target.value)}
        value={verified}
        placeholder="Verified"
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value={Verified.All}>All</option>
        <option value={Verified.Verified}>Verified</option>
        <option value={Verified.Unverified}>Unverified</option>
      </Select>
    </HStack>
  );
};

export default Filters;

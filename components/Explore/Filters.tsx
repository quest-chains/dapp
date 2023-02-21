import { HStack, Select, Text } from '@chakra-ui/react';

import { useCategories } from '@/hooks/useCategories';
import { SUPPORTED_NETWORK_INFO } from '@/web3';

// enum NftType {
//   'All' = 'All',
//   '2D' = '2D',
//   '3D' = '3D',
//   'Custom' = 'Custom',
// }

// enum Verified {
//   'All' = 'All',
//   'Verified' = 'Verified',
//   'Unverified' = 'Unverified',
// }

const Filters: React.FC<{
  category: string | undefined;
  setCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  network: string | undefined;
  setNetwork: React.Dispatch<React.SetStateAction<string | undefined>>;
  // nftType: string;
  // setNftType: (value: string) => void;
  // verified: string;
  // setVerified: (value: string) => void;
}> = ({
  category = 'ALL',
  setCategory,
  network = 'ALL',
  setNetwork,
  // nftType,
  // setNftType,
  // verified,
  // setVerified,
}) => {
  const { categories } = useCategories();

  return (
    <HStack>
      <Text fontSize="sm">Filter by</Text>
      <Select
        onChange={e => {
          if (e.target.value === 'ALL') {
            setCategory(undefined);
          } else {
            setCategory(e.target.value);
          }
        }}
        value={category}
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value={'ALL'}>All Categories</option>
        {categories.map(c => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
      <Select
        onChange={e => {
          if (e.target.value === 'ALL') {
            setNetwork(undefined);
          } else {
            setNetwork(e.target.value);
          }
        }}
        value={network}
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value="ALL">All Networks</option>
        {Object.values(SUPPORTED_NETWORK_INFO).map(c => (
          <option key={c.chainId} value={c.chainId}>
            {c.label}
          </option>
        ))}
      </Select>
      {/* <Select
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
      </Select> */}
    </HStack>
  );
};

export default Filters;

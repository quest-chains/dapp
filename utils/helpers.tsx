import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Link, Text } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

import { getExplorerLabel, getTxUrl } from '@/web3';

export const handleError = (error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  toast.error(
    (error as { error?: Error }).error?.message ?? (error as Error).message,
  );
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const handleTxLoading = (txHash: string, chainId: string): string => {
  return toast.loading(
    <Link href={getTxUrl(txHash, chainId)} _hover={{}} isExternal>
      <HStack>
        <Text>
          Transaction submitted. You can{' '}
          <Text as="span" textDecor="underline">
            view the transaction on {getExplorerLabel(chainId)}
          </Text>
          .
        </Text>
        <ExternalLinkIcon />
      </HStack>
    </Link>,
  );
};

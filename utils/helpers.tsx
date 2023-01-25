import { ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Link, Text } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

import { getExplorerLabel, getTxUrl } from '@/web3';

export const handleError = (error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);

  const isUserError =
    // (error as Error)?.message?.toLowerCase().includes('user denied') ||
    (error as Error)?.message?.toLowerCase().includes('user rejected') || false;
  if (isUserError) {
    toast.error('User rejected transaction');
    return;
  }

  toast.error(
    (error as { error?: Error }).error?.message ?? (error as Error).message,
  );
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const uniqueList = (arr: string[]): string[] => {
  const seen = new Set<string>();
  return arr.filter(item => (seen.has(item) ? false : seen.add(item)));
};

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

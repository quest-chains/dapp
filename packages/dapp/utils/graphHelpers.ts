/* eslint-disable no-await-in-loop */

import { getGraphLatestBlock } from '@/stores/graphHealth';
import { sleep } from '@/utils/helpers';

const UPDATE_INTERVAL = 10000;

const MAX_RETRIES = 6;

export const waitUntilBlock = async (
  chainId: string,
  block: number,
): Promise<boolean> => {
  let latestBlock = getGraphLatestBlock(chainId);
  let tries = 0;
  while (latestBlock < block && tries < MAX_RETRIES) {
    await sleep(UPDATE_INTERVAL);
    tries += 1;
    latestBlock = getGraphLatestBlock(chainId);
  }
  return latestBlock >= block;
};

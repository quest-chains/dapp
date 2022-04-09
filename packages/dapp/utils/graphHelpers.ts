/* eslint-disable no-await-in-loop */

import { getGraphLatestBlock } from '@/stores/graphHelpers';
import { sleep } from '@/utils/helpers';

const UPDATE_INTERVAL = 10000;

const MAX_RETRIES = 3;

export const waitUntilBlock = async (block = 0): Promise<boolean> => {
  let latestBlock = getGraphLatestBlock();
  let tries = 0;
  while (latestBlock < block && tries < MAX_RETRIES) {
    await sleep(UPDATE_INTERVAL);
    tries += 1;
    latestBlock = getGraphLatestBlock();
  }
  return latestBlock >= block;
};

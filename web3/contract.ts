import { Signer } from 'ethers';

import {
  QuestChain as QuestChainV0,
  QuestChain__factory as QuestChainV0__factory,
} from '@/types/v0';
import {
  QuestChain as QuestChainV1,
  QuestChain__factory as QuestChainV1__factory,
} from '@/types/v1';

export const getQuestChainContract = (
  address: string,
  version: string,
  signer: Signer,
): QuestChainV1 | QuestChainV0 => {
  if (version === '0') {
    return QuestChainV0__factory.connect(address, signer) as QuestChainV0;
  }
  if (version === '1') {
    return QuestChainV1__factory.connect(address, signer) as QuestChainV1;
  }
  throw new Error('Unsupported Quest Chain version');
};

import { Signer } from '@ethersproject/abstract-signer';
import { contracts } from '@quest-chains/sdk';

export const getQuestChainContract = (
  address: string,
  version: string,
  signer: Signer,
):
  | contracts.V0.QuestChain
  | contracts.V1.QuestChain
  | contracts.V2.QuestChain => {
  if (version === '0') {
    return contracts.V0.QuestChain__factory.connect(
      address,
      signer,
    ) as contracts.V0.QuestChain;
  }
  if (version === '1') {
    return contracts.V1.QuestChain__factory.connect(
      address,
      signer,
    ) as contracts.V1.QuestChain;
  }
  return contracts.V2.QuestChain__factory.connect(
    address,
    signer,
  ) as contracts.V2.QuestChain;
};

import { log } from '@graphprotocol/graph-ts';
import { QuestChain, Global } from '../types/schema';

import {
  NewQuestChain as NewQuestChainEvent,
  QuestChainRootChanged as QuestChainRootChangedEvent,
} from '../types/QuestChainFactory/QuestChainFactory';
import { QuestChain as QuestChainTemplate } from '../types/templates';

import { getUser, getNetwork } from './helpers';

export function handleQuestChainRootChanged(
  event: QuestChainRootChangedEvent,
): void {
  let network = getNetwork();
  let globalNode = Global.load(network);
  if (globalNode == null) {
    globalNode = new Global(network);
    globalNode.factoryAddress = event.address;
    globalNode.save();
  }
}

export function handleNewQuestChain(event: NewQuestChainEvent): void {
  let network = getNetwork();

  let questChain = new QuestChain(event.params.questChain.toHexString());

  log.info('handleNewQuestChain {}', [event.params.questChain.toHexString()]);

  let user = getUser(event.transaction.from);

  questChain.address = event.params.questChain;
  questChain.factoryAddress = event.address;
  questChain.createdAt = event.block.timestamp;
  questChain.updatedAt = event.block.timestamp;
  questChain.createdBy = user.id;
  questChain.creationTxHash = event.transaction.hash;
  questChain.chainId = network;
  questChain.owners = new Array<string>();
  questChain.admins = new Array<string>();
  questChain.editors = new Array<string>();
  questChain.reviewers = new Array<string>();

  questChain.questsPassed = new Array<string>();
  questChain.questsFailed = new Array<string>();
  questChain.questsInReview = new Array<string>();

  QuestChainTemplate.create(event.params.questChain);

  user.save();
  questChain.save();
}

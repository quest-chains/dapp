import { log } from '@graphprotocol/graph-ts';
import { QuestChainToken, QuestChain, Global } from '../types/schema';

import {
  QuestChainCreated as QuestChainCreatedEvent,
  QuestChainImplUpdated as QuestChainImplUpdatedEvent,
  QuestChainFactory,
} from '../types/QuestChainFactory/QuestChainFactory';
import {
  QuestChain as QuestChainTemplate,
  QuestChainToken as QuestChainTokenTemplate,
} from '../types/templates';

import { getUser, getNetwork } from './helpers';

export function handleQuestChainImplUpdated(
  event: QuestChainImplUpdatedEvent,
): void {
  let network = getNetwork();
  let globalNode = Global.load(network);
  if (globalNode == null) {
    globalNode = new Global(network);
    globalNode.factoryAddress = event.address;
    let contract = QuestChainFactory.bind(event.address);
    let tokenAddress = contract.questChainToken();
    globalNode.tokenAddress = tokenAddress;

    QuestChainTokenTemplate.create(tokenAddress);
  }

  globalNode.implAddress = event.params.newImpl;
  globalNode.save();
}

export function handleQuestChainCreated(event: QuestChainCreatedEvent): void {
  let network = getNetwork();

  let questChain = new QuestChain(event.params.questChain.toHexString());

  log.info('handleQuestChainCreated {}', [
    event.params.questChain.toHexString(),
  ]);

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

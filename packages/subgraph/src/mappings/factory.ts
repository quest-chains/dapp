import { log, dataSource } from '@graphprotocol/graph-ts';
import { QuestChain } from '../types/schema';

import { NewQuestChain as NewQuestChainEvent } from '../types/QuestChainFactoryVersion00/QuestChainFactory';
import { QuestChain as QuestChainTemplate } from '../types/templates';

import { getUser } from './helpers';

export function handleNewQuestChain(event: NewQuestChainEvent): void {
  let questChain = new QuestChain(event.params.questChain.toHexString());

  log.info('handleNewQuestChain {}', [event.params.questChain.toHexString()]);

  let user = getUser(event.transaction.from);

  questChain.address = event.params.questChain;
  questChain.factoryAddress = event.address;
  questChain.createdAt = event.block.timestamp;
  questChain.createdBy = user.id;
  questChain.creationTxHash = event.transaction.hash;
  questChain.network = dataSource.network();
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

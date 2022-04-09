import { log } from '@graphprotocol/graph-ts';
import {
  QuestChainEdit,
  Quest,
  QuestChain,
  QuestEdit,
  QuestStatus,
} from '../types/schema';

import {
  QuestChainCreated as QuestChainCreatedEvent,
  QuestChainEdited as QuestChainEditedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  QuestCreated as QuestCreatedEvent,
  QuestEdited as QuestEditedEvent,
  QuestProofSubmitted as QuestProofSubmittedEvent,
  QuestProofReviewed as QuestProofReviewedEvent,
} from '../types/templates/QuestChain/QuestChain';
import { fetchMetadata, getRoles, getUser, removeFromArray } from './helpers';

export function handleChainCreated(event: QuestChainCreatedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    log.info('handleChainCreated {}', [event.address.toHexString()]);

    let details = event.params.details;
    let metadata = fetchMetadata(details);
    questChain.details = details;
    questChain.name = metadata.name;
    questChain.description = metadata.description;
    questChain.imageUrl = metadata.imageUrl;
    questChain.externalUrl = metadata.externalUrl;

    questChain.save();
  }
}

export function handleChainEdited(event: QuestChainEditedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    log.info('handleChainEdited {}', [event.address.toHexString()]);

    let questChainEditId = event.address
      .toHexString()
      .concat('-')
      .concat(event.block.timestamp.toHexString())
      .concat('-')
      .concat(event.logIndex.toHexString());

    let user = getUser(event.params.editor);

    let questChainEdit = new QuestChainEdit(questChainEditId);
    questChainEdit.details = questChain.details;
    questChainEdit.name = questChain.name;
    questChainEdit.description = questChain.description;
    questChainEdit.imageUrl = questChain.imageUrl;
    questChainEdit.externalUrl = questChain.externalUrl;
    questChainEdit.timestamp = event.block.timestamp;
    questChainEdit.questChain = questChain.id;
    questChainEdit.editor = user.id;
    questChainEdit.save();

    let details = event.params.details;
    let metadata = fetchMetadata(details);
    questChain.details = details;
    questChain.name = metadata.name;
    questChain.description = metadata.description;
    questChain.imageUrl = metadata.imageUrl;
    questChain.externalUrl = metadata.externalUrl;

    questChain.save();
  }
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    let user = getUser(event.params.account);
    let roles = getRoles(event.address);
    if (event.params.role == roles[0]) {
      // ADMIN
      let newArray = questChain.admins;
      newArray.push(user.id);
      questChain.admins = newArray;
    } else if (event.params.role == roles[1]) {
      // EDITOR
      let newArray = questChain.editors;
      newArray.push(user.id);
      questChain.editors = newArray;
    } else if (event.params.role == roles[2]) {
      // REVIEWER
      let newArray = questChain.reviewers;
      newArray.push(user.id);
      questChain.reviewers = newArray;
    }
    user.save();
    questChain.save();
  }
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    let user = getUser(event.params.account);
    let roles = getRoles(event.address);
    if (event.params.role == roles[0]) {
      // ADMIN
      let admins = questChain.admins;
      let newArray = removeFromArray(admins, user.id);
      questChain.admins = newArray;
    } else if (event.params.role == roles[1]) {
      // EDITOR
      let editors = questChain.admins;
      let newArray = removeFromArray(editors, user.id);
      questChain.editors = newArray;
    } else if (event.params.role == roles[2]) {
      // REVIEWER
      let reviewers = questChain.admins;
      let newArray = removeFromArray(reviewers, user.id);
      questChain.reviewers = newArray;
    }
    user.save();
    questChain.save();
  }
}

export function handleCreated(event: QuestCreatedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    let questId = event.address
      .toHexString()
      .concat('-')
      .concat(event.params.questId.toHexString());
    let quest = new Quest(questId);
    quest.questChain = event.address.toHexString();
    quest.questId = event.params.questId;

    let details = event.params.details;
    let metadata = fetchMetadata(details);
    quest.details = details;
    quest.name = metadata.name;
    quest.description = metadata.description;
    quest.imageUrl = metadata.imageUrl;
    quest.externalUrl = metadata.externalUrl;

    let user = getUser(event.params.creator);
    quest.createdAt = event.block.timestamp;
    quest.createdBy = user.id;
    user.save();

    quest.usersPassed = new Array<string>();
    quest.usersFailed = new Array<string>();
    quest.usersInReview = new Array<string>();

    quest.save();
  }
}

export function handleEdited(event: QuestEditedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    let questId = event.address
      .toHexString()
      .concat('-')
      .concat(event.params.questId.toHexString());
    let quest = Quest.load(questId);
    if (quest != null) {
      let questEditId = questId
        .concat('-')
        .concat(event.block.timestamp.toHexString())
        .concat('-')
        .concat(event.logIndex.toHexString());

      let user = getUser(event.params.editor);

      let questEdit = new QuestEdit(questEditId);
      questEdit.details = quest.details;
      questEdit.name = quest.name;
      questEdit.description = quest.description;
      questEdit.imageUrl = quest.imageUrl;
      questEdit.externalUrl = quest.externalUrl;
      questEdit.timestamp = event.block.timestamp;
      questEdit.quest = quest.id;
      questEdit.editor = user.id;
      questEdit.save();

      let details = event.params.details;
      let metadata = fetchMetadata(details);
      quest.details = details;
      quest.name = metadata.name;
      quest.description = metadata.description;
      quest.imageUrl = metadata.imageUrl;
      quest.externalUrl = metadata.externalUrl;

      quest.editedAt = event.block.timestamp;
      quest.editedBy = user.id;

      user.save();
      quest.save();
    }
  }
}

export function handleProofSubmitted(event: QuestProofSubmittedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    let questId = event.address
      .toHexString()
      .concat('-')
      .concat(event.params.questId.toHexString());
    let quest = Quest.load(questId);
    if (quest != null) {
      let user = getUser(event.params.quester);

      let questStatusId = questId.concat('-').concat(user.id);
      let questStatus = QuestStatus.load(questStatusId);
      if (questStatus == null) {
        questStatus = new QuestStatus(questStatusId);
        questStatus.quest = quest.id;
        questStatus.user = user.id;
      } else {
        let questsFailed = user.questsFailed;
        let newArray = removeFromArray(questsFailed, questStatusId);
        user.questsFailed = newArray;

        let usersFailed = quest.usersFailed;
        newArray = removeFromArray(usersFailed, questStatusId);
        quest.usersFailed = newArray;
      }

      let usersInReview = quest.usersInReview;
      usersInReview.push(questStatus.id);
      quest.usersInReview = usersInReview;

      let questsInReview = user.questsInReview;
      questsInReview.push(questStatus.id);
      user.questsInReview = questsInReview;

      questStatus.status = 'review';
      questStatus.save();
      user.save();
      quest.save();
    }
  }
}

export function handleProofReviewed(event: QuestProofReviewedEvent): void {
  let questChain = QuestChain.load(event.address.toHexString());
  if (questChain != null) {
    let questId = event.address
      .toHexString()
      .concat('-')
      .concat(event.params.questId.toHexString());
    let quest = Quest.load(questId);
    if (quest != null) {
      let user = getUser(event.params.quester);

      let questStatusId = questId.concat('-').concat(user.id);
      let questStatus = QuestStatus.load(questStatusId);
      if (questStatus == null) {
        questStatus = new QuestStatus(questStatusId);
        questStatus.quest = quest.id;
        questStatus.user = user.id;
      }

      let usersInReview = quest.usersInReview;
      let newArray = removeFromArray(usersInReview, questStatusId);
      quest.usersInReview = newArray;

      let questsInReview = user.questsInReview;
      newArray = removeFromArray(questsInReview, questStatusId);
      user.questsInReview = newArray;

      if (event.params.success) {
        questStatus.status = 'pass';
        let questsPassed = user.questsPassed;
        questsPassed.push(questStatusId);
        user.questsPassed = questsPassed;

        let usersPassed = quest.usersPassed;
        usersPassed.push(questStatusId);
        quest.usersPassed = usersPassed;
      } else {
        questStatus.status = 'fail';
        let questsFailed = user.questsFailed;
        questsFailed.push(questStatusId);
        user.questsFailed = questsFailed;

        let usersFailed = quest.usersFailed;
        usersFailed.push(questStatusId);
        quest.usersFailed = usersFailed;
      }

      questStatus.save();
      user.save();
      quest.save();
    }
  }
}

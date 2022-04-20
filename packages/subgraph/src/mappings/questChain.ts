import { log } from '@graphprotocol/graph-ts';
import {
  QuestChainEdit,
  Quest,
  QuestChain,
  QuestEdit,
  QuestStatus,
  ProofSubmission,
  ReviewSubmission,
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
import {
  createSearchString,
  fetchMetadata,
  getRoles,
  getUser,
  removeFromArray,
} from './helpers';

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

    let search = createSearchString(metadata.name, metadata.description);
    questChain.search = search;

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
    questChainEdit.txHash = event.transaction.hash;
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
    questChain.editedBy = user.id;
    questChain.editedAt = event.block.timestamp;
    questChain.updatedAt = event.block.timestamp;

    let search = createSearchString(metadata.name, metadata.description);
    questChain.search = search;

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
    quest.creationTxHash = event.transaction.hash;

    let search = createSearchString(metadata.name, metadata.description);
    quest.search = search;

    let user = getUser(event.params.creator);
    quest.createdAt = event.block.timestamp;
    quest.updatedAt = event.block.timestamp;
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
      questEdit.txHash = event.transaction.hash;
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
      quest.editedBy = user.id;
      quest.editedAt = event.block.timestamp;
      quest.updatedAt = event.block.timestamp;

      let search = createSearchString(metadata.name, metadata.description);
      quest.search = search;

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
        questStatus.questChain = questChain.id;
        questStatus.quest = quest.id;
        questStatus.user = user.id;
        questStatus.submissions = new Array<string>();
      } else {
        let questsFailed = questChain.questsFailed;
        let newArray = removeFromArray(questsFailed, questStatusId);
        questChain.questsFailed = newArray;

        questsFailed = user.questsFailed;
        newArray = removeFromArray(questsFailed, questStatusId);
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

      questsInReview = questChain.questsInReview;
      questsInReview.push(questStatus.id);
      questChain.questsInReview = questsInReview;

      questStatus.status = 'review';

      let proofId = questStatus.id
        .concat('-')
        .concat('proof')
        .concat('-')
        .concat(event.block.timestamp.toHexString())
        .concat('-')
        .concat(event.logIndex.toHexString());
      let proof = new ProofSubmission(proofId);
      let details = event.params.proof;
      let metadata = fetchMetadata(details);
      proof.details = details;
      proof.name = metadata.name;
      proof.description = metadata.description;
      proof.imageUrl = metadata.imageUrl;
      proof.externalUrl = metadata.externalUrl;

      proof.quest = quest.id;
      proof.questChain = questChain.id;
      proof.questStatus = questStatus.id;

      proof.timestamp = event.block.timestamp;
      proof.txHash = event.transaction.hash;
      proof.user = user.id;

      let search = createSearchString(metadata.name, metadata.description);
      proof.search = search;

      let submissions = questStatus.submissions;
      submissions.push(proof.id);
      questStatus.submissions = submissions;

      proof.save();
      questStatus.updatedAt = event.block.timestamp;
      questStatus.save();
      user.save();
      quest.save();
      questChain.save();
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
        questStatus.questChain = questChain.id;
        questStatus.quest = quest.id;
        questStatus.user = user.id;
      }

      let usersInReview = quest.usersInReview;
      let newArray = removeFromArray(usersInReview, questStatusId);
      quest.usersInReview = newArray;

      let questsInReview = user.questsInReview;
      newArray = removeFromArray(questsInReview, questStatusId);
      user.questsInReview = newArray;

      questsInReview = questChain.questsInReview;
      newArray = removeFromArray(questsInReview, questStatusId);
      questChain.questsInReview = newArray;

      if (event.params.success) {
        questStatus.status = 'pass';

        let questsPassed = questChain.questsPassed;
        questsPassed.push(questStatusId);
        questChain.questsPassed = questsPassed;

        questsPassed = user.questsPassed;
        questsPassed.push(questStatusId);
        user.questsPassed = questsPassed;

        let usersPassed = quest.usersPassed;
        usersPassed.push(questStatusId);
        quest.usersPassed = usersPassed;
      } else {
        questStatus.status = 'fail';

        let questsFailed = questChain.questsFailed;
        questsFailed.push(questStatusId);
        questChain.questsFailed = questsFailed;

        questsFailed = user.questsFailed;
        questsFailed.push(questStatusId);
        user.questsFailed = questsFailed;

        let usersFailed = quest.usersFailed;
        usersFailed.push(questStatusId);
        quest.usersFailed = usersFailed;
      }

      let reviewId = questStatus.id
        .concat('-')
        .concat('review')
        .concat('-')
        .concat(event.block.timestamp.toHexString())
        .concat('-')
        .concat(event.logIndex.toHexString());
      let review = new ReviewSubmission(reviewId);
      let details = event.params.details;
      let metadata = fetchMetadata(details);
      review.details = details;
      review.name = metadata.name;
      review.description = metadata.description;
      review.imageUrl = metadata.imageUrl;
      review.externalUrl = metadata.externalUrl;

      review.quest = quest.id;
      review.questChain = questChain.id;
      review.questStatus = questStatus.id;

      review.accepted = event.params.success;

      let submissions = questStatus.submissions;
      if (submissions.length > 0) {
        let lastSubmission = submissions[submissions.length - 1];
        review.proof = lastSubmission;
      }

      review.timestamp = event.block.timestamp;
      review.txHash = event.transaction.hash;
      review.user = user.id;
      let reviewer = getUser(event.params.reviewer);
      review.reviewer = reviewer.id;

      let search = createSearchString(metadata.name, metadata.description);
      review.search = search;

      review.save();
      reviewer.save();
      questStatus.updatedAt = event.block.timestamp;
      questStatus.save();
      user.save();
      quest.save();
      questChain.save();
    }
  }
}

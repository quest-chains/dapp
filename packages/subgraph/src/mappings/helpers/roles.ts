import { Bytes, Address } from '@graphprotocol/graph-ts';
import { QuestChainV0 as QuestChainContract } from '../../types/templates/QuestChainV0/QuestChainV0';

export function getRoles(address: Address): Bytes[] {
  let chain = QuestChainContract.bind(address);
  let try_OWNER_ROLE = chain.try_OWNER_ROLE();
  let try_ADMIN_ROLE = chain.try_ADMIN_ROLE();
  let try_EDITOR_ROLE = chain.try_EDITOR_ROLE();
  let try_REVIEWER_ROLE = chain.try_REVIEWER_ROLE();
  return [
    try_OWNER_ROLE.reverted ? Bytes.fromI32(0) : try_OWNER_ROLE.value,
    try_ADMIN_ROLE.reverted ? Bytes.fromI32(0) : try_ADMIN_ROLE.value,
    try_EDITOR_ROLE.reverted ? Bytes.fromI32(0) : try_EDITOR_ROLE.value,
    try_REVIEWER_ROLE.reverted ? Bytes.fromI32(0) : try_REVIEWER_ROLE.value,
  ];
}

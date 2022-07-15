import { Address } from '@graphprotocol/graph-ts';
import { User } from '../../types/schema';

export function getUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (user == null) {
    user = new User(address.toHexString());
    user.questsPassed = new Array<string>();
    user.questsFailed = new Array<string>();
    user.questsInReview = new Array<string>();
  }
  return user as User;
}

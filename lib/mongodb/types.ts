import { WithId } from 'mongodb';

type Maybe<T> = T | null | undefined;

export type MongoUser = WithId<{
  address: string;
  createdAt: Date;
  updatedAt: Date;
  username: Maybe<string>;
  email: Maybe<string>;
  isAdmin: Maybe<boolean>;
  profilePicture: Maybe<string>;
  verified: Maybe<boolean>;
}>;

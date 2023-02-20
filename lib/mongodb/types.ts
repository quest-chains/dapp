import { WithId } from 'mongodb';

type Maybe<T> = T | null | undefined;

export type MongoUser = WithId<{
  address: string;
  createdAt: Date;
  updatedAt: Date;
  username: Maybe<string>;
  avatarUri: Maybe<string>;
  email: Maybe<string>;
  isAdmin: Maybe<boolean>;
  verified: Maybe<boolean>;
}>;

export type MongoCategory = WithId<{
  value: string;
  label: string;
  description: Maybe<string>;
}>;

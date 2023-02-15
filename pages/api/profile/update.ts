import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { authHandler } from '@/lib/authHandler';
import clientPromise from '@/lib/mongodb/client';
import { MongoUser } from '@/lib/mongodb/types';

const USERNAME_REGEX = /^[A-Za-z0-9]+(?:[_\-\.][A-Za-z0-9]+)*$/;
const URI_REGEX = /^(ipfs|http|https):\/\/[^ "]+$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDuplicateKeyError = (error: any, key: string): boolean => {
  if (error?.code !== 11000 || error?.codeName !== 'DuplicateKey') return false;
  if (!error?.keyValue?.[key]) return false;
  return true;
};

export const updateProfile = authHandler(
  async (user: MongoUser, req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') return res.status(405).end();

    const { username, avatarUri } = req.body;

    if (
      typeof username !== 'string' ||
      !username ||
      username.length < 3 ||
      username.length > 30 ||
      !USERNAME_REGEX.test(username)
    )
      return res.status(400).json({ error: 'invalid username string' });

    if (
      typeof avatarUri !== 'string' ||
      !avatarUri ||
      !URI_REGEX.test(avatarUri)
    )
      return res.status(400).json({ error: 'invalid avatar uri' });

    const client = await clientPromise;
    const usersCollection = client.collection('users');

    try {
      const updatedUser = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        { $set: { username, avatarUri } },
        { returnDocument: 'after' },
      );

      return res.status(200).json(updatedUser.value);
    } catch (error) {
      console.error('Error updating user:', error);
      if (isDuplicateKeyError(error, 'username')) {
        return res
          .status(406)
          .json({ error: `username "${username}" already exists` });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  },
);

export default updateProfile;

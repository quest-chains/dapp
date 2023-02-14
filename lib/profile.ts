import { utils } from 'ethers';

import clientPromise from '@/lib/mongodb/client';
import { MongoUser } from '@/lib/mongodb/types';

export const fetchProfileFromName = async (
  name: string | string[] | undefined,
): Promise<{ status: number; user: MongoUser | null }> => {
  if (typeof name !== 'string' || !name)
    return {
      status: 400,
      user: null,
    };

  const query: { address?: string; username?: string } = {};
  if (utils.isAddress(name)) {
    query.address = name.toLowerCase();
  } else if (name.length >= 3) {
    query.username = name;
  } else
    return {
      status: 400,
      user: null,
    };

  try {
    const client = await clientPromise;
    const usersCollection = client.collection('users');

    const user = (await usersCollection.findOne(query, {
      projection: { address: 1, username: 1, avatarUri: 1 },
    })) as MongoUser | null;

    if (!user)
      return {
        status: 404,
        user: null,
      };

    return {
      status: 200,
      user,
    };
  } catch (error) {
    console.error('Error finding user:', error);
    return {
      status: 500,
      user: null,
    };
  }
};

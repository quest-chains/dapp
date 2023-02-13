import { utils } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '@/lib/mongodb/client';

export const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const { addressOrUsername } = req.query;

  if (typeof addressOrUsername !== 'string' || !addressOrUsername)
    return res.status(400).end();

  const query: { address?: string; username?: string } = {};
  if (utils.isAddress(addressOrUsername)) {
    query.address = addressOrUsername.toLowerCase();
  } else if (addressOrUsername.length > 3) {
    query.username = addressOrUsername;
  } else return res.status(400).end();

  const client = await clientPromise;
  const usersCollection = client.collection('users');

  try {
    const user = await usersCollection.findOne(query, {
      projection: { address: 1, username: 1, avatarUri: 1 },
    });

    if (!user) res.status(404).end();

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).end();
  }
};

export default getProfile;

import { isAddress } from '@ethersproject/address';
import { NextApiRequest, NextApiResponse } from 'next';

import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb/client';

export const connect = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split('Bearer')?.pop()?.trim();

  if (!token) return res.status(401).end();

  const address = verifyToken(token);

  if (!address || !isAddress(address)) return res.status(401).end();

  const client = await clientPromise;

  const usersCollection = client.collection('users');

  const result = await usersCollection.findOneAndUpdate(
    { address },
    {
      $set: { updatedAt: new Date() },
      $setOnInsert: {
        createdAt: new Date(),
        address,
      },
    },
    { returnDocument: 'after', upsert: true },
  );

  if (result?.value) {
    return res.status(200).json(result.value);
  }
  return res.status(500).end();
};

export default connect;

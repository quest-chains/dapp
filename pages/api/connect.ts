import { utils } from 'ethers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb/client';

export const connect = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split('Bearer')?.pop()?.trim();

  if (!token) return res.status(401).end();

  const address = verifyToken(token);

  if (!address || !utils.isAddress(address)) return res.status(401).end();

  const client = await clientPromise;

  const usersCollection = client.collection('users');

  const user = await usersCollection.findOne({ address });
  if (user) {
    return res.status(200).json(user);
  }
  const newUser = {
    createdAt: new Date(),
    updatedAt: new Date(),
    address,
  };
  const { insertedId } = await usersCollection.insertOne(newUser);
  return res.status(200).json({ _id: new ObjectId(insertedId), ...newUser });
};

export default connect;

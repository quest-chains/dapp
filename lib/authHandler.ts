import { utils } from 'ethers';
import { Db } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '@/lib/mongodb/client';
import { MongoUser } from '@/lib/mongodb/types';

import { verifyToken } from './auth';
const { ENCRYPTION_SECRET } = process.env;

export const authHandler =
  (
    handler: (
      user: MongoUser,
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<unknown>,
  ) =>
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (!ENCRYPTION_SECRET) return res.status(405).end();
    let client: Db | null;
    try {
      client = await clientPromise;
    } catch (error) {
      return res.status(500).end();
    }
    try {
      const token = req.headers.authorization?.split('Bearer')?.pop()?.trim();

      if (!token) throw new Error('token not found');

      const address = verifyToken(token);

      if (!address || !utils.isAddress(address))
        throw new Error('invalid address');

      const user = (await client
        .collection('users')
        .findOne({ address })) as MongoUser | null;

      if (!user) throw new Error('user not found');
      return handler(user, req, res);
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(401).end();
    }
  };

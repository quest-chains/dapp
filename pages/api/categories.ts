import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '@/lib/mongodb/client';

export const getCategories = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'GET') return res.status(405).end();

  const client = await clientPromise;
  const categoriesCollection = client.collection('categories');

  try {
    const result = await categoriesCollection.find({}).toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'internal server error' });
  }
};

export default getCategories;

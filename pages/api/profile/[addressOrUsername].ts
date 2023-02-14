import { NextApiRequest, NextApiResponse } from 'next';

import { fetchProfileFromName } from '@/lib/profile';

export const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end();

  const { addressOrUsername } = req.query;

  const { status, user } = await fetchProfileFromName(addressOrUsername);

  if (user) return res.status(200).json(user);

  return res.status(status).end();
};

export default getProfile;

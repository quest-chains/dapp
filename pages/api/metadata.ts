import { NextApiRequest, NextApiResponse } from 'next';

import { uploadMetadata } from '@/lib';
import { WEB3_STORAGE_TOKEN } from '@/utils/constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { metadata } = req.body;
  if (req.method === 'POST') {
    try {
      if (!WEB3_STORAGE_TOKEN) {
        return res.status(500).json({ error: 'Missing web3.storage token' });
      }

      const hash = await uploadMetadata(metadata, WEB3_STORAGE_TOKEN);

      return res.json({ response: hash });
    } catch (err) {
      const status = 500;
      const msg = (err as Error).message;
      return res.status(status).json({ error: msg });
    }
  } else {
    return res
      .status(405)
      .json({ error: `Incorrect Method: ${req.method} (POST Supported)` });
  }
}

export default handler;

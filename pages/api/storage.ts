import Busboy from 'busboy';
import concat from 'concat-stream';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { Web3Storage } from 'web3.storage';

import { WEB3_STORAGE_TOKEN } from '@/utils/constants';

export const handler: (
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string>>,
) => Promise<void> = async (
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string>>,
) => {
  const storage = new Web3Storage({
    token: WEB3_STORAGE_TOKEN ?? '',
    endpoint: new URL('https://api.web3.storage'),
  });

  const busboy = Busboy({ headers: req.headers });
  const files: {
    name: string;
    stream: () => ReadableStream;
  }[] = [];

  busboy.on('file', async (fieldname: string, fileStream: Readable) => {
    fileStream.pipe(
      concat({ encoding: 'buffer' }, function (data) {
        const file = {
          name: fieldname,
          stream: () => Readable.from(data) as unknown as ReadableStream,
        };
        files.push(file);
      }),
    );
  });

  busboy.on('finish', async () => {
    try {
      if (files.length === 0) {
        throw new Error('No files uploaded.');
      }

      let cid = '';
      if (files.length > 1) {
        cid = await storage.put(files, { wrapWithDirectory: true });
      } else {
        // single files are uploaded directly
        cid = await storage.put(files, { wrapWithDirectory: false });
      }

      res.status(201).json({ response: cid });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.status(500).json({ error: (err as Error).message });
    }
  });
  req.pipe(busboy);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: false,
    externalResolver: true,
  },
};

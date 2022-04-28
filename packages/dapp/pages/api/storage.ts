import Busboy from 'busboy';
import * as fs from 'fs';
import { mkdtemp, rmdir, unlink } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import * as os from 'os';
import * as path from 'path';
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
  const storage = new Web3Storage({ token: WEB3_STORAGE_TOKEN ?? '' });
  const busboy = Busboy({ headers: req.headers });
  const files: { field: string; name: string }[] = [];

  busboy.on('file', async (fieldname: string, file: Readable) => {
    const field = path.basename(fieldname);
    const name = path.join(
      await mkdtemp(path.join(os.tmpdir(), `files-`)),
      fieldname,
    );
    files.push({ field, name });
    file.pipe(fs.createWriteStream(name));
  });

  busboy.on('finish', async () => {
    try {
      if (files.length === 0) {
        throw new Error('No files uploaded.');
      }

      const tmpFiles = files.map(({ field, name }) => ({
        name: field,
        stream: () =>
          (fs.createReadStream(name) as unknown) as ReadableStream<string>,
      }));
      const cid = await storage.put(tmpFiles);

      await Promise.all(
        files.map(async ({ name }) => {
          await unlink(name);
          await rmdir(path.dirname(name));
        }),
      );

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
  },
};

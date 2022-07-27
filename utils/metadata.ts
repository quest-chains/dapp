import axios from 'axios';

import { Metadata as MetadataType, validateSchema } from '@/lib';

export type Metadata = MetadataType;

export const uploadMetadataViaAPI = async (
  metadata: MetadataType,
): Promise<string> => {
  const valid = validateSchema(metadata);
  if (!valid) throw new Error('Invalid Metadata Schema');
  const res = await fetch('/api/metadata', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ metadata }),
  });
  const { response, error } = await res.json();
  if (error) throw new Error(error);

  return response;
};

export const uploadFilesViaAPI = async (
  files: File[] | FileList,
): Promise<string> => {
  const formData = new FormData();
  for (let i = 0; i < files.length; ++i) {
    formData.append(files[i].name, files[i]);
  }

  // const res = await fetch('/api/storage', {
  //   method: 'POST',
  //   body: formData,
  //   credentials: 'include',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
  // const { response, error } = await res.json();
  // if (error) throw new Error(error);

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
      Accept: 'application/json',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUploadProgress: (event: any) => {
      // eslint-disable-next-line no-console
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total),
      );
    },
  };
  const res = await axios.post('/api/storage', formData, config);

  const { response, error } = res.data;
  if (error) throw new Error(error);
  return response;
};

import { Metadata as MetadataType } from '@/../utils/dist/metadata';
import { validateSchema } from '@/../utils/dist/validate';

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

  const res = await fetch('/api/storage', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  const { response, error } = await res.json();
  if (error) throw new Error(error);

  return response;
};

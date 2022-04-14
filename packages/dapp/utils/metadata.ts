import { Metadata as MetadataType } from '@/../utils/dist';

export type Metadata = MetadataType;

export const uploadMetadataViaAPI = async (
  metadata: MetadataType,
): Promise<string> => {
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

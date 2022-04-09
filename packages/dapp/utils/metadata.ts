import { Metadata } from '@/../utils/dist';

export const uploadMetadata = async (metadata: Metadata): Promise<string> => {
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

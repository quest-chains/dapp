import { Metadata, uploadMetadata } from '@quest-chains/utils';
import Prompt from 'prompt-sync';

const prompt = Prompt({ sigint: true });

const token = process.env.WEB3_STORAGE_TOKEN;

async function main() {
  console.log(
    'Please provide the following information for creating a new metadata:',
  );
  let metadata: Metadata;

  let name = prompt('name: ');
  while (!name) {
    name = prompt('name: ');
  }

  let description = prompt('description: ');
  while (!description) {
    description = prompt('description: ');
  }

  metadata = { name, description };
  const image_url = prompt('image_url [optional]: ');
  if (image_url) metadata.image_url = image_url;
  const external_url = prompt('external_url [optional]: ');
  if (external_url) metadata.external_url = external_url;

  const hash = await uploadMetadata(metadata, token);
  const details = `ipfs://${hash}`;

  console.log('Successfully created metadata!');
  console.log('Metadata:', JSON.stringify(metadata, undefined, 2));
  console.log('URL:', details);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

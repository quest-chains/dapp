import { Metadata, uploadMetadata } from '@quest-chains/utils';
import fs from 'fs';
import { network } from 'hardhat';
import Prompt from 'prompt-sync';

import { awaitQuestChainAddress } from '../test/utils/helpers';
import { QuestChainFactory, QuestChainFactory__factory } from '../types';
import { DeploymentInfo, networkName, validateSetup } from './utils';

const prompt = Prompt({ sigint: true });

const token = process.env.WEB3_STORAGE_TOKEN;

async function main() {
  const [chainId, deployer] = await validateSetup();
  if (!deployer.provider) {
    throw new Error('Provider not found for network');
  }
  if (network.name === 'hardhat') {
    throw new Error('Network hardhat not supported');
  }

  console.log('Deploying a new QuestChain:', networkName[chainId]);

  const buffer: Buffer = fs.readFileSync(`deployments/${network.name}.json`);
  const jsonString = buffer.toString();
  const data: DeploymentInfo = JSON.parse(jsonString);

  const factory: QuestChainFactory = QuestChainFactory__factory.connect(
    data.factory,
    deployer,
  );

  let hasMetadata = prompt('Do you already have a metadata URL? [y/N]: ');
  while (!['', 'y', 'Y', 'n', 'N'].includes(hasMetadata)) {
    hasMetadata = prompt('Do you already have a metadata URL? [y/N]: ');
  }

  if (!hasMetadata) {
    hasMetadata = 'n';
  }
  hasMetadata = hasMetadata.toLowerCase();

  let details;
  if (hasMetadata === 'n') {
    console.log(
      'Please provide the following information for creating your Quest Chain:',
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

    console.log('Metadata:', JSON.stringify(metadata, undefined, 2));

    const hash = await uploadMetadata(metadata, token);
    details = `ipfs://${hash}`;
  } else {
    details = prompt('Please provide metadata URL: ');
  }

  console.log('The Metadata URL is:', details);
  console.log('Ready to create your Quest Chain!');
  prompt('Press any key to continue...');

  const tx = await factory.create(details, details);
  const receipt = await tx.wait();

  const address = await awaitQuestChainAddress(receipt);
  console.log('Successfully deployed a new Quest Chain:', address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

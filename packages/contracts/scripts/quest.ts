import { Metadata, uploadMetadata } from '@dao-quest/utils';
import fs from 'fs';
import { network } from 'hardhat';
import Prompt from 'prompt-sync';

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

  const hash = await uploadMetadata(metadata, token);
  const details = `ipfs://${hash}`;

  console.log({ hash, details });

  // const tx = await factory.create(deployer.address, detailsString);

  console.log(factory);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

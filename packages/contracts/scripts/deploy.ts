import fs from 'fs';
import { ethers, network, run } from 'hardhat';

const networkName: Record<number, string> = {
  1: 'Ethereum Mainnet',
  4: 'Rinkeby Testnet',
  137: 'Polygon Mainnet',
  80001: 'Mumbai Testnet',
  31337: 'Hardhat Chain',
};

const networkCurrency: Record<number, string> = {
  1: 'ETH',
  4: 'ETH',
  137: 'MATIC',
  80001: 'MATIC',
  31337: 'ETH',
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  if (!deployer.provider) {
    console.error('Provider not found for network');
    return;
  }
  const { chainId } = await deployer.provider.getNetwork();
  if (!Object.keys(networkName).includes(chainId.toString())) {
    console.error('Unsupported network');
    return;
  }
  console.log('Deploying QuestChainFactory:', networkName[chainId]);
  console.log('Account address:', address);
  console.log(
    'Account balance:',
    ethers.utils.formatEther(await deployer.provider.getBalance(address)),
    networkCurrency[chainId],
  );

  const QuestChain = await ethers.getContractFactory('QuestChain', {});
  const questChain = await QuestChain.deploy();
  await questChain.deployed();
  console.log('Implementation Address:', questChain.address);

  const QuestChainFactory = await ethers.getContractFactory(
    'QuestChainFactory',
  );
  const questChainFactory = await QuestChainFactory.deploy(questChain.address);
  await questChainFactory.deployed();
  console.log('Factory Address:', questChainFactory.address);

  const txHash = questChainFactory.deployTransaction.hash;
  console.log('Transaction Hash:', txHash);
  const receipt = await deployer.provider.getTransactionReceipt(txHash);
  console.log('Block Number:', receipt.blockNumber);

  const deploymentInfo = {
    network: network.name,
    factory: questChainFactory.address,
    implemention: questChain.address,
    txHash,
    blockNumber: receipt.blockNumber.toString(),
  };

  if (chainId === 31337) {
    return;
  }

  fs.writeFileSync(
    `deployments/${network.name}.json`,
    JSON.stringify(deploymentInfo, undefined, 2),
  );

  try {
    questChainFactory.deployTransaction.wait(10);
    console.log('Verifying Contracts...');
    const TASK_VERIFY = 'verify:verify';

    await run(TASK_VERIFY, {
      address: questChain.address,
      constructorArguments: [],
    });
    console.log('Verified Implementation');

    await run(TASK_VERIFY, {
      address: questChainFactory.address,
      constructorArguments: [questChain.address],
    });
    console.log('Verified Factory');
  } catch (err) {
    console.error('Error verifying contracts:', err);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

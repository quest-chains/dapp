import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { QuestChain } from '../types/QuestChain';
import { QuestChainFactory } from '../types/QuestChainFactory';
import { awaitQuestChainAddress, deploy, getContractAt } from './utils/helpers';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const EMPTY_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const DETAILS_STRING = 'ipfs://details';

describe('QuestChainFactory', () => {
  let questChain: QuestChain;
  let chainFactory: QuestChainFactory;
  let QuestChainFactory: ContractFactory;
  let signers: SignerWithAddress[];
  let chainAddress: string;
  let admin: string;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    questChain = await deploy<QuestChain>('QuestChain', {});

    QuestChainFactory = await ethers.getContractFactory('QuestChainFactory');

    chainFactory = (await QuestChainFactory.deploy(
      questChain.address,
    )) as QuestChainFactory;

    await chainFactory.deployed();
  });

  it('Should deploy with 0 questChainCount', async () => {
    const questChainCount = await chainFactory.questChainCount();
    expect(questChainCount).to.equal(0);
  });

  it('Should revert deploy if zero implementation', async () => {
    const tx = QuestChainFactory.deploy(ZERO_ADDRESS);
    await expect(tx).to.revertedWith('invalid implementation');
  });

  it('Should revert init for implementation', async () => {
    const tx = questChain.init(signers[0].address, DETAILS_STRING);
    await expect(tx).to.revertedWith(
      'Initializable: contract is already initialized',
    );
  });

  it('Should deploy a QuestChain', async () => {
    admin = signers[0].address;
    const tx = await chainFactory.create(admin, DETAILS_STRING);
    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(0, chainAddress);

    const chain = await getContractAt<QuestChain>('QuestChain', chainAddress);
    await expect(tx)
      .to.emit(chain, 'QuestChainCreated')
      .withArgs(admin, DETAILS_STRING);

    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chainAddress);
  });

  it('Should predict QuestChain address', async () => {
    admin = signers[0].address;

    const predictedAddress = await chainFactory.predictDeterministicAddress(
      EMPTY_BYTES32,
    );

    const tx = await chainFactory.createDeterministic(
      admin,
      DETAILS_STRING,
      EMPTY_BYTES32,
    );

    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(0, chainAddress);

    expect(chainAddress).to.equal(predictedAddress);
    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chainAddress);
  });

  it('Should update questChainCount', async () => {
    expect(await chainFactory.questChainCount()).to.equal(0);
    let tx = await chainFactory.create(admin, DETAILS_STRING);
    const chain0 = await awaitQuestChainAddress(await tx.wait());
    expect(await chainFactory.questChainCount()).to.equal(1);
    tx = await chainFactory.create(admin, DETAILS_STRING);
    const chain1 = await awaitQuestChainAddress(await tx.wait());
    expect(await chainFactory.questChainCount()).to.equal(2);

    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chain0);
    expect(await chainFactory.getQuestChainAddress(1)).to.equal(chain1);
  });
});

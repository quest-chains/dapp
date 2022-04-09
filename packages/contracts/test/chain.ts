import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { QuestChain } from '../types/QuestChain';
import { QuestChainFactory } from '../types/QuestChainFactory';
import { awaitQuestChainAddress, deploy, getContractAt } from './utils/helpers';

const DETAILS_STRING = 'ipfs://details';

describe('QuestChain', () => {
  let chain: QuestChain;
  let chainFactory: QuestChainFactory;
  let signers: SignerWithAddress[];
  let chainAddress: string;
  let ADMIN_ROLE: string;
  let EDITOR_ROLE: string;
  let REVIEWER_ROLE: string;
  let admin: SignerWithAddress;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const questChainImpl = await deploy<QuestChain>('QuestChain', {});

    [ADMIN_ROLE, EDITOR_ROLE, REVIEWER_ROLE] = await Promise.all([
      questChainImpl.ADMIN_ROLE(),
      questChainImpl.EDITOR_ROLE(),
      questChainImpl.REVIEWER_ROLE(),
    ]);

    const QuestChainFactory: ContractFactory = await ethers.getContractFactory(
      'QuestChainFactory',
    );

    chainFactory = (await QuestChainFactory.deploy(
      questChainImpl.address,
    )) as QuestChainFactory;

    await chainFactory.deployed();

    const tx = await chainFactory.create(signers[0].address, DETAILS_STRING);
    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(0, chainAddress);

    chain = await getContractAt<QuestChain>('QuestChain', chainAddress);
    admin = signers[0];

    await expect(tx)
      .to.emit(chain, 'QuestChainCreated')
      .withArgs(admin.address, DETAILS_STRING);
  });

  it('Should initialize correctly', async () => {
    expect(await chain.hasRole(ADMIN_ROLE, admin.address)).to.equal(true);
    expect(await chain.hasRole(EDITOR_ROLE, admin.address)).to.equal(true);
    expect(await chain.hasRole(REVIEWER_ROLE, admin.address)).to.equal(true);

    expect(await chain.getRoleAdmin(ADMIN_ROLE)).to.equal(ADMIN_ROLE);
    expect(await chain.getRoleAdmin(EDITOR_ROLE)).to.equal(ADMIN_ROLE);
    expect(await chain.getRoleAdmin(REVIEWER_ROLE)).to.equal(ADMIN_ROLE);

    expect(await chain.questCount()).to.equal(0);
  });

  describe('createQuest', async () => {
    it('Should create a new quest', async () => {
      const tx = await chain.createQuest(DETAILS_STRING);
      await tx.wait();
      await expect(tx)
        .to.emit(chain, 'QuestCreated')
        .withArgs(admin.address, 0, DETAILS_STRING);
      expect(await chain.questCount()).to.equal(1);
    });
  });
});

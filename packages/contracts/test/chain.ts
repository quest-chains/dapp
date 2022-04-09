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
  });

  it('Should initialize correctly', async () => {
    expect(await chain.hasRole(ADMIN_ROLE, admin.address)).to.equal(true);
    expect(await chain.hasRole(EDITOR_ROLE, admin.address)).to.equal(true);
    expect(await chain.hasRole(REVIEWER_ROLE, admin.address)).to.equal(true);
  });
});

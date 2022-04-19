import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { QuestChain, QuestChainFactory } from '../types';
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
  let ADMIN_ROLE: string;
  let EDITOR_ROLE: string;
  let REVIEWER_ROLE: string;
  let admin: string;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    admin = signers[0].address;

    questChain = await deploy<QuestChain>('QuestChain', {});

    [ADMIN_ROLE, EDITOR_ROLE, REVIEWER_ROLE] = await Promise.all([
      questChain.ADMIN_ROLE(),
      questChain.EDITOR_ROLE(),
      questChain.REVIEWER_ROLE(),
    ]);

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
    const tx = questChain.init(admin, DETAILS_STRING);
    await expect(tx).to.revertedWith(
      'Initializable: contract is already initialized',
    );
  });

  it('Should deploy a QuestChain', async () => {
    const tx = await chainFactory.create(DETAILS_STRING);
    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(0, chainAddress);

    const chain = await getContractAt<QuestChain>('QuestChain', chainAddress);
    await expect(tx)
      .to.emit(chain, 'QuestChainCreated')
      .withArgs(admin, DETAILS_STRING);

    expect(await chain.hasRole(ADMIN_ROLE, admin)).to.equal(true);
    expect(await chain.hasRole(EDITOR_ROLE, admin)).to.equal(true);
    expect(await chain.hasRole(REVIEWER_ROLE, admin)).to.equal(true);

    expect(await chain.getRoleAdmin(ADMIN_ROLE)).to.equal(ADMIN_ROLE);
    expect(await chain.getRoleAdmin(EDITOR_ROLE)).to.equal(ADMIN_ROLE);
    expect(await chain.getRoleAdmin(REVIEWER_ROLE)).to.equal(ADMIN_ROLE);

    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chainAddress);
  });

  it('Should deploy a QuestChain with roles', async () => {
    const editors = [signers[1].address, signers[2].address];
    const reviewers = [signers[2].address, signers[3].address];
    const tx = await chainFactory.createWithRoles(
      DETAILS_STRING,
      editors,
      reviewers,
    );
    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(0, chainAddress);

    const chain = await getContractAt<QuestChain>('QuestChain', chainAddress);
    await expect(tx)
      .to.emit(chain, 'QuestChainCreated')
      .withArgs(admin, DETAILS_STRING);

    await Promise.all(
      editors.map(async editor =>
        expect(await chain.hasRole(EDITOR_ROLE, editor)).to.equal(true),
      ),
    );
    await Promise.all(
      reviewers.map(async reviewer =>
        expect(await chain.hasRole(REVIEWER_ROLE, reviewer)).to.equal(true),
      ),
    );

    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chainAddress);
  });

  it('Should predict QuestChain address', async () => {
    admin = signers[0].address;

    const predictedAddress = await chainFactory.predictDeterministicAddress(
      EMPTY_BYTES32,
    );

    const tx = await chainFactory.createDeterministic(
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
    let tx = await chainFactory.create(DETAILS_STRING);
    const chain0 = await awaitQuestChainAddress(await tx.wait());
    expect(await chainFactory.questChainCount()).to.equal(1);
    tx = await chainFactory.create(DETAILS_STRING);
    const chain1 = await awaitQuestChainAddress(await tx.wait());
    expect(await chainFactory.questChainCount()).to.equal(2);

    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chain0);
    expect(await chainFactory.getQuestChainAddress(1)).to.equal(chain1);
  });
});

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { QuestChain, QuestChainFactory } from '../types';
import { awaitQuestChainAddress, deploy, getContractAt } from './utils/helpers';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const DETAILS_STRING = 'ipfs://details';

describe('QuestChainFactory', () => {
  let questChain: QuestChain;
  let chainFactory: QuestChainFactory;
  let QuestChainFactory: ContractFactory;
  let signers: SignerWithAddress[];
  let chainAddress: string;
  let OWNER_ROLE: string;
  let ADMIN_ROLE: string;
  let EDITOR_ROLE: string;
  let REVIEWER_ROLE: string;
  let owner: string;

  before(async () => {
    signers = await ethers.getSigners();
    owner = signers[0].address;

    questChain = await deploy<QuestChain>('QuestChain', {});

    [OWNER_ROLE, ADMIN_ROLE, EDITOR_ROLE, REVIEWER_ROLE] = await Promise.all([
      questChain.OWNER_ROLE(),
      questChain.ADMIN_ROLE(),
      questChain.EDITOR_ROLE(),
      questChain.REVIEWER_ROLE(),
    ]);

    QuestChainFactory = await ethers.getContractFactory('QuestChainFactory');

    chainFactory = (await QuestChainFactory.deploy(
      questChain.address,
    )) as QuestChainFactory;

    await chainFactory.deployed();

    expect(chainFactory.deployTransaction)
      .to.emit(chainFactory, 'QuestChainRootChanged')
      .withArgs(ZERO_ADDRESS, questChain.address);

    expect(OWNER_ROLE).to.equal(ZERO_BYTES32);
  });

  it('Should be initialized properly', async () => {
    expect(await chainFactory.questChainCount()).to.equal(0);
    expect(await chainFactory.owner()).to.equal(owner);
    expect(await chainFactory.cloneRoot()).to.equal(questChain.address);
  });

  it('Should revert change cloneRoot if zero address', async () => {
    const tx = chainFactory.updateCloneRoot(ZERO_ADDRESS);
    await expect(tx).to.revertedWith('QuestChainFactory: invalid cloneRoot');
  });

  it('Should revert change cloneRoot if not owner', async () => {
    const newQuestChain = await deploy<QuestChain>('QuestChain', {});
    const tx = chainFactory
      .connect(signers[1])
      .updateCloneRoot(newQuestChain.address);
    await expect(tx).to.revertedWith('Ownable: caller is not the owner');
  });

  it('Should change cloneRoot', async () => {
    const newQuestChain = await deploy<QuestChain>('QuestChain', {});
    const tx = await chainFactory.updateCloneRoot(newQuestChain.address);
    await tx.wait();
    await expect(tx)
      .to.emit(chainFactory, 'QuestChainRootChanged')
      .withArgs(questChain.address, newQuestChain.address);
    expect(await chainFactory.cloneRoot()).to.equal(newQuestChain.address);
  });

  it('Should revert init for cloneRoot', async () => {
    const tx = questChain.init(owner, DETAILS_STRING);
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
      .withArgs(owner, DETAILS_STRING);

    expect(await chain.hasRole(OWNER_ROLE, owner)).to.equal(true);
    expect(await chain.hasRole(ADMIN_ROLE, owner)).to.equal(true);
    expect(await chain.hasRole(EDITOR_ROLE, owner)).to.equal(true);
    expect(await chain.hasRole(REVIEWER_ROLE, owner)).to.equal(true);

    expect(await chain.getRoleAdmin(OWNER_ROLE)).to.equal(OWNER_ROLE);
    expect(await chain.getRoleAdmin(ADMIN_ROLE)).to.equal(OWNER_ROLE);
    expect(await chain.getRoleAdmin(EDITOR_ROLE)).to.equal(ADMIN_ROLE);
    expect(await chain.getRoleAdmin(REVIEWER_ROLE)).to.equal(ADMIN_ROLE);

    expect(await chainFactory.getQuestChainAddress(0)).to.equal(chainAddress);
  });

  it('Should deploy a QuestChain with roles', async () => {
    const admins = [signers[1].address, signers[2].address];
    const editors = [signers[2].address, signers[3].address];
    const reviewers = [signers[3].address, signers[4].address];
    const tx = await chainFactory.createWithRoles(
      DETAILS_STRING,
      admins,
      editors,
      reviewers,
    );
    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(1, chainAddress);

    const chain = await getContractAt<QuestChain>('QuestChain', chainAddress);
    await expect(tx)
      .to.emit(chain, 'QuestChainCreated')
      .withArgs(owner, DETAILS_STRING);

    await Promise.all(
      admins.map(async admin =>
        expect(await chain.hasRole(ADMIN_ROLE, admin)).to.equal(true),
      ),
    );
    await Promise.all(
      admins.map(async admin =>
        expect(await chain.hasRole(EDITOR_ROLE, admin)).to.equal(true),
      ),
    );
    await Promise.all(
      editors.map(async editor =>
        expect(await chain.hasRole(EDITOR_ROLE, editor)).to.equal(true),
      ),
    );
    await Promise.all(
      admins.map(async admin =>
        expect(await chain.hasRole(REVIEWER_ROLE, admin)).to.equal(true),
      ),
    );
    await Promise.all(
      editors.map(async editor =>
        expect(await chain.hasRole(REVIEWER_ROLE, editor)).to.equal(true),
      ),
    );
    await Promise.all(
      reviewers.map(async reviewer =>
        expect(await chain.hasRole(REVIEWER_ROLE, reviewer)).to.equal(true),
      ),
    );

    expect(await chainFactory.getQuestChainAddress(1)).to.equal(chainAddress);
  });

  it('Should predict QuestChain address', async () => {
    owner = signers[0].address;

    const predictedAddress = await chainFactory.predictDeterministicAddress(
      ZERO_BYTES32,
    );

    const tx = await chainFactory.createDeterministic(
      DETAILS_STRING,
      ZERO_BYTES32,
    );

    chainAddress = await awaitQuestChainAddress(await tx.wait());
    await expect(tx)
      .to.emit(chainFactory, 'NewQuestChain')
      .withArgs(2, chainAddress);

    expect(chainAddress).to.equal(predictedAddress);
    expect(await chainFactory.getQuestChainAddress(2)).to.equal(chainAddress);
  });

  it('Should update questChainCount', async () => {
    expect(await chainFactory.questChainCount()).to.equal(3);
    let tx = await chainFactory.create(DETAILS_STRING);
    const chain0 = await awaitQuestChainAddress(await tx.wait());
    expect(await chainFactory.questChainCount()).to.equal(4);
    tx = await chainFactory.create(DETAILS_STRING);
    const chain1 = await awaitQuestChainAddress(await tx.wait());
    expect(await chainFactory.questChainCount()).to.equal(5);

    expect(await chainFactory.getQuestChainAddress(3)).to.equal(chain0);
    expect(await chainFactory.getQuestChainAddress(4)).to.equal(chain1);
  });
});

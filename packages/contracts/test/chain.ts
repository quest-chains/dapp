import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { QuestChain, QuestChainFactory } from '../types';
import {
  awaitQuestChainAddress,
  deploy,
  getContractAt,
  Status,
} from './utils/helpers';

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

  before(async () => {
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

    const tx = await chainFactory.create(DETAILS_STRING);
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

  describe('editQuestChain', async () => {
    it('Should edit the quest chain', async () => {
      const NEW_DETAILS_STRING = 'ipfs://new-details-1';
      const tx = await chain.edit(NEW_DETAILS_STRING);
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestChainEdited')
        .withArgs(admin.address, NEW_DETAILS_STRING);
    });

    it('Should revert edit if not ADMIN', async () => {
      const NEW_DETAILS_STRING = 'ipfs://new-details-2';
      const tx = chain.connect(signers[1]).edit(NEW_DETAILS_STRING);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${signers[1].address.toLowerCase()} is missing role ${ADMIN_ROLE}`,
      );
    });

    it('Should edit if new ADMIN', async () => {
      await (await chain.grantRole(ADMIN_ROLE, signers[1].address)).wait();

      const NEW_DETAILS_STRING = 'ipfs://new-details-3';
      const tx = chain.connect(signers[1]).edit(NEW_DETAILS_STRING);

      await expect(tx)
        .to.emit(chain, 'QuestChainEdited')
        .withArgs(signers[1].address, NEW_DETAILS_STRING);
    });
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

    it('Should revert create if not EDITOR', async () => {
      const tx = chain.connect(signers[1]).createQuest(DETAILS_STRING);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${signers[1].address.toLowerCase()} is missing role ${EDITOR_ROLE}`,
      );
    });

    it('Should create if new EDITOR', async () => {
      await (await chain.grantRole(EDITOR_ROLE, signers[1].address)).wait();

      const tx = await chain.connect(signers[1]).createQuest(DETAILS_STRING);
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestCreated')
        .withArgs(signers[1].address, 1, DETAILS_STRING);
      expect(await chain.questCount()).to.equal(2);
      await (
        await chain.connect(signers[1]).createQuest(DETAILS_STRING)
      ).wait();
      await (
        await chain.connect(signers[1]).createQuest(DETAILS_STRING)
      ).wait();
      expect(await chain.questCount()).to.equal(4);
    });
  });

  describe('editQuest', async () => {
    it('Should edit a new quest', async () => {
      const tx = await chain.editQuest(0, DETAILS_STRING);
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestEdited')
        .withArgs(admin.address, 0, DETAILS_STRING);
    });

    it('Should revert edit if invalid questId', async () => {
      const tx = chain.editQuest(5, DETAILS_STRING);

      await expect(tx).to.be.revertedWith('QuestChain: quest not found');
    });

    it('Should revert edit if not EDITOR', async () => {
      const tx = chain.connect(signers[2]).editQuest(0, DETAILS_STRING);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${signers[2].address.toLowerCase()} is missing role ${EDITOR_ROLE}`,
      );
    });

    it('Should edit if new EDITOR', async () => {
      await (await chain.grantRole(EDITOR_ROLE, signers[2].address)).wait();

      const tx = await chain.connect(signers[2]).editQuest(0, DETAILS_STRING);
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestEdited')
        .withArgs(signers[2].address, 0, DETAILS_STRING);
    });
  });

  describe('submitProof', async () => {
    it('Should submitProof for a quest', async () => {
      const tx = await chain.submitProof(0, DETAILS_STRING);
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestProofSubmitted')
        .withArgs(admin.address, 0, DETAILS_STRING);
    });

    it('Should revert submitProof if invalid questId', async () => {
      const tx = chain.submitProof(5, DETAILS_STRING);

      await expect(tx).to.be.revertedWith('QuestChain: quest not found');
    });

    it('Should revert submitProof if already in review', async () => {
      const tx = chain.submitProof(0, DETAILS_STRING);

      await expect(tx).to.be.revertedWith('QuestChain: in review or passed');
    });

    it('Should revert submitProof if already accepted', async () => {
      await (
        await chain.reviewProof(admin.address, 0, true, DETAILS_STRING)
      ).wait();

      const tx = chain.submitProof(0, DETAILS_STRING);

      await expect(tx).to.be.revertedWith('QuestChain: in review or passed');
    });

    it('Should submitProof for a quest if already failed', async () => {
      await (await chain.submitProof(1, DETAILS_STRING)).wait();
      await (
        await chain.reviewProof(admin.address, 1, false, DETAILS_STRING)
      ).wait();

      const NEW_DETAILS_STRING = 'ipfs://new-details-1';
      const tx = await chain.submitProof(1, NEW_DETAILS_STRING);
      await tx.wait();
      await expect(tx)
        .to.emit(chain, 'QuestProofSubmitted')
        .withArgs(admin.address, 1, NEW_DETAILS_STRING);
    });
  });

  describe('reviewProof', async () => {
    it('Should accept reviewProof for a proof submission', async () => {
      expect(await chain.getStatus(signers[1].address, 0)).to.be.equal(
        Status.init,
      );
      await (
        await chain.connect(signers[1]).submitProof(0, DETAILS_STRING)
      ).wait();

      const tx = await chain.reviewProof(
        signers[1].address,
        0,
        true,
        DETAILS_STRING,
      );
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestProofReviewed')
        .withArgs(admin.address, signers[1].address, 0, true, DETAILS_STRING);
      expect(await chain.getStatus(signers[1].address, 0)).to.be.equal(
        Status.pass,
      );
    });

    it('Should reject reviewProof for a proof submission', async () => {
      expect(await chain.getStatus(signers[1].address, 1)).to.be.equal(
        Status.init,
      );
      await (
        await chain.connect(signers[1]).submitProof(1, DETAILS_STRING)
      ).wait();

      const tx = await chain.reviewProof(
        signers[1].address,
        1,
        false,
        DETAILS_STRING,
      );
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestProofReviewed')
        .withArgs(admin.address, signers[1].address, 1, false, DETAILS_STRING);
      expect(await chain.getStatus(signers[1].address, 1)).to.be.equal(
        Status.fail,
      );
    });

    it('Should revert reviewProof if invalid questId', async () => {
      const tx = chain.reviewProof(admin.address, 5, true, DETAILS_STRING);

      await expect(tx).to.be.revertedWith('QuestChain: quest not found');
    });

    it('Should revert reviewProof if quest not in review', async () => {
      const tx = chain.reviewProof(admin.address, 3, true, DETAILS_STRING);

      await expect(tx).to.be.revertedWith('QuestChain: quest not in review');
    });

    it('Should revert reviewProof if not REVIEWER', async () => {
      await (
        await chain.connect(signers[1]).submitProof(3, DETAILS_STRING)
      ).wait();
      const tx = chain
        .connect(signers[2])
        .reviewProof(signers[1].address, 3, true, DETAILS_STRING);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${signers[2].address.toLowerCase()} is missing role ${REVIEWER_ROLE}`,
      );
    });

    it('Should reviewProof if new REVIEWER', async () => {
      await (await chain.grantRole(REVIEWER_ROLE, signers[2].address)).wait();

      const tx = await chain
        .connect(signers[2])
        .reviewProof(signers[1].address, 3, false, DETAILS_STRING);
      await tx.wait();

      await expect(tx)
        .to.emit(chain, 'QuestProofReviewed')
        .withArgs(
          signers[2].address,
          signers[1].address,
          3,
          false,
          DETAILS_STRING,
        );
      expect(await chain.getStatus(signers[1].address, 3)).to.be.equal(
        Status.fail,
      );
    });
  });

  describe('getStatus', async () => {
    it('Should getStatus review after proof submission', async () => {
      expect(await chain.getStatus(signers[2].address, 0)).to.be.equal(
        Status.init,
      );
      await (
        await chain.connect(signers[2]).submitProof(0, DETAILS_STRING)
      ).wait();

      expect(await chain.getStatus(signers[2].address, 0)).to.be.equal(
        Status.review,
      );
    });

    it('Should getStatus pass for an accepted submission', async () => {
      expect(await chain.getStatus(signers[2].address, 0)).to.be.equal(
        Status.review,
      );

      await (
        await chain.reviewProof(signers[2].address, 0, true, DETAILS_STRING)
      ).wait();

      expect(await chain.getStatus(signers[2].address, 0)).to.be.equal(
        Status.pass,
      );
    });

    it('Should getStatus fail for a rejected submission', async () => {
      expect(await chain.getStatus(signers[2].address, 1)).to.be.equal(
        Status.init,
      );
      await (
        await chain.connect(signers[2]).submitProof(1, DETAILS_STRING)
      ).wait();

      expect(await chain.getStatus(signers[2].address, 1)).to.be.equal(
        Status.review,
      );

      await (
        await chain.reviewProof(signers[2].address, 1, false, DETAILS_STRING)
      ).wait();

      expect(await chain.getStatus(signers[2].address, 1)).to.be.equal(
        Status.fail,
      );
    });

    it('Should revert getStatus if invalid questId', async () => {
      const tx = chain.getStatus(admin.address, 5);

      await expect(tx).to.be.revertedWith('QuestChain: quest not found');
    });
  });
});

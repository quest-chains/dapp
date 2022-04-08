import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { Hello } from '../types/Hello';

describe('Hello', () => {
  let hello: Hello;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const HelloFactory: ContractFactory = await ethers.getContractFactory(
      'Hello',
    );

    hello = (await HelloFactory.deploy()) as unknown as Hello;

    await hello.deployed();
  });

  it('Should init', async () => {
    expect(await hello.message()).to.equal('');
  });

  it('Should set message', async () => {
    const msg = 'Hello World!';
    await hello.connect(signers[1]).set(msg);
    expect(await hello.message()).to.equal(msg);
  });
});

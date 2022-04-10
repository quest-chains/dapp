/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Button, Flex, Input, Spinner, Text } from '@chakra-ui/react';
import { Framework } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

// let account;

//where the Superfluid logic takes place
async function createNewFlow(recipient: string, flowRate: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  const DAIx = '0xe3cb950cb164a31c66e32c320a800d477019dcff';

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: recipient,
      flowRate: flowRate,
      superToken: DAIx,
      // userData?: string
    });

    console.log('Creating your stream...');

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Kovan
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `,
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!",
    );
    console.error(error);
  }
}

type CreateFlowProps = { ownerAddress: string };

export const CreateFlow = ({ ownerAddress }: CreateFlowProps) => {
  const [recipient, setRecipient] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState('');
  const [flowRateDisplay, setFlowRateDisplay] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const chain = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = chain;
    console.log('chain ID:', chain);
    console.log('global Chain Id:', chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log('No authorized account found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function calculateFlowRate(amount: any) {
    if (typeof Number(amount) !== 'number' || isNaN(Number(amount)) === true) {
      alert('You can only calculate a flowRate based on a number');
      return;
    } else if (typeof Number(amount) === 'number') {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = Number(monthlyAmount) * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  function CreateButton({
    isLoading,
    children,
    onClick,
    ...props
  }: {
    isLoading: boolean;
    children: any;
    props?: any;
    onClick: () => void;
  }) {
    return (
      <Button {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleFlowRateChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFlowRate(e.target.value);
    const newFlowRateDisplay = calculateFlowRate(e.target.value) || 0;
    setFlowRateDisplay(newFlowRateDisplay.toString());
  };

  return (
    <div>
      <Text>Limit Reached!</Text>
      <Text mb={4}>Select a plan to continue creating quests:</Text>

      <Flex justifyContent="space-between" mb={4}>
        <Box p={4} boxShadow="inset 0px 0px 0px 1px #AD90FF" borderRadius={20}>
          <Text>Free Plan</Text>
          <Text>up to 5 quests</Text>
        </Box>
        <Box p={4} boxShadow="inset 0px 0px 0px 1px #2DF8C7" borderRadius={20}>
          <Text>Basic Plan</Text>
          <Text>5 - 20 quests</Text>
        </Box>
        <Box p={4} boxShadow="inset 0px 0px 0px 1px #ff7038" borderRadius={20}>
          <Text>Premium plan</Text>
          <Text>20 - ∞ quests</Text>
        </Box>
      </Flex>

      {currentAccount === '' && (
        <Button id="connectWallet" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
      <Input
        name="recipient"
        value={ownerAddress}
        placeholder="Enter recipient address"
        mb={4}
      ></Input>
      <Input
        name="flowRate"
        value={flowRate}
        onChange={handleFlowRateChange}
        placeholder="Enter a flowRate in wei/second"
      ></Input>
      <Button
        onClick={() => {
          setIsButtonLoading(true);
          createNewFlow(ownerAddress, flowRate);
          setTimeout(() => {
            setIsButtonLoading(false);
          }, 1000);
        }}
        my={4}
      >
        {isButtonLoading ? (
          <Spinner animation="border" />
        ) : (
          'Click to Create Your Stream'
        )}
      </Button>

      <Box
        mb={2}
        boxShadow="inset 0px 0px 0px 1px #AD90FF"
        p={4}
        borderRadius={20}
        _hover={{
          background: 'whiteAlpha.100',
        }}
      >
        <p>Your flow will be equal to:</p>
        <p>
          <b>${flowRateDisplay !== ' ' ? flowRateDisplay : 0}</b> DAIx/month
        </p>
      </Box>
    </div>
  );
};

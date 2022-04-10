/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Button, Flex, Input, Spinner, Text } from '@chakra-ui/react';
import { Framework } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { DAIx, DAOQUEST_ADDRESS } from '@/utils/constants';
// let account;

//where the Superfluid logic takes place
async function createNewFlow(recipient: string, flowRatePerSecond: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: recipient,
      flowRate: flowRatePerSecond,
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
    FlowRate: ${flowRatePerSecond}
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
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRatePerYear, setFlowRatePerYear] = useState('');
  const [flowRatePerSecond, setFlowRatePerSecond] = useState('');
  const [flowRateDisplay, setFlowRateDisplay] = useState('');

  function calculateFlowRate(amount: any) {
    console.log('amount', amount);
    if (typeof Number(amount) !== 'number' || isNaN(Number(amount)) === true) {
      alert('You can only calculate a flowRate based on a number');
      return;
    } else if (typeof Number(amount) === 'number') {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(
        Math.trunc(Number(amount) / (3600 * 24 * 30 * 12)),
      );
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = Number(monthlyAmount) * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  const handlePlanChange = (plan: string, rate: string) => {
    console.log('rate', rate);
    setPlan(plan);
    setFlowRatePerYear(rate);
    setFlowRatePerSecond(
      String(Math.trunc(Number(rate) / (3600 * 24 * 30 * 12))),
    );
    const newFlowRateDisplay = calculateFlowRate(rate) || 0;

    setFlowRateDisplay(newFlowRateDisplay.toString());
  };

  const [plan, setPlan] = useState('');

  return (
    <div>
      <Text>Limit Reached!</Text>
      <Text mb={4}>Select a plan to continue creating quests:</Text>

      <Flex justifyContent="space-between" mb={4} gap={3}>
        <Box
          cursor="pointer"
          p={4}
          boxShadow="inset 0px 0px 0px 1px #AD90FF"
          borderRadius={20}
          onClick={() => {
            handlePlanChange('free', String(0));
          }}
          backgroundColor={plan === 'free' ? '#352859' : 'transparent'}
        >
          <Text fontSize={20} mb={3}>
            Free Plan
          </Text>
          <Text> &gt; 5 quests</Text>
        </Box>
        <Box
          cursor="pointer"
          p={4}
          boxShadow="inset 0px 0px 0px 1px #2DF8C7"
          borderRadius={20}
          onClick={() => {
            handlePlanChange('basic', String(1000000000000000000 * 3000));
          }}
          backgroundColor={plan === 'basic' ? '#106d57' : 'transparent'}
        >
          <Text mb={3} fontSize={20}>
            Basic Plan
          </Text>
          <Text>5 - 20 quests</Text>
          <Text>Price: 1 ETH / year</Text>
        </Box>
        <Box
          cursor="pointer"
          p={4}
          boxShadow="inset 0px 0px 0px 1px #ff7038"
          borderRadius={20}
          onClick={() => {
            handlePlanChange('premium', String(1000000000000000000 * 6000));
          }}
          backgroundColor={plan === 'premium' ? '#583426' : 'transparent'}
        >
          <Text mb={3} fontSize={20}>
            Premium plan
          </Text>
          <Text>20 - ∞ quests</Text>
          <Text>Price: 2 ETH / year</Text>
        </Box>
      </Flex>

      {plan !== '' && plan !== 'free' && (
        <Box>
          <Text>Recipient&apos;s address</Text>
          <Input
            name="recipient"
            readOnly
            value={DAOQUEST_ADDRESS}
            placeholder="Enter recipient address"
            mb={4}
          ></Input>

          <Flex>
            <Text mr={4}>Flowrate in wei/year: </Text>
            <Text>{flowRatePerYear}</Text>
          </Flex>
          <Flex>
            <Text mr={4}>Flowrate in wei/second: </Text>
            <Text>{flowRatePerSecond}</Text>
          </Flex>

          <Button
            onClick={() => {
              setIsButtonLoading(true);
              createNewFlow(DAOQUEST_ADDRESS, flowRatePerSecond);
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
              <b>
                $
                {flowRateDisplay !== ' '
                  ? Math.ceil(Number(flowRateDisplay))
                  : 0}
              </b>{' '}
              DAIx/month
            </p>
          </Box>
        </Box>
      )}
    </div>
  );
};

import { AddIcon } from '@chakra-ui/icons';
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Image,
  Input,
  Link,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { constants, utils } from 'ethers';
import { MutableRefObject, useState } from 'react';

import { useInputText } from '@/hooks/useInputText';
import { getAddressUrl, useWallet } from '@/web3';

import { MarkdownEditor } from '../MarkdownEditor';
import { QuestTile } from '../QuestTile';
import { SubmitButton } from '../SubmitButton';
import { AddQuestBlock } from './AddQuestBlock';

export const QuestsForm: React.FC<{
  onPublishQuestChain: (
    quests: { name: string; description: string }[],
    startAsDisabled: boolean,
  ) => void | Promise<void>;
  isPremium: boolean;
  approveTokens: () => void | Promise<void>;
  isApproved: boolean;
  goBackToNFTSelection: () => void;
  globalInfo: Record<string, graphql.GlobalInfoFragment>;
}> = ({
  globalInfo,
  onPublishQuestChain,
  isPremium,
  approveTokens,
  isApproved,
  goBackToNFTSelection,
}) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editingQuestIndex, setEditingQuestIndex] = useState(0);

  const [questNameRef, setQuestName] = useInputText();
  const [questDescRef, setQuestDesc] = useInputText();

  const [startAsDisabled, setStartAsDisabled] = useState(false);

  const [quests, setQuests] = useState<{ name: string; description: string }[]>(
    [],
  );

  const onAddQuest = async (name: string, description: string) => {
    setQuests([...quests, { name, description }]);
    return true;
  };

  const onRemoveQuest = (index: number) => {
    setQuests(quests.filter((_, i) => i !== index));
  };

  const onEditQuest = (name: string, description: string, index: number) => {
    setIsEditingQuest(false);
    setQuests(quests.map((_, i) => (i === index ? { name, description } : _)));
  };

  const { chainId } = useWallet();

  const paymentToken = chainId
    ? globalInfo[chainId].paymentToken
    : { decimals: 18, address: constants.AddressZero, symbol: 'TOKEN' };

  const upgradeFee = chainId ? globalInfo[chainId].upgradeFee : '0';

  const upgradeFeeAmount = utils.formatUnits(upgradeFee, paymentToken.decimals);

  return (
    <>
      <VStack
        w="full"
        align="stretch"
        spacing={10}
        boxShadow="inset 0px 0px 0px 1px white"
        borderRadius={10}
        px={{ base: 4, md: 12 }}
        py={8}
      >
        <HStack w="full">
          <Box
            py={1}
            px={3}
            borderWidth={1}
            borderColor="gray.500"
            color="gray.500"
            borderRadius={4}
            mr={4}
          >
            STEP 4
          </Box>
          <Text fontWeight="bold" fontSize={16}>
            Quests
          </Text>
        </HStack>
        <Flex
          w="full"
          gap={8}
          mb={14}
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <Accordion allowMultiple w="full" defaultIndex={[]}>
            {quests &&
              quests.map(({ name, description }, index) =>
                isEditingQuest && editingQuestIndex === index ? (
                  <EditingQuest
                    key={name + description}
                    nameRef={questNameRef}
                    descRef={questDescRef}
                    setQuestName={setQuestName}
                    setQuestDesc={setQuestDesc}
                    onSave={onEditQuest}
                    index={index}
                  />
                ) : (
                  <QuestTile
                    key={name + description}
                    name={`${index + 1}. ${name}`}
                    description={description}
                    onRemoveQuest={() => onRemoveQuest(index)}
                    onEditQuest={() => {
                      setQuestName(name);
                      setQuestDesc(description);
                      setIsEditingQuest(true);
                      setEditingQuestIndex(index);
                    }}
                    isCreatingChain
                  />
                ),
              )}
          </Accordion>
          {isAddingQuest && (
            <AddQuestBlock
              onClose={() => setIsAddingQuest(false)}
              onAdd={onAddQuest}
            />
          )}
          {!isAddingQuest && (
            <>
              {!quests.length && (
                <>
                  <Image
                    src="/CreateChain/bullseye.svg"
                    alt="circles3"
                    w={20}
                  />
                  <Text fontSize={20} fontWeight="bold">
                    Finally, let’s add some quests.
                  </Text>
                </>
              )}
              <Button
                borderWidth={1}
                borderColor="white"
                borderRadius="full"
                py={2}
                px={{ base: 10, md: 40 }}
                isDisabled={isEditingQuest}
                onClick={() => setIsAddingQuest(true)}
              >
                <AddIcon fontSize="sm" mr={2} />
                Add a Quest
              </Button>
            </>
          )}
          {!quests.length && (
            <Text>
              It is perfectly fine to add quests after the quest chain has been
              published.
            </Text>
          )}
        </Flex>
      </VStack>

      <Flex w="full" justifyContent="center">
        <Tooltip
          label="A disabled quest chain won't be visible to public. You can enable it at a later time."
          shouldWrapChildren
        >
          <Checkbox
            isChecked={startAsDisabled}
            onChange={() => setStartAsDisabled(!startAsDisabled)}
          >
            <Text borderBottom="dotted 1px">Start quest chain as disabled</Text>
          </Checkbox>
        </Tooltip>
      </Flex>

      {isPremium && (
        <Flex
          bgColor="blackAlpha.600"
          py={{ base: 6, md: 10 }}
          px={{ base: 7, md: 12 }}
          gap={3}
          borderRadius={10}
        >
          <Image src="/CreateChain/gem-premium.svg" alt="circles3" w={16} />
          <Box>
            <Text fontSize={18} fontWeight="bold" mb={3}>
              This quest chain has a 3D/Custom completion NFT, which is a
              PREMIUM feature and costs {upgradeFeeAmount}{' '}
              <Link
                isExternal
                href={getAddressUrl(paymentToken.address, chainId)}
                textDecoration="underline"
                color="main"
              >
                {paymentToken.symbol}
              </Link>
              {' tokens.'}
            </Text>
            <Text
              fontSize={14}
              decoration="underline"
              cursor="pointer"
              onClick={goBackToNFTSelection}
            >
              Changed your mind? Downgrade to 2D and publish for free.
            </Text>
          </Box>
        </Flex>
      )}

      <Flex w="full" gap={4}>
        {isPremium && !isApproved && (
          <SubmitButton
            isDisabled={!(isPremium && !isApproved)}
            onClick={async () => approveTokens()}
            flex={1}
            fontSize={{ base: 12, md: 16 }}
          >
            APPROVE TOKENS
          </SubmitButton>
        )}
        <SubmitButton
          isDisabled={isPremium && !isApproved}
          onClick={async () => onPublishQuestChain(quests, startAsDisabled)}
          flex={1}
          fontSize={{ base: 12, md: 16 }}
        >
          PUBLISH QUEST CHAIN
        </SubmitButton>
      </Flex>
    </>
  );
};

export const EditingQuest: React.FC<{
  nameRef: MutableRefObject<string>;
  descRef: MutableRefObject<string>;
  setQuestName: (name: string) => void;
  setQuestDesc: (description: string) => void;
  onSave: (name: string, description: string, index: number) => void;
  index: number;
}> = ({ nameRef, descRef, setQuestName, setQuestDesc, onSave, index }) => {
  return (
    <Flex flexDir="column" bg="gray.900" borderRadius={10} gap={3} mb={3} p={4}>
      <Input
        bg="#0F172A"
        defaultValue={nameRef.current}
        maxLength={60}
        onChange={e => setQuestName(e.target.value)}
      />
      <MarkdownEditor value={descRef.current ?? ''} onChange={setQuestDesc} />
      <Button onClick={() => onSave(nameRef.current, descRef.current, index)}>
        Save
      </Button>
    </Flex>
  );
};

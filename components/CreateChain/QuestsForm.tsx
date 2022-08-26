import { AddIcon, EditIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { MarkdownViewer } from '@/components/MarkdownViewer';
import { QuestChainInfoFragment } from '@/graphql/types';
import { UserStatusType } from '@/pages/chain/[chainId]/[address]';

import { MarkdownEditor } from '../MarkdownEditor';
import { SubmitButton } from '../SubmitButton';
import { UploadProofButton } from '../UploadProofButton';
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
}> = ({
  onPublishQuestChain,
  isPremium,
  approveTokens,
  isApproved,
  goBackToNFTSelection,
}) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editingQuestIndex, setEditingQuestIndex] = useState(0);
  const [questDescription, setDescription] = useState('');
  const [questName, setName] = useState('');
  const [startAsDisabled, setStartAsDisabled] = useState(false);

  const [quests, setQuests] = useState<{ name: string; description: string }[]>(
    [],
  );

  const onAddQuest = (name: string, description: string) =>
    setQuests([...quests, { name, description }]);

  const onRemoveQuest = (index: number) => {
    setQuests(quests.filter((_, i) => i !== index));
  };

  const onEditQuest = (name: string, description: string, index: number) => {
    setIsEditingQuest(false);
    setQuests(quests.map((_, i) => (i === index ? { name, description } : _)));
  };

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
          <Accordion allowMultiple w="full">
            {quests &&
              quests.map(({ name, description }, index) =>
                isEditingQuest && editingQuestIndex === index ? (
                  <EditingQuest
                    key={name + description}
                    name={questName}
                    description={questDescription}
                    setName={setName}
                    setDescription={setDescription}
                    onSave={onEditQuest}
                    index={index}
                  ></EditingQuest>
                ) : (
                  <Quest
                    key={name + description}
                    name={`${index + 1}. ${name}`}
                    description={description}
                    onRemoveQuest={() => onRemoveQuest(index)}
                    onEditQuest={() => {
                      setName(name);
                      setDescription(description);
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
              This quest chain has a 3D completion NFT, which is a PREMIUM
              feature and costs 2{' '}
              <Link
                mx={1}
                isExternal
                href="https://metagame.wtf/seeds"
                textDecoration="underline"
              >
                SEED tokens
              </Link>
              .
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
            type="submit"
            flex={1}
            fontSize={{ base: 12, md: 16 }}
          >
            APPROVE TOKENS
          </SubmitButton>
        )}
        <SubmitButton
          isDisabled={isPremium && !isApproved}
          onClick={async () => onPublishQuestChain(quests, startAsDisabled)}
          type="submit"
          flex={1}
          fontSize={{ base: 12, md: 16 }}
        >
          PUBLISH QUEST CHAIN
        </SubmitButton>
      </Flex>
    </>
  );
};

export const Quest: React.FC<{
  name: string;
  description: string;
  onRemoveQuest?: () => void;
  onEditQuest: () => void;
  isMember?: boolean;
  bgColor?: string;
  questId?: string;
  userStatus?: UserStatusType;
  questChain?: QuestChainInfoFragment;
  refresh?: () => void;
  isCreatingChain?: boolean;
}> = ({
  name,
  description,
  onRemoveQuest,
  onEditQuest,
  isMember = true,
  bgColor = 'gray.900',
  questId,
  userStatus,
  questChain,
  refresh,
  isCreatingChain = false,
}) => {
  return (
    <AccordionItem bg={bgColor} borderRadius={10} px={4} mb={3} border={0}>
      <Flex alignItems="center">
        <AccordionButton py={6}>
          <Box flex="1" textAlign="left" fontWeight="bold">
            {name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        {isMember && (
          <>
            {isCreatingChain && (
              <Tooltip label="Delete Quest">
                <IconButton
                  icon={<SmallCloseIcon />}
                  onClick={onRemoveQuest}
                  aria-label=""
                  bg="transparent"
                />
              </Tooltip>
            )}
            <Tooltip label="Edit Quest">
              <IconButton
                icon={<EditIcon />}
                onClick={onEditQuest}
                aria-label=""
                bg="transparent"
              />
            </Tooltip>
          </>
        )}
      </Flex>
      <AccordionPanel>
        <MarkdownViewer markdown={description} />
        {questId && userStatus && questChain && refresh && (
          <UploadProofButton
            questId={questId}
            name={name}
            questChain={questChain}
            userStatus={userStatus}
            refresh={refresh}
          />
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export const EditingQuest: React.FC<{
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  onSave: (name: string, description: string, index: number) => void;
  index: number;
}> = ({ name, description, setName, setDescription, onSave, index }) => {
  return (
    <Flex flexDir="column" bg="gray.900" borderRadius={10} gap={3} mb={3} p={4}>
      <Input
        bg="#0F172A"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <MarkdownEditor value={description ?? ''} onChange={setDescription} />
      <Button onClick={() => onSave(name, description, index)}>Save</Button>
    </Flex>
  );
};
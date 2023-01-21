import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';

import { QuestAdvSetting } from './QuestsForm';

const defaultQuestAdvSetting: QuestAdvSetting = {
  paused: false,
  optional: false,
  skipReview: false,
};

export const AddQuestBlock: React.FC<{
  onClose: () => void;
  onAdd: (
    name: string,
    desc: string,
    questAdvSetting: QuestAdvSetting | null,
  ) => Promise<boolean>;
  isAdding?: boolean;
}> = ({ onClose, onAdd, isAdding = false }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();

  const [isAdvancedSetOpen, setIsAdvancedSetOpen] = useState(false);
  const [questAdvSetting, setQuestAdvSetting] = useState(
    defaultQuestAdvSetting,
  );

  const onSubmit = useCallback(async () => {
    const success = await onAdd(
      nameRef.current,
      descRef.current,
      questAdvSetting === defaultQuestAdvSetting ? null : questAdvSetting,
    );
    if (success) {
      setName('');
      setDescription('');
      setQuestAdvSetting(defaultQuestAdvSetting);
      onClose();
    }
  }, [
    onAdd,
    onClose,
    nameRef,
    descRef,
    questAdvSetting,
    setName,
    setDescription,
    setQuestAdvSetting,
  ]);

  return (
    <form style={{ width: '100%' }}>
      <VStack spacing={4} pb={4} w="100%">
        <FormControl isRequired px={4}>
          <FormLabel htmlFor="name">Quest Name</FormLabel>
          <Input
            color="white"
            defaultValue={nameRef.current}
            bg="#0F172A"
            id="name"
            maxLength={60}
            onChange={e => setName(e.target.value)}
            placeholder="Quest Name"
          />
        </FormControl>
        <FormControl isRequired px={4}>
          <FormLabel htmlFor="description">Quest Description</FormLabel>
          <MarkdownEditor
            height="12rem"
            value={descRef.current}
            placeholder="Quest Description"
            onChange={setDescription}
          />

          {/* TODO add advanced setting to edit quest when quest is already created */}
          <Flex
            flexDirection={'row'}
            justify={'space-evenly'}
            align={'center'}
            w={'100%'}
            gap={'1'}
            mt={'2rem'}
            cursor={'pointer'}
            onClick={() => setIsAdvancedSetOpen(prev => !prev)}
          >
            <Divider />
            <Flex
              flexDirection={'row'}
              justify={'space-evenly'}
              align={'center'}
              gap={'1'}
            >
              <Text
                whiteSpace={'nowrap'}
                fontSize="sm"
                lineHeight={'16px'}
                color="main"
              >
                Advanced settings
              </Text>
            </Flex>
            {isAdvancedSetOpen ? (
              <TriangleUpIcon color="main" h="10px" w="10px" />
            ) : (
              <TriangleDownIcon color="main" h="10px" w="10px" />
            )}
            <Divider />
          </Flex>

          {/* TODO this component changes width of the parent. See if this is okay, else fix it. */}
          {isAdvancedSetOpen ? (
            <Flex
              mt={'1rem'}
              px="4"
              lineHeight={'3rem'}
              justify={'start'}
              flexDirection={'column'}
              gap={'1rem'}
            >
              {/* TODO child Select options are not exactly like figma */}
              <Box>
                The quest is{' '}
                <Select
                  rounded={'full'}
                  variant="filled"
                  w={'fit-content'}
                  display={'inline-block'}
                  value={
                    questAdvSetting.optional === false ? 'required' : 'optional'
                  }
                  onChange={e =>
                    setQuestAdvSetting(prevState => {
                      return {
                        ...prevState,
                        optional: e.target.value === 'required' ? false : true,
                      };
                    })
                  }
                >
                  <option value="required">required</option>
                  <option value="optional">optional</option>
                </Select>{' '}
                and submissions of proof will be reviewed{' '}
                <Select
                  rounded={'full'}
                  variant="filled"
                  w={'fit-content'}
                  display={'inline-block'}
                  value={
                    questAdvSetting.skipReview === false
                      ? 'reviewed_manually'
                      : 'auto_accepted'
                  }
                  onChange={e =>
                    setQuestAdvSetting(prevState => {
                      return {
                        ...prevState,
                        skipReview:
                          e.target.value === 'reviewed_manually' ? false : true,
                      };
                    })
                  }
                >
                  <option value="reviewed_manually">reviewed manually</option>
                  <option value="auto_accepted">auto-accepted</option>
                </Select>
              </Box>
              <Divider />
              <Flex align={'center'} justify={'space-between'}>
                <FormLabel htmlFor="questDisabled" mb="0">
                  Start quest as disabled
                </FormLabel>
                {/* TODO Not exactly like figma */}
                <Switch
                  id="questDisabled"
                  size="lg"
                  isChecked={questAdvSetting.paused}
                  onChange={e =>
                    setQuestAdvSetting(prevState => {
                      return {
                        ...prevState,
                        paused: e.target.checked ? true : false,
                      };
                    })
                  }
                />
              </Flex>
              <Divider />
            </Flex>
          ) : null}
        </FormControl>

        <Flex
          align="center"
          justify="space-between"
          gap={4}
          w="full"
          pt={2}
          px={4}
        >
          <SubmitButton
            onClick={() => {
              if (!nameRef.current || !descRef.current) {
                toast.error(
                  'To continue, enter the name and description for the quest',
                );
                return;
              }
              onSubmit();
            }}
            fontSize="sm"
            isLoading={isAdding}
            height={10}
            flex={1}
          >
            Add quest
          </SubmitButton>
          <SubmitButton
            onClick={onClose}
            flex={1}
            isDisabled={isAdding}
            fontSize="sm"
            bg="transparent"
            height={10}
            border="1px solid #9EFCE5"
            color="#9EFCE5"
            _hover={{
              bg: 'whiteAlpha.200',
            }}
          >
            Cancel
          </SubmitButton>
        </Flex>
      </VStack>
    </form>
  );
};
